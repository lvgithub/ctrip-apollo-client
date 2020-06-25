const log = require('loglevel');
const Client = require('../../src/index');
log.setLevel('debug');

const apollo = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa'],
    logger: log
});

apollo.init().then(() => {
    const mysqlHost = apollo.getValue({ field: 'mysql.host' });
    console.log('mysqlHost', mysqlHost);
});
apollo.onChange((config) => {
    console.log('config', config);
    const mysqlPort = apollo.getValue({ field: 'mysql.port:3306' });
    console.log('mysqlPort', mysqlPort);
});
const config = apollo.getConfig();
log.info('get config:', config);
