import { PrimitiveOrGuard, Guard, GuardType } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { resolveGuard } from '../utils/guards';
import { errorMessage, sizeErrorMessage } from '../utils/messages';

export = arrayOf;

/**
 * Creates an array shape where all elements must have the same type
 *
 * @example
 * const emailsShape = sp.arrayOf('string');
 *
 * @example
 * const peopleShape = sp.arrayOf(
 *   sp.shape({
 *     name: 'string',
 *     age: 'number'
 *   })
 * );
 */
function arrayOf<T extends PrimitiveOrGuard<unknown>>(
    type: T, maxLength = Infinity
) {
    const guard = resolveGuard(type);

    if (maxLength <= 0) {
        throw new Error('maxLength should be greater than 0');
    }

    const isValid: Guard<GuardType<T>[]> = Object.assign((input: unknown): input is GuardType<T>[] => {
        if (!Array.isArray(input)) {
            isValid.errors = {
                $: [errorMessage('array')]
            };

            return false;
        }

        if (input.length > maxLength) {
            isValid.errors = {
                $: [sizeErrorMessage(`<= ${maxLength}`)]
            };

            return false;
        }

        let result = true;

        const errors: Exclude<ValidationErrors, null> = {};

        for (let i = 0; i < input.length; ++i) {
            const current = guard(input[i]);

            result = result && current;

            if (guard.errors) {
                for (const [subpath, messages] of Object.entries(guard.errors)) {
                    const root = `$.${i}`;

                    const path = subpath.replace('$', root);

                    if (errors[path]) {
                        errors[path].push(...messages);
                    }
                    else {
                        errors[path] = [...messages];
                    }
                }
            }
        }

        isValid.errors = result ? null : errors;

        return result;
    }, {
        errors: null
    });

    return isValid;
}
