import { Guard } from '../types/guards';
import { errorMessage } from '../utils/messages';

/**
 * Creates a custom type from a typeguard function
 */
export = function custom<T>(name: string, validator: (input: unknown) => input is T) {
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
