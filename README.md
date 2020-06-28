

## Introduction
本项目为携程配置中心框架 Apollo 提供的Node.js版本客户端。

客户端连接成功后，会拉取所有配置到本地存储一份，通过`Http long polling` 机制实时监控配置更新，一定有配置更新，会立即触发回调事件 `onChange(configObj)`响应最新的配置，也可以通过`getConfig()` 函数获取最新的配置。

apollo 服务端测试环境:
* host: `106.54.227.205`
* 账号: `apollo`
* 密码: `admin`

## Features
* 配置热更新
* 缓存配置到本地
* 灰度发布
* 支持 TypeScript

## Usage

* [typescript demo](./example/ts-demo/index.ts)

```typescript
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
```
[javascript demo 请点击链接](./example/js-demo/index.js)

## API

**ApolloClient(options)** 构造函数
* returns: `apolloClient`
* options
    * **configServerUrl** `string` `required` Apollo配置服务的地址
    * **appId** `string` `required` 应用的appId
    * **clusterName** `string` 集群名,默认值:`default`
    * **namespaceList** `array` Namespace的名字,默认值:`[application]`
    * **configPath** `string` 本地配置文件路径 默认值`./config/apolloConfig.json`
    * **logger** `object` 日志类 必须实现 `logger.info()`,`logger.error()` 两个方法
**init()** 拉取所有配置到本地，并且写入配置文件中
* returns: `object`

**init()** 初始化配置中心，拉取远端配置到端上，并且缓存一份到文件中，同时开启配置变更监听器来实时同步配置，如果拉取超过 timeoutMs ，或者发生异常，则读取本地缓存的配置文件。如果本地没有缓存配置文件，抛出异常。

* timeoutMs

return: Promise<void>

**getConfigs()**  获取最新的配置文件

* returns: `object`
```
const config = apollo.getConfigs();
```

**getValue (namespace = 'application')**  获取具体的配置字段
* returns: `string`
* namespace 默认值: `application`
* field `string` eg: `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值
```
class User {
    get userName () {
        return apollo.getValue({ field: 'user.name:liuwei' });
    }
}
```
**hotValue (namespace = 'application')**  获取具体的配置字段，封装 `getter`(热更新)
* returns: `{value}` 
* namespace 默认值: `application`
* field `string` 属性位置 eg: `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值
```
const userName = apollo.hotValue({ field: 'user.name:liuwei' });
console.log(userName.value);
```

**withValue(target, key, field, namespace)**

* returns: `void` 
* target 目标对象
* key 需要注入对象的属性
* field `string` 属性位置 eg: `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值
* namespace `string` 默认值:`application`
  
```
class User {
    constructor () {
        withValue(this, 'userId', { field: 'user.id:10071' });
    }
}
// userId 属性会跟随配置更新
new User().userId
```

**onChange (callback(object))**  配置变更回调通知
* returns: `void`

**value(field, namespace)** 注入器，只能注入类的属性

* field `string` 字段属性
* namespace `string`
```
import { value } from 'ctrip-apollo-client';
class User {
    @value("user.name:liuwei")
    public name: string
}
```
## Benchmark
 **一次性注入** [localValue] x **736,896,802** ops/sec ±1.49% (82 runs sampled)
 **支持热更新** [hotValue] x **2,021,310** ops/sec ±1.28% (87 runs sampled)
 **热更新默认值** [hotValue default] x **1,581,645** ops/sec ±0.89% (87 runs sampled)
 **装饰器注入**  [decorator] x **2,161,312** ops/sec ±0.96% (87 runs sampled)
**原生访问** [dot] x **704,644,395** ops/sec ±1.45% (82 runs sampled)
Fastest is [localValue]


## License

[MIT](LICENSE)


