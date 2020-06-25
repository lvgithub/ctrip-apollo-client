interface Option {
    configServerUrl: string
    appId: string
    configPath?: string
    namespaceList?: [string]
    logger?: object
}
declare class CtripApplloClient {
    constructor(option: Option) {

    }
    init(): Promise<Any>
    getConfig(): Promise<Any>
    onChange(callback: (obj: Any) => void): void
}

export = ctripApplloClient;