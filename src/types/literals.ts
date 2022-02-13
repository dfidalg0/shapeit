import { FromPrimitive } from './utils';

export type LiterableName =
    | 'string' | 'number'
    | 'bigint' | 'boolean'
    | 'null'   | 'undefined';

export type Literable = FromPrimitive<LiterableName>;

export type LiteralDescriptor<T extends Literable = Literable> = {
    /**
     * @private This is used only to control typings. DO NOT USE
     */
    _type: T;
    typename: string;
    regex: string;
};

export type FromLiteralDescriptor<T> = T extends LiteralDescriptor<infer U> ? U : never;

export type TemplateItem = string | LiteralDescriptor<Literable>;

export type Template = Array<TemplateItem>;

export type ResolveLiteralType<T> =
    T extends LiteralDescriptor<infer S>
        ? S extends Literable
            ? `${S}`
            : ''
        : T extends string
            ? T
            : '';

export type Concat<T extends Template> =
    T extends [infer S, ...infer P]
        ? P extends Template
            ? `${ResolveLiteralType<S>}${Concat<P>}`
            : ''
        : '';
