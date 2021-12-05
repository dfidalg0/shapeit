import { Guard } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { errorMessage } from '../utils/messages';
import { config } from '..';

/**
 * Creates a guard from a typeguard function
 *
 * @example
 * const myCustomType = sp.guard('myCustomType', (input): input is MyCustomType => {
 *   let result : boolean;
 *
 *   // test if input is MyCustomType
 *
 *   return result;
 * });
 */
export default function guard<T>(name: string, validator: (input: unknown) => input is T) {
    let errors: ValidationErrors = null;
    let override = false;

    const isValid = <Guard<T>> Object.defineProperties(
        (input: unknown): input is T => {
            override = false;

            const result = validator(input);

            if (!override) {
                errors = result ? null : {
                    $: [errorMessage(name)]
                };
            }

            if (config.get('showWarnings')) {
                if (override && result && errors) {
                    console.warn(`[Shapeit Warning] custom guard ${name} error was set when input was valid`);
                }
                else if (override && !result && !errors) {
                    console.warn(`[Shapeit Warning] custom guard ${name} error was set to null when input was not valid`);
                }
            }

            return result;
        }, {
            errors: {
                get() {
                    return errors;
                },
                set (err: ValidationErrors) {
                    errors = err;
                    override = true;
                }
            }
        }
    );

    return isValid;
}

/**
 * This is an alias for sp.guard
 *
 * @alias guard
 */
export const custom = guard;
