import { Guard } from '../types/guards';
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
    const isValid: Guard<T> = Object.assign(
        (input: unknown): input is T => {
            const result = validator(input);

            isValid.errors = result ? null : {
                $: [errorMessage(name)]
            };

            return result;
        },
        { errors: null }
    )

    return isValid;
}
