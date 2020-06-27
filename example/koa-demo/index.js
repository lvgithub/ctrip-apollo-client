
const { CtripApplloClient } = require('../../src/index');
const Koa = require('koa');
const app = new Koa();

const apollo = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});

const withValue = apollo.withValue;

class User {
    constructor () {
        withValue(this, 'userId', { field: 'user.id:10071' });
    }
}

// 支持热更新
const userSex = apollo.hotValue({ field: 'user.sex:man' });

const run = async () => {
    await apollo.init();
    const user = new User();

    app.use(async ctx => {
        // 配置变更后，会自动同步
        ctx.body = {
            userId: user.userId,
            name: user.userName,
            sex: userSex.value
        };
    });
    app.listen(3000);
};
run();
