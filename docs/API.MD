**new ApolloClient(options)** 构造函数
* returns: `apolloClient`

* options
    * **metaServerUrl** `string` meta server 地址,负载均衡获取 config server 地址
    * **configServerUrl** `string` config server 地址，配置了metaServerUrl 本项可以不配置
    * **appId** `string` `required` 应用的appId
    * **accessKey** `string` Apollo AccessKey
    * **clusterName** `string` 集群名,默认值:`default`
    * **namespaceList** `array` Namespace的名字,默认值:`[application]`
    * **configPath** `string` 本地配置文件路径 默认值`./config/apolloConfig.json`
    * **logger** `object` 日志类 必须实现 `logger.info()`,`logger.error()` 两个方法
    
    ```javascript
    const apollo = new CtripApolloClient({
        configServerUrl: 'http://106.54.227.205:8080',
        appId: 'apolloclient',
        configPath: './config/apolloConfig.json',
        namespaceList: ['application', 'development.qa'],
        logger: log
    })
    ```
    
    

**init(timeoutMs)** 
初始化配置中心，拉取远端配置到端上，并且缓存一份到文件中，同时开启`HTTP Long Polling`来实时监控配置，如果拉取超过 timeoutMs ，或者发生异常，则读取本地缓存的配置文件。如果本地没有缓存配置文件，抛出异常。
* return: Promise<void>   
* timeoutMs 超时时间

```javascript
apollo.init().then(() => {
    // 获取所有配置
    const config = apollo.getConfigs()
})
```



**getConfigs()**  获取最新的配置文件

* returns: `object`
```
const config = apollo.getConfigs();
```

**getValue (field, namespace = 'application')**  获取具体的配置字段
* returns: `string`
* namespace 默认值: `application`
* field `string` eg: `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值
```
class User {
    get userName () {
        return apollo.getValue('user.name:liuwei');
    }
}
```
**hotValue (field, namespace = 'application')**  获取具体的配置字段，封装 `getter`(热更新)
* returns: `{value}` 
* namespace 默认值: `application`
* field `string` 属性位置 eg: `mysql.port:3306` 分号前面key,如果未配置 3306 作为默认值
```
const userName = apollo.hotValue('user.name:liuwei');
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