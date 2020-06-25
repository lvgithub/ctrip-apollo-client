import CtripApplloClient from 'ctrip-apollo-client';

const client = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

client.init().then(() => {
    const mysqlHost = client.getValue({ field: 'mysql.host' });
    console.log('mysqlHost', mysqlHost);
})
client.onChange((config) => {
    console.log('config', config)
    const mysqlPort = client.getValue({ field: 'mysql.port:3306' });
    console.log('mysqlPort', mysqlPort);
})


