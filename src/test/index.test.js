const { CtripApolloClient } = require('../index')
const client = new CtripApolloClient({
    metaServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    accessKey: '35be8a4868c748ec96faef3e326adad5',
    configPath: './config/apolloConfig.json'
})

test('test configServerUrl and metaServerUrl all be empty', () => {
  try {
    new CtripApolloClient({
      appId: 'apolloclient',
      accessKey: '35be8a4868c748ec96faef3e326adad5',
      configPath: './config/apolloConfig.json'
    })
  } catch (error) {
    expect(error instanceof Error).toBeTruthy()
  }
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

test('test apollo ready ok', async () => {
  const client = new CtripApolloClient({
    metaServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    accessKey: '35be8a4868c748ec96faef3e326adad5',
    configPath: './config/apolloConfig.json',
    initTimeoutMs: 1000
  });

  const res  = await client.ready();
  expect(res).toBeUndefined()
})

test('test apollo ready failed', async () => {
  const client = new CtripApolloClient({
    metaServerUrl: 'http://106.54.227.2:8080',
    appId: 'apolloclient',
    accessKey: '35be8a4868c748ec96faef3e326adad5',
    configPath: './config/apolloConfig.json',
    initTimeoutMs: 1000
  });

  const err = await client.ready().catch((err) => err)
  expect(err instanceof Error).toBeTruthy()
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
