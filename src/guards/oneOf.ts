import { PrimitiveOrGuard, GuardType, Guard } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { resolveGuard } from '../utils/guards';

export = oneOf;

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
function oneOf<T extends PrimitiveOrGuard<unknown>[]>(...types: T) {
    if (!types.length) {
        throw new Error('No guards provided');
    }

    const guards = types.map(resolveGuard);

    const isValid: Guard<GuardType<T[number]>> = Object.assign(
        (input: unknown): input is GuardType<T[number]> => {
            const result = guards.some(guard => guard(input));

            if (result) isValid.errors = null;
            else {
                const errors: Exclude<ValidationErrors, null> = {};

                for (const guard of guards) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    for (const [path, guardErrors] of Object.entries(guard.errors!)) {
                        if (!errors[path]) {
                            errors[path] = guardErrors;
                        }
                        else {
                            errors[path].push(...guardErrors);
                        }
                    }
                }

                isValid.errors = errors;
            }

            return result;
        }, {
            errors: null
        }
    );

    return isValid;
}
