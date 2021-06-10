import { isEqual } from 'lodash';
import { Guard } from '../types/guards';
import { errorMessage } from '../utils/messages';
import oneOf from './oneOf';

export = narrow;

type Cast<A, B> = A extends B ? A : B;

type Narrowable =
    | string
    | number
    | bigint
    | boolean;

type Narrow<A> = Cast<A,
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
function narrow <T, U extends Narrow<T>[]> (...targets: U): Guard<U[number]> {
    if (targets.length === 1) {
        const target = targets[0];

        const typename = genType(target);

        const isValid: Guard<U[number]> = Object.assign(
            (input: unknown): input is U[number] => {
                const result = isEqual(input, target);

                isValid.errors = result ? null : {
                    $: [errorMessage(typename)]
                };

                return result;
            },
            {
                errors: null
            }
        );

        return isValid;
    }

    return oneOf(...targets.map(t => narrow(t)));
}

function genType(target: unknown) {
    const type = target === null ? 'null' : typeof target;

    if (type !== 'object') {
        if (['null', 'undefined'].includes(type))
            return type;

        if (['symbol', 'function'].includes(type))
            return `(${type})`;

        return `(${type}) ${target}`;
    }

    const constructor = Object.getPrototypeOf(target).constructor.name;

    const content = JSON.stringify(target);

    return content ?
        `(${constructor}) ${content}` :
        `(${constructor})`;
}
