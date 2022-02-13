import { $$$ } from '../utils/literals';
import { Template, Concat } from '../types/literals';
import guard from './guard';

/**
 * Creates a guard for a template literal type
 *
 * @example
 * const idTemplate = sp.literal('id-', sp.$('bigint'));
 *
 * if (idTemplate(input)) {
 *   input; // input is typed as `id-${bigint}`
 * }
 */
export default function literal<T extends Template>(...template: T) {
    const descriptor = $$$(...template);

    const regexString = `^${descriptor.regex}$`;
    const { typename } = descriptor;

    const regex = new RegExp(regexString);

    const isValid = guard(typename, (input): input is Concat<T> => {
        return typeof input === 'string' && regex.test(input);
    });

    delete (descriptor as any).typename;

    return Object.assign(isValid, descriptor);
}
