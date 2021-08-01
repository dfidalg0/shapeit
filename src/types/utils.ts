export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type Primitive =
    | 'number' | 'string' | 'boolean'
    | 'bigint' | 'object' | 'symbol'
    | 'null' | 'undefined';

export type FromPrimitive<T extends Primitive> = {
    number: number;
    string: string;
    boolean: boolean;
    bigint: bigint;
    object: object;
    symbol: symbol;
    null: null;
    undefined: undefined;
}[T];
