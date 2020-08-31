const axios = require('./utils').axios
const Promise = require('bluebird')
const debug = require('debug')('ctrip-apollo-client')
const set = require('set-value')
const get = require('get-value')
const fs = require('fs')
const path = require('path')
const internalIp = require('internal-ip')
const crypto = require('crypto')

const logPreStr = 'apollo-client: '

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
const reject = ms => new Promise((resolve, reject) => setTimeout(() => reject(new Error('request time out')), ms))
class Client {
    constructor (option) {
        const {
            configServerUrl,
            appId,
            clusterName,
            namespaceList,
            accessKey,
            configPath,
            initTimeoutMs,
            onChange,
            logger
        } = option
        // 初始化超时
        this.initTimeoutMs = initTimeoutMs || 10000
        // 有配置更新回调
        this.onPolling = onChange
        // this.pollingIntervalMs = pollingIntervalMs || 1000 * 60;
        this.apolloConfig = {}
        this.configServerUrl = configServerUrl
        this.appId = appId
        this.clusterName = clusterName || 'cluster'
        this.namespaceList = namespaceList || ['application']
        this.accessKey = accessKey || ''
        this.configPath = configPath || './config/apolloConfig.json'
        this.notifications = {}
        this.info = (...args) => {
            debug(logPreStr, ...args)
            logger && logger.info && logger.info(logPreStr + args.join(' '))
        }
        this.error = (...args) => {
            debug(logPreStr, ...args)
            logger && logger.error && logger.error(logPreStr + args.join(' '))
        }
        this.namespaceList.forEach(item => {
            this.notifications[item] = -1
        })

        internalIp.v4().then(clientIp => {
            this.info('clientIp', clientIp)
            this.clientIp = clientIp
        })

        // 实现long http polling
        // 递归害怕长时间运行有爆栈的危险
        // this.polling = async () => {
        //     try {
        //         await this.pollingNotification()
        //     } catch (error) {
        //         this.error('polling error:', error)
        //         await sleep(1000)
        //     }
        //     this.polling()
        // }

        // timeOut 是为了等待取得clientIp
        // 因为第一次notifications.id 默认值为-1 所以本函数也是初始化配置的地方
        setTimeout(() => {
            this.polling()
        }, 2000)

        global._apollo = this
    }

    async polling () {
        let pollingCount = 1
        while (true) {
            this.info('polling count:', pollingCount++)
            try {
                await this.pollingNotification()
            } catch (error) {
                this.error('polling error:', error)
                await sleep(1000)
            }
        }
    }

    // 从缓存中拉取配置文件
    async fetchConfigFromCache () {
        const urlList = []
        const config = {}
        this.namespaceList.map(namespace => {
            const url = `${this.configServerUrl}/configfiles/json/${this.appId}/${this.clusterName}/${namespace}?ip=${this.clientIp}`
            urlList.push({ namespace, url })
        })
        for (const item of urlList) {
            try {
                const res = await axios.get(item.url, {headers: this.genAuthHeaders(item.url, this.accessKey)})
                config[item.namespace] = res.data
            } catch (error) {
                this.error('fetchConfigFromCache error:', error)
            }
        }
    }

    // 根据namespace拉取配置文件
    async fetchConfigFromDbByNamespace (namespace) {
        const config = this.getConfigs()
        const releaseKey =
            config && config[namespace] && config[namespace].releaseKey
        const url = `${this.configServerUrl}/configs/${this.appId}/${this.clusterName}/${namespace}?releaseKey=${releaseKey}&ip=${this.clientIp}`
        try {
            const res = await axios.get(url, { headers: this.genAuthHeaders(url, this.accessKey) });
            config[namespace] = res.data
        } catch (error) {
            this.error('fetchConfigFromDbByNamespace error:', error.message)
        }
        // this.apolloConfig = config;
        this.saveConfigsToFile(config)
    }

    // 拉取全量配置
    async fetchConfigFromDb () {
        const urlList = []
        const config = {}
        this.namespaceList.map(namespace => {
            const url = `${this.configServerUrl}/configs/${this.appId}/${this.clusterName}/${namespace}?ip=${this.clientIp}`
            urlList.push({ namespace, url })
        })
        for (const item of urlList) {
            try {
                const res = await axios.get(item.url, { headers: this.genAuthHeaders(item.url, this.accessKey) });
                config[item.namespace] = res.data
            } catch (error) {
                debug('fetchConfigFromDb error:', error.message)
                throw new Error('fetchConfigFromDb error')
            }
        }
        // this.apolloConfig = config;
        this.saveConfigsToFile(config)
    }

    // 监控配置文件变更
    async pollingNotification () {
        this.info('pollingNotification start')
        const notifications = JSON.stringify(
            Object.keys(this.notifications).map(namespace => {
                return {
                    namespaceName: namespace,
                    notificationId: this.notifications[namespace]
                }
            })
        )

        const notificationsEncode = encodeURIComponent(notifications)
        const url = `${this.configServerUrl}/notifications/v2?appId=${this.appId}&cluster=${this.clusterName}&notifications=${notificationsEncode}`

        try {
            const res = await axios.get(url, { headers: this.genAuthHeaders(url, this.accessKey) });
            const data = res.data
            if (data) {
                for (const item of data) {
                    await this.fetchConfigFromDbByNamespace(item.namespaceName)
                    this.notifications[item.namespaceName] = item.notificationId
                }
            }
        } catch (error) {
            if (+get(error, 'response.status') === 304) {
                return
            }
            this.error('pollingNotification error: ', error.message)
            throw error
        }
    }

