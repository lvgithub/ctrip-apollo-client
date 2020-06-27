const log = require('loglevel')
const { CtripApplloClient } = require('../../src/index')
log.setLevel('debug')

// 初始化客户端
const apollo = new CtripApplloClient({
  configServerUrl: 'http://106.54.227.205:8080',
  appId: 'apolloclient',
  configPath: './config/apolloConfig.json',
  namespaceList: ['application', 'development.qa'],
  logger: log
})

// 初始化配置
apollo.init().then(() => {
  // 不支持热更新
  const port = apollo.getValue('app.port')
  // 支持热更新，具体的值需要通过 userSex.value 获取
  const userSex = apollo.hotValue('user.sex:man')

  class User {
    constructor () {
      // 热更新，注入 userId 属性
      withValue(this, 'userId', 'user.id:10071')
    }
  }
  // 获取所有配置
  const config = apollo.getConfig()
})

// 监控配置变更
apollo.onChange(config => {})
