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
client.init();
client.onChange((config) => {
    log.info('config update:', config);
});
const config = client.getConfig();
log.info('get config:', config);
