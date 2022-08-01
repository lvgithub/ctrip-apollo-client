interface StringArray {
    [index: number]: string;
}
export interface Option {
    metaServerUrl?: string
    configServerUrl?: string
    appId: string
    clusterName?: string
    namespaceList?: StringArray
    accessKey?: string
    configPath?: string
    initTimeoutMs?: number
    onChange?: function
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
    ready(): Promise<any>
    stop(): void
}

export function value(field: string, namespace?: string): value
export function withValue(target: any, key: string, field: string, namespace?: string): void
export function hotValue(field: string, namespace?: string): value
