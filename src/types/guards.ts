import { ValidationErrors } from './validation';
import { Primitive, FromPrimitive } from './utils';

/**
 * Typeguard for a determined type.
 */
export type Guard<T> = {
    (input: unknown): input is T;
    errors: ValidationErrors;
    _shape?: {
        schema: GuardSchema;
        strict: boolean;
    };
}

/**
 * Specific typeguard for objects with different shapes
 */
export type ShapeGuard<T extends Record<string, unknown> = Record<string, unknown>> = Guard<T> & {
    _shape: {
        schema: GuardSchema;
        strict: boolean;
    };
}

/**
 * Shorthand for Primitive | Guard<T>
 */
export type PrimitiveOrGuard<T> = Primitive | Guard<T>;

/**
 * Function to Extract type from a guard
 */
export type GuardType<G extends PrimitiveOrGuard<unknown>> =
    G extends Guard<infer T>
        ? T
        : G extends Primitive ? FromPrimitive<G> : never;

export type GuardSchema<T extends Record<string, unknown> = Record<string, unknown>> = {
    [K in keyof T]: PrimitiveOrGuard<T[K]>;
}

type OnlyDef<V extends GuardSchema, K extends keyof V> = K extends any ? Guard<undefined> extends V[K] ? never : K : never;
type OnlyUndef<V extends GuardSchema, K extends keyof V> = K extends any ? Guard<undefined> extends V[K] ? K : never : never;

export type UnshapeSchema<V extends GuardSchema> = {
    [K in OnlyDef<V, keyof V>]: GuardType<V[K]>;
} & {
    [K in OnlyUndef<V, keyof V>]?: Guard<undefined> extends V[K] ? GuardType<V[K]> : unknown;
}

export type UnshapeTuple<T extends readonly PrimitiveOrGuard<unknown>[]> = {
    [K in keyof T]: T[K] extends PrimitiveOrGuard<unknown>
        ? GuardType<T[K]>
        : T[K];
}
