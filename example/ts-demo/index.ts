import CtripApplloClient from 'ctrip-apollo-client';

const apollo = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

apollo.init().then(() => {
    const mysqlHost = apollo.getValue({ field: 'mysql.host' });
    console.log('mysqlHost', mysqlHost);
})
apollo.onChange((config) => {
    console.log('config', config)
    const mysqlPort = apollo.getValue({ field: 'mysql.port:3306' });
    console.log('mysqlPort', mysqlPort);
})


