import reduce from 'lodash/reduce';
import omit from 'lodash/omit';
import { GuardSchema, Guard, ShapeGuard, UnshapeSchema } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { resolveGuard, isPlainRecord } from '../utils/guards';
import { errorMessage } from '../utils/messages';

export = shape;

/**
 * Makes a guard for an object. Types can be specified with other guards or
 * primitive names.
 *
 * @example
 * const isValidData = shape({
 *   name: 'string',
 *   emails: arrayOf('string')
 * });
 *
 * if (isValidData(input)) {
 *   doSomethingWith(input); // input is typed as { name: string, emails: string[] }
 * }
 * else {
 *   console.error(isValidData.errors); // Errors found
 * }
 */
function shape<V extends GuardSchema>(
    schema: V, strict = true
) {
    const guardsMap = reduce(schema, (res, val, key) => {
        res[key] = resolveGuard(val);

        return res;
    }, {} as Record<string, Guard<unknown>>);

    const keys = Object.keys(schema);

    const isValid: ShapeGuard<UnshapeSchema<V>> = Object.assign(
        (input: unknown): input is UnshapeSchema<V> => {
            if (!isPlainRecord(input)) {
                isValid.errors = {
                    $: [errorMessage('object')]
                };

                return false;
            }

            let result = true;
            let errors: Exclude<ValidationErrors, null> = {};

            if (strict) {
                const extraneousKeys = Object.keys(omit(input, keys));

                if (extraneousKeys.length) {
                    errors = extraneousKeys.reduce((res, key) => {
                        res[`$.${key}`] = [errorMessage('undefined')];

                        return res;
                    }, {} as Exclude<ValidationErrors, null>);

                    result = false;
                }
            }

            const entries = keys
                .map(key => {
                    const root = `$.${key}`;

                    return [root, guardsMap[key], input[key]] as const;
                });

            for (const [root, guard, value] of entries) {
                const current = guard(value);

                result = result && current;

                if (guard.errors) {
                    for (const [subpath, messages] of Object.entries(guard.errors)) {
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
            errors: null,
            _shape: {
                schema, strict
            }
        }
    );

    return isValid;
}
