import { CtripApplloClient, value } from 'ctrip-apollo-client';

const apollo = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

// 初始化配置中心
apollo.init().then(() => {
    const mysqlHost = apollo.getValue({ field: 'mysql.host:3306' });
    class User {
        @value("user.name:liuwei")
        public name: string
    }

    setInterval(() => {
        const user = new User();
        // 如果配置 user.name 更新，会自动同步更新 user.name 的值
        console.log('user.name', user.name);
    }, 1000)
});

apollo.onChange((config) => {
    // console.log('config change', config);
})




