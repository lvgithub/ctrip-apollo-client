import { CtripApplloClient, value, hotValue } from 'ctrip-apollo-client';
import Koa from 'koa';

const apollo = new CtripApplloClient({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient',
    configPath: './config/apolloConfig.json',
    namespaceList: ['application', 'development.qa']
});
const app = new Koa();

const run = async () => {
    // 初始化配置
    await apollo.init();

    // 获取的配置，不会热更新
    const port = apollo.getValue('app.port:3000');
    // 获取配置，支持热更新，需要通过 appName.value 获取最终值
    const appName = hotValue('app.name:apollo-demo');

    class User {
        // 通过装饰器注入，支持热更新
        // 只能注入类的属性
        @value("user.name:liuwei")
        public name: string
    }
    const user = new User();

    app.use(async (ctx, next) => {
        ctx.body = {
            appName: appName.value,
            userName: user.name
        }
        await next();
    })
    app.listen(port);
    console.log('listening on port:', port);
    console.info(`curl --location --request GET \'http://localhost:${port}\' `);
}
run();






