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

export declare class CtripApplloClient {
    constructor(option: Option)
    static value(field: string, namespace?: string)
    init(): Promise<any>
    getConfig(): Promise<any>
    getValue(option: {
        namespace?: string
        field: string
    }): string
    onChange(callback: (obj: any) => void): void
}

export function value(field: string, namespace?: string)