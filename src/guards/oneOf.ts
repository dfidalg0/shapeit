import { PrimitiveOrGuard, GuardType } from '../types/guards';
import { ErrorsMapping } from '../types/validation';
import { NonEmptyArray } from '../types/utils';
import { resolveGuard } from '../utils/guards';
import makeGuard from './guard';

/**
 * Creates a guard for a union type from primitive names or other guards
 *
 * @example
 * const isValid = oneOf('string', is('number'));
 *
 * if (isValid(input)) {
 *     doSomethingWith(input); // input is typed as string | number
 * }
 * else {
 *     console.error(isValid.errors); // Errors found
 * }
 */
export default function oneOf<T extends NonEmptyArray<PrimitiveOrGuard<unknown>>>(...types: T) {
    if (!types.length) {
        throw new Error('No guards provided');
    }

    const guards = types.map(resolveGuard);

    const isValid = makeGuard('one-of', (input): input is GuardType<T[number]> => {
        const result = guards.some(guard => guard(input));

        if (!result) {
            const errors: ErrorsMapping = {};

            for (const guard of guards) {
                for (const { path, message } of guard.errors!.all) {
                    (errors[path] ||= []).push(message);
                }
            }

            isValid.errors = errors;
        }

        return result;
    });

    return isValid;
}
