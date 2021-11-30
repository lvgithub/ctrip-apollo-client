interface StringArray {
    [index: number]: string;
}
interface Option {
    metaServerUrl?: string
    configServerUrl?: string
    appId: string
    accessKey?: string
    configPath?: string
    namespaceList?: StringArray
    clusterName?: string
    logger?: object
}
export class value {
    public value: string
}
export declare class CtripApolloClient {
    constructor(option: Option)
    static value(field: string, namespace?: string): value
    hotValue(field: string, namespace?: string): value
    static withValue(target: any, key: string, field: string, namespace?: string): void
    withValue(target: any, key: string, field: string, namespace?: string): void
    init(): Promise<any>
    getConfigs(): Promise<any>
    getValue(field: string, namespace?: string): string
    onChange(callback: (obj: any) => void): void
}

export function value(field: string, namespace?: string): value
export function withValue(target: any, key: string, field: string, namespace?: string): void
export function hotValue(field: string, namespace?: string): value
