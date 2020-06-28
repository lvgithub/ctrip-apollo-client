const { CtripApplloClient } = require('../index')
const client = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json'
})
test('test getValue,getConfigs', () => {
    const config = {
        application: {
            appId: 'apolloclient',
            cluster: 'default',
            namespaceName: 'application',
            configurations: {
                mysql: {
                    port: 3306
                }
            }
        }
    }
    client.apolloConfig = config
    expect(JSON.stringify(client.getConfigs())).toBe(JSON.stringify(config))
    expect(client.getValue('mysql.port:3306')).toBe(3306)
    expect(client.getValue('mysql.host:127.0.0.1')).toBe('127.0.0.1')
})

test('test onChange', () => {
    const cb = () => { }
    client.onChange(cb)
    expect(client.onPolling).toBe(cb)
})

test('test hotValue', () => {
    expect(client.hotValue('mysql.port:3306').value).toBe(3306)
})

test('test withValue', () => {
    class User {
        constructor () {
            client.withValue(this, 'userId', 'user.id:10071')
        }
    }
    // userId 属性会跟随配置更新
    expect(new User().userId).toBe('10071')
})

test('test readConfigsFromFile', async () => {
    await client.init(2000)
    const config = client.readConfigsFromFile()
    expect(config.application).toBeTruthy()
    // console.log('config', JSON.stringify(config))
    // console.log('config', JSON.stringify(client.apolloConfig))

    expect(config).toEqual(client.apolloConfig)
})

// test('test static value', () => {
//     class User {
//         constructor () {
//             client.withValue(this, 'userId', 'user.id:10071');
//         }
//     }
//     // userId 属性会跟随配置更新
//     expect(new User().userId).toBe('10071');
// });
