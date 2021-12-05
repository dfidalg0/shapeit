import { PrimitiveOrGuard, UnshapeTuple } from '../types/guards';
import { ValidationErrors } from '../types/validation';
import { resolveGuard } from '../utils/guards';
import { sizeErrorMessage } from '../utils/messages';
import makeGuard from './guard';

/**
 * Creates a guard for a tuple type. The order of the arguments is the same
 * as the type order of the tuple
 *
 * @example
 * const entryShape = sp.tuple('string', 'number');
 *
 * if (entryShape(input)) {
 *   input; // Typed as [string, number]
 * }
 */
export default function tuple<T extends PrimitiveOrGuard<unknown>[]>(...types: T) {
    const guards = types.map(resolveGuard);

    const isValid = makeGuard('tuple', (input): input is UnshapeTuple<T> => {
        if (!Array.isArray(input)) {
            return false;
        }

        if (input.length !== guards.length) {
            isValid.errors = {
                $: [sizeErrorMessage(guards.length)]
            };

            return false;
        }

        const errors: Exclude<ValidationErrors, null> = {};

        let result = true;

        for (let i = 0; i < input.length; ++i) {
            const guard = guards[i];

            const current = guard(input[i]);

            result = result && current;

            if (guard.errors) {
                for (const [subpath, messages] of Object.entries(guard.errors)) {
                    const root = `$.${i}`;

                    const path = subpath.replace('$', root);

                    (errors[path] ||= []).push(...messages || []);
                }
            }
        }

        isValid.errors = result ? null : errors;

        return result;
    });

    return isValid;
}