    // 写入配置文件到磁盘
    saveConfigsToFile (configObj) {
        // const configObj = this.apolloConfig;
        const configPath = this.configPath
        const dirStr = path.dirname(configPath)

        if (!fs.existsSync(dirStr)) {
            fs.mkdirSync(dirStr, { recursive: true })
        }

        // 把点属性的key嵌套为对象
        this.info('map config begin')
        for (const namespace of Object.keys(configObj)) {
            const configurations = configObj[namespace].configurations
            const keys = Object.keys(configurations)
            for (const key of keys) {
                if (/\./.test(key)) {
                    // 把 {'a.b.c':1} 变成对象 {a:{b:{c:1}}}
                    set(configurations, key, configurations[key])
                    delete configurations[key]
                }
            }
        }
        this.apolloConfig = configObj
        this.info('map config end')
        this.onPolling && this.onPolling(configObj)
        this.info('write apollo config File Sync begin')
        // 使用同步的方式，必备异步写文件冲突
        fs.writeFileSync(configPath, JSON.stringify(configObj))
        this.info('write apollo config File Sync end')
    }

    // 读取本地配置文件
    readConfigsFromFile () {
        const configPath = this.configPath
        const fileBuf = fs.readFileSync(configPath)

        if (fileBuf <= 0) {
            throw new Error('拉取本地文件错误')
        }
        const configStr = fileBuf.toString()
        const configObj = JSON.parse(configStr)
        return configObj
    }

    // 拉取所有配置到本地
    async init (initTimeoutMs) {
        try {
            const ip = await internalIp.v4()
            this.clientIp = ip
            await Promise.race([
                this.fetchConfigFromDb(),
                reject(initTimeoutMs || this.initTimeoutMs)
            ])
        } catch (error) {
            // 初始化失败，恢复本地配置文件
            this.apolloConfig = this.readConfigsFromFile()
        }
    }

    getConfigs () {
        this.info('getConfigs: ', JSON.stringify(this.apolloConfig))
        return this.apolloConfig
    }

    onChange (cb) {
        this.onPolling = cb
    }

    getValue (field, namespace = 'application') {
        const [key, defaultValue] = field.split(':')
        if (!this.apolloConfig[namespace]) {
            return defaultValue
        }
        if (!this.apolloConfig[namespace].configurations) {
            return defaultValue
        }
        const configurations = this.apolloConfig[namespace].configurations
        const data = get(configurations, key)

        return data || defaultValue
    }

    // 通过 getter 实现获取最新配置
    hotValue (field, namespace = 'application') {
        return new (class Value {
            get value () {
                return global._apollo.getValue(field, namespace)
            }
        })()
    }

    withValue (target, key, field, namespace = 'application') {
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: () => {
                    return global._apollo.getValue(field, namespace)
                },
                set: () => {
                    return global._apollo.getValue(field, namespace)
                },
                enumerable: true,
                configurable: true
            })
        }
    }

    static value (field, namespace) {
        return function (target, key) {
            delete target[key]
            Object.defineProperty(target, key, {
                get: function () {
                    return global._apollo.getValue(field, namespace)
                },
                enumerable: true,
                configurable: true
            })
        }
    }

    static hotValue (field, namespace = 'application') {
        return global._apollo.hotValue(field, namespace)
    }

    static withValue (target, key, field, namespace = 'application') {
        return global._apollo.withValue(target, key, field, namespace)
    }

    /**
     * 生成访问签名头信息
     *
     * @param reqUrl 传入请求URL
     * @param secret 传入Apollo accessKey
     * @returns {{Authorization: 'xxx...', Timestamp: 1234}} || {{}}
     */
    genAuthHeaders(reqUrl, secret) {
        const Timestamp = Date.now();
        const Authorization = this.genSignature(reqUrl, Timestamp, secret);
        return secret ? {
            Authorization,
            Timestamp,
        } : {};
    }

    /**
     * 生成签名
     *
     * @param url 传入请求URL
     * @param timestamp 传入当前时间戳
     * @param secret 传入Apollo accessKey
     * @returns {string} 返回base64的签名字符串
     */
    genSignature(url, timestamp, secret) {
        const hmac = crypto.createHmac('sha1', secret);
        const signature = hmac.update(`${timestamp}\n${this.url2PathWithQuery(url)}`).digest().toString('base64');
        return `Apollo ${this.appId}:${signature}`;
    }

    /**
     * 生成请求路径 + 请求参数的url
     *
     * @param urlString 传入请求URL
     * @returns {string} /notifications/v2?appId=${this.appId}&cluster=${this.clusterName}&notifications=${notificationsEncode}
     */
    url2PathWithQuery(urlString) {
        const url = new URL(urlString);
        const path = url.pathname;
        const query = url.search;
        let pathWithQuery = path;
        if (query && query.length > 0) pathWithQuery += query;
        return pathWithQuery;
    }
}

exports.CtripApplloClient = Client
exports.value = Client.value
exports.hotValue = Client.hotValue
exports.withValue = Client.withValue
