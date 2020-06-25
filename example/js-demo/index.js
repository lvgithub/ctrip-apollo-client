const log = require('loglevel');
const Client = require('../../src/index');
log.setLevel('debug');

// 初始化客户端
const apollo = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa'],
    logger: log
});

// 初始化配置
apollo.init().then(() => {
    const mysqlHost = apollo.getValue({ field: 'mysql.host' });
    console.log('mysqlHost', mysqlHost);
});

// 监控配置变更
apollo.onChange((config) => {
    console.log('config', config);
    const mysqlPort = apollo.getValue({ field: 'mysql.port:3306' });
    console.log('mysqlPort', mysqlPort);
});

// 获取所有配置
const config = apollo.getConfig();
log.info('get config:', config);
