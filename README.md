

## Introduction
本项目为携程配置中心框架 Apollo 提供的Node.js版本客户端。

客户端连接成功后，会拉取所有配置到本地存储一份，通过`Http long polling` 机制实时监控配置更新，一定有配置更新，会立即触发回调事件 `onChange(configObj)`响应最新的配置，也可以通过`getConfig()` 函数获取最新的配置。

apollo 服务端测试环境:
* host: `106.54.227.205`
* 账号: `apollo`
* 密码: `admin`

## Features
* 时实同步配置（Http Long Polling）
* 灰度配置发布
* 缓存配置到本地
* 自定义日志
* 配置更新回调通知
* 支持 TypeScript

## Usage
```
const log = require('loglevel');
const ApolloClient = require('ctrip-apollo-client');
log.setLevel('debug');

// 创建一个客户端实例
const client = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa'],
    logger: log
});

// 初始化配置
client.init();

// 监控配置更新
client.onChange((config) => {
    log.info('config update:', config);
});

// 获取配置
const config = client.getConfig();
log.info('get config:', config);
```
## API
**new ApolloClient(options)** 构造函数
* Returns: `apolloClient`
* **options**
    * **configServerUrl** `string` `required` Apollo配置服务的地址
    * **appId** `string` `required` 应用的appId
    * **clusterName** `string` 集群名,默认值:`default`
    * **namespaceList** `array` Namespace的名字,默认值:`[application]`
    * **configPath** `string` 本地配置文件路径 默认值`./config/apolloConfig.json`
    * **logger** `object` 日志类 必须实现 `logger.info()`,`logger.error()` 两个方法

**init()** 拉取所有配置到本地，并且写入配置文件中
* Returns: `promise`

**getConfig()**  获取最新的配置文件
* Returns: `object`

**getValue ({namespace,field})**  获取具体的配置字段
* Returns: `string`
* namespace 默认值: `application`
* field `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值

**onChange (callback(object))**  配置变更回调通知
* Returns: `void`

## License

[MIT](LICENSE)


