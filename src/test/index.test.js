const Client = require('../index');

const client = new Client({
    configServerUrl: 'http://106.54.227.205:8080',
    appId: 'apolloclient'
});
test('test getValue,getConfig', () => {
    const config = {
        application: {
            appId: 'apolloclient',
            cluster: 'default',
            namespaceName: 'application',
            configurations: {
                mysql: {
                    port: 3306
                }
            }
        }
    };
    client.apolloConfig = config;
    expect(JSON.stringify(client.getConfig())).toBe(JSON.stringify(config));
    expect(client.getValue({ field: 'mysql.port:3306' })).toBe(3306);
    expect(client.getValue({ field: 'mysql.host:127.0.0.1' })).toBe('127.0.0.1');
});

test('test onChange', () => {
    const cb = () => { };
    client.onChange(cb);
    expect(client.onPolling).toBe(cb);
});
