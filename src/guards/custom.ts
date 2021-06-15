import { Guard } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { errorMessage } from '../utils/messages';

export = custom;

/**
 * Creates a custom type from a typeguard function
 *
 * @example
 * const myCustomType = sp.custom('myCustomType', (input): input is MyCustomType => {
 *   let result : boolean;
 *
 *   // test if input is MyCustomType
 *
 *   return result;
 * });
 */
function custom<T>(name: string, validator: (input: unknown) => input is T) {
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

            if (override && result && errors) {
                console.warn(`[Shapeit Warning] custom guard ${name} error was set when input was valid`);
            }
            else if (override && !result && !errors) {
                console.warn(`[Shapeit Warning] custom guard ${name} error was set to null when input was valid`);
            }

            return result;
        }, {
            errors: {
                get() {
                    return errors;
                },
                set (err) {
                    errors = err;
                    override = true;
                }
            }
        }
    );

    return isValid;
}
