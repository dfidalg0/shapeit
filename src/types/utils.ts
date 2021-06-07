export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type Primitive =
    | 'number' | 'string' | 'boolean'
    | 'bigint' | 'object' | 'symbol'
    | 'null' | 'undefined';

export type FromPrimitive<T extends Primitive> =
    T extends 'number' ? number :
    T extends 'string' ? string :
    T extends 'boolean' ? boolean :
    T extends 'bigint' ? bigint :
    T extends 'object' ? object :
    T extends 'symbol' ? symbol :
    T extends 'null' ? null :
    T extends 'undefined' ? undefined :
    never
