import { Guard } from '../types/guards';
import { ErrorsMapping, ValidationErrors } from '../types/validation';
import { errorMessage } from '../utils/messages';
import { config } from '..';
import { makeErrors } from '../utils/validation';

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
    let rawErrors: ErrorsMapping | null = null;
    let errors : ValidationErrors | null = null;
    let overrideAllowed = false;
    let override = false;

    const isValid = <Guard<T>> Object.defineProperties(
        (input: unknown): input is T => {
            overrideAllowed = true;
            override = false;

            const result = validator(input);

            overrideAllowed = false;

            if (!override) {
                rawErrors = result ? null : {
                    $: [errorMessage(name)]
                };
            }

            if (config.get('showWarnings')) {
                if (override && result && rawErrors) {
                    console.warn(`[Shapeit Warning] custom guard ${name} error was set when input was valid`);
                }
                else if (override && !result && !rawErrors) {
                    console.warn(`[Shapeit Warning] custom guard ${name} error was set to null when input was not valid`);
                }
            }

            errors = rawErrors ? makeErrors(rawErrors) : null;

            return result;
        }, {
            errors: {
                get() {
                    return errors;
                },
                set (err: ErrorsMapping | null) {
                    if (!overrideAllowed) {
                        if (config.get('showWarnings')) {
                            console.warn('[Shapeit warning] guard errors override outside validator detected');
                        }

                        return;
                    }

                    rawErrors = err;
                    override = true;
                }
            },
            typename: {
                value: name,
                configurable: false,
                enumerable: true,
                writable: false,
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
