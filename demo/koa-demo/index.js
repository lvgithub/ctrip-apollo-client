
const Client = require('../../src/index');
const Koa = require('koa');
const app = new Koa();

const apollo = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

class User {
    get userName () {
        return apollo.getValue({ field: 'user.name:liuwei' });
    }
}

const run = async () => {
    await apollo.init();
    const user = new User();

    app.use(async ctx => {
        // 配置变更后，会自动同步
        ctx.body = user.userName;
    });
    app.listen(3000);
};
run();
