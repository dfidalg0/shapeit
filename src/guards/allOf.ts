import { PrimitiveOrGuard, GuardType } from '../types/guards';
import { ErrorsMapping } from '../types/validation';
import { NonEmptyArray } from '../types/utils';
import { resolveGuard } from '../utils/guards';
import makeGuard from './guard';

type GuardArray = NonEmptyArray<PrimitiveOrGuard<unknown>>;

type _TupleToIntersection<
    T extends GuardArray,
    I extends number = 0
> = `${I}` extends keyof T
    ? GuardType<T[I]> &(
        T extends [unknown, ...infer U]
            ? U extends GuardArray
                ? TupleToIntersection<U>
                : unknown
            : unknown
    )
    : unknown;

type TupleToIntersection<T extends GuardArray> = _TupleToIntersection<T>;

/**
 * Creates a guard for a intersection type from primitive names or other guards
 *
 * @example
 * const isValid = allOf(
 *     looseShape({ a: 'string' }, false),
 *     looseShape({ b: 'number' }, false)
 * );
 *
 * if (isValid(input)) {
 *     doSomethingWith(input); // input is typed as { a: string; b: number; }
 * }
 * else {
 *     console.error(isValid.errors); // Errors found
 * }
 */
export default function allOf<T extends GuardArray>(...types: T) {
    if (!types.length) {
        throw new Error('No guards provided');
    }

    const guards = types.map(resolveGuard);

    const isValid = makeGuard('all-of', (input): input is TupleToIntersection<T> => {
        let result = true;

        for (const guard of guards) {
            const current = guard(input);

            result &&= current;
        }

        if (!result) {
            const errors: ErrorsMapping = {};

            for (const guard of guards) {
                for (const { path, message } of guard.errors?.all || []) {
                    (errors[path] ||= []).push(message);
                }
            }

            isValid.errors = errors;
        }

        return result;
    });

    return isValid;
}
