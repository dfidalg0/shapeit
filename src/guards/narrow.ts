import isEqual from 'lodash.isequal';
import { Guard } from '../types/guards';
import { NonEmptyArray } from '../types/utils';
import oneOf from './oneOf';
import guard from './guard';

type Cast<A, B> = A extends B ? A : B;

type Narrowable =
    | string
    | number
    | bigint
    | boolean;

type Narrow<A> = A extends (...args: any) => any ? never : Cast<A,
    | []
    | (A extends Narrowable ? A : never)
    | ({ [K in keyof A]: Narrow<A[K]> })
>;

/**
 * Creates a guard that perfectly narrows a type.
 *
 * @example
 * const is10 = sp.narrow(10);
 *
 * if (is10(input)) {
 *   input; // typed as 10
 * }
 *
 * @example
 * const isAorB = sp.narrow('a', 'b');
 *
 * if (isAorB(input)) {
 *   input; // typed as 'a' | 'b'
 * }
 */
export default function narrow<T, U extends NonEmptyArray<Narrow<T>>> (...targets: U): Guard<U[number]> {
    targets = targets.filter(t => typeof t !== 'function') as U;

    if (!targets.length) {
        throw new Error('No valid narrowable objects provided');
    }

    if (targets.length === 1) {
        const target = targets[0];

        const typename = genType(target);

        const isValid = guard(
            typename,
            (input): input is U[number] => isEqual(input, target)
        );

        return isValid;
    }

    const narrows = targets.map(t => narrow(t)) as NonEmptyArray<any>;

    return oneOf(...narrows);
}

export function genType(target: unknown) {
    const type = typeOf(target);

    if (type !== 'object') {
        if (['null', 'undefined'].includes(type))
            return type;

        if (type === 'symbol')
            return `Symbol(${(target as symbol).description})`;

        if (type === 'string')
            return `[string] ${JSON.stringify(target)}`;

        return `[${type}] ${target}`;
    }

    const constructor = (
        Object.getPrototypeOf(target)?.constructor.name ||
        'Object: null prototype'
    );

    const content: string = Object.entries(target as object)
        .map(([key, value]) => `${JSON.stringify(key)}: ${genType(value)}`)
        .join(', ');

    return `[${constructor}] {${content}}`;
}

function typeOf(target: unknown) {
    const type = target === null ? 'null' : typeof target;

    if (type === 'object') {
        const constructor = Object.getPrototypeOf(target)?.constructor;

        if (constructor === Number) {
            return 'number';
        }

        if (constructor === String) {
            return 'string';
        }
    }

    return type;
}
