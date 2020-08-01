

随着业务使用的持续迭代， [watch](https://github.com/lvgithub/stick#readme) 持续关注~

## Introduction

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1ghbnklwk6dj30va0k8teo.jpg" alt="image-20200718092438648" style="zoom:50%;" />



中心配置 `mysql.host:127.0.0.1`  客户端会自动转化为Json `{ mysql:{ host: 127.0.0.1 } } }` 方便处理。

## apollo 服务端测试环境:

* host: http://106.54.227.205/
* 账号: `apollo`
* 密码: `admin`

## Features
* 配置热更新
* 缓存配置到本地
* 灰度发布
* 支持 TypeScript

## Links

* [Install](https://www.npmjs.com/package/@lvgithub/ctrip-apollo-client)
* [GettingStarted](https://github.com/lvgithub/ctrip-apollo-client/blob/master/docs/GettingStarted.md)
* [API  Reference](https://github.com/lvgithub/ctrip-apollo-client/blob/master/docs/API.MD)
* [License](https://github.com/lvgithub/ctrip-apollo-client/blob/master/LICENSE)

## Benchmark
**一次性注入** [localValue] x **736,896,802** ops/sec ±1.49% (82 runs sampled)

**支持热更新** [hotValue] x **2,021,310** ops/sec ±1.28% (87 runs sampled)

**热更新默认值** [hotValue default] x **1,581,645** ops/sec ±0.89% (87 runs sampled)

**装饰器注入**  [decorator] x **2,161,312** ops/sec ±0.96% (87 runs sampled)

**原生访问** [dot] x **704,644,395** ops/sec ±1.45% (82 runs sampled)

Fastest is [localValue]


