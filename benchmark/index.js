const Benchmark = require('benchmark')
const { CtripApolloClient, withValue } = require('../src/index')
const suite = new Benchmark.Suite()
const configJSON = {
    application: {
        configurations: {
            port: '8099',
            mysql: {
                host: '127.0.0.1'
            },
            user: {
                name: '刘威',
                sex: 'woman',
                id: '456'
            },
            app: {
                port: '3001',
                name: 'ts-apollo-demo'
            }
        }
    }
}

// 初始化客户端
const apollo = new CtripApolloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
})
const run = async () => {
    await apollo.init()
    const userNameValue = apollo.getValue('user.name:liuwei')
    const userName = apollo.hotValue('user.name:liuwei')
    const defaultValue = apollo.hotValue('redis.port:9902')
    class User {
        constructor () {
        // 热更新，注入 userId 属性
            withValue(this, 'userName', 'user.name:liuwei')
        }
    }
    const user = new User()
    console.log('userName', userName.value)
    console.log('userName', user.userName)
    console.log('defaultValue', defaultValue.value)
    suite
        .add('[localValue]', function () {
            const v = userNameValue
        })
        .add('[hotValue]', function () {
            const v = userName.value
        })
        .add('[hotValue default]', function () {
            const v = defaultValue.value
        })
        .add('[decorator]', function () {
            const v = user.userName
        })
        .add('[dot]', function () {
            const v = configJSON.application.configurations.user.name
        })
        .on('cycle', function (event) {
            console.log(String(event.target))
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'))
        })
        .run({ async: true })
}
run()
