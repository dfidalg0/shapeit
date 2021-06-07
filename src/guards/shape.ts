import { reduce, omit } from 'lodash';
import { GuardSchema, Guard, ShapeGuard, UnshapeSchema } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { resolveGuard, isPlainRecord } from '../utils/guards';
import { errorMessage } from '../utils/messages';

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
export = function shape<V extends GuardSchema>(
    schema: V, strict = true
) {
    const guardsMap = reduce(schema, (res, val, key) => {
        res[key] = resolveGuard(val);

        return res;
    }, {} as Record<string, Guard<unknown>>);

    const isValid: ShapeGuard<UnshapeSchema<V>> = Object.assign(
        (input: unknown): input is UnshapeSchema<V> => {
            if (!isPlainRecord(input)) {
                isValid.errors = {
                    $: [errorMessage('object')]
                };

                return false;
            }

            const keys = Object.keys(schema);

            let result = true;

            if (strict) {
                const extraneousKeys = Object.keys(omit(input, keys));

                if (extraneousKeys.length) {
                    isValid.errors = extraneousKeys.reduce((res, key) => {
                        res[`$.${key}`] = [errorMessage('undefined')];

                        return res;
                    }, {} as Exclude<ValidationErrors, null>);

                    return false;
                }
            }

            const entries = keys
                .map(key => {
                    const root = `$.${key}`;

                    return [root, guardsMap[key], input[key]] as const;
                });

            const errors: Exclude<ValidationErrors, null> = {};

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
