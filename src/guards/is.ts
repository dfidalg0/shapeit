import { FromPrimitive, Primitive } from '../types/utils';
import guard from './guard';

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
    const isValid = guard(target, (input): input is FromPrimitive<T> => {
        const type = input === null ? 'null' : typeof input;

        return type === target;
    });

    return isValid;
}
