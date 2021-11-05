import { Guard } from '../types/guards';
import { FromPrimitive, Primitive } from '../types/utils';
import { errorMessage } from '../utils/messages';

/**
 * Basic Guard creator from a primitive name.
 *
 * @example
 * const isString = is('string');
 *
 * if (isString(value)) {
 *     doSomethingWith(value); // value is typed as string
 * }
 * else {
 *     console.error(isString.errors); // Errors found
 * }
 */
export default function is<T extends Primitive>(target: T) {
    const isValid: Guard<FromPrimitive<T>> = Object.assign(
        (input: unknown): input is FromPrimitive<T> => {
            const type = input === null ? 'null' : typeof input;

            const result = type === target;

            isValid.errors = result ? null : {
                $: [errorMessage(target)]
            };

            return result;
        }, {
            errors: null
        }
    );

    return isValid;
}
