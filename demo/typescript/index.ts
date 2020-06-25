import CtripApplloClient from 'ctrip-apollo-client';

const client = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

client.init().then(config => {
    console.log(config)
})
client.onChange((config) => {
    console.log(config)
})
