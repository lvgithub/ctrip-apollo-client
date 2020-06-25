const log = require('loglevel');
const Client = require('../../src/index');
log.setLevel('debug');

const client = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa'],
    logger: log
});

client.init().then(() => {
    const mysqlHost = client.getValue({ field: 'mysql.host' });
    console.log('mysqlHost', mysqlHost);
});
client.onChange((config) => {
    console.log('config', config);
    const mysqlPort = client.getValue({ field: 'mysql.port:3306' });
    console.log('mysqlPort', mysqlPort);
});
const config = client.getConfig();
log.info('get config:', config);
