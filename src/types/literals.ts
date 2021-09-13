import { FromPrimitive } from './utils';

export type BaseName =
    | 'string' | 'number' | 'bigint'
    |'boolean' | 'null'   | 'undefined';

export type BaseType = FromPrimitive<BaseName>;

export interface Literal<T extends BaseType[] = BaseType[]> {
    values: T;
}

type FromNarrow<N extends Literal> = N extends Literal<infer T>
    ? T[number]
    : never;

export interface LitType<
    T extends (BaseName | Literal)[] = (BaseName | Literal)[]
> {
    types: T;
}

type _FilterOr<T extends Literal | BaseName> = T extends BaseName
    ? FromPrimitive<T>
    : T extends Literal
        ? FromNarrow<T>
        : never;

type FromOr<O extends LitType> = O extends LitType<infer T>
    ? _FilterOr<T[number]>
    : never;

export type Template = Readonly<(string | BaseName | Literal | LitType)[]>;

export type Concat<T extends Template> =
    T extends [infer S, ...(infer P)] ?
        P extends Template ?
            S extends string ?
                `${S}${Concat<P>}`
                : S extends Literal ?
                    `${FromNarrow<S>}${Concat<P>}`
                    : S extends LitType ?
                        `${FromOr<S>}${Concat<P>}`
                        : ''
            : ''
        : ''
