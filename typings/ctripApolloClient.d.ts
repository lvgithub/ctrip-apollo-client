interface StringArray {
    [index: number]: string;
}
interface Option {
    configServerUrl: string
    appId: string
    configPath?: string
    namespaceList?: StringArray
    logger?: object
}
declare class CtripApplloClient {
    constructor(option: Option)
    init(): Promise<any>
    getConfig(): Promise<any>
    getValue(option: {
        namespace?: string
        field: string
    }): string
    onChange(callback: (obj: any) => void): void
}

export = CtripApplloClient;