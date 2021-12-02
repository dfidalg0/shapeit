export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type Primitive =
    | 'number'  | 'string' | 'boolean'
    | 'bigint'  | 'object' | 'symbol'
    | 'function'| 'null'   | 'undefined';

export type FromPrimitive<T extends Primitive> = {
    number: number;
    string: string;
    boolean: boolean;
    bigint: bigint;
    object: object;
    symbol: symbol;
    function: Function;
    null: null;
    undefined: undefined;
}[T];

export type NonEmptyArray<T> = T[] & { 0: T };
