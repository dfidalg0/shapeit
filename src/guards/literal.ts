import { Guard } from '../types/guards';
import { Template, Concat, BaseName, Literal } from '../types/literals';
import { errorMessage } from '../utils/messages';
import { escapeRegex } from '../utils/literals';

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
function literal<T extends Template>(...template: T) {
    let regexString = '^';

    for (const item of template) {
        if (typeof item === 'string') {
            regexString += escapeRegex(item);
        }
        else if ('types' in item) {
            regexString += resolveLiterals(item.types);
        }
        else if ('values' in item) {
            regexString += resolveLiterals([item]);
        }
    }

    regexString += '$';

    const regex = new RegExp(regexString);

    const isValid: Guard<Concat<T>> = Object.assign(
        (input: unknown): input is Concat<T> => {
            const result = Boolean(typeof input === 'string' && input.match(regex));

            isValid.errors = result ? null : {
                $: [errorMessage(`(literal) ${regexString}`)]
            };

            return result;
        }, {
            errors: null
        }
    );

    return isValid;
};

export = literal;

function resolveLiterals(literals: (BaseName | Literal)[]) {
    const match = literals.map(lit => {
        if (typeof lit === 'string') {
            return resolveTypeName(lit);
        }

        return lit.values.map(v => escapeRegex(String(v))).join('|');
    }).join('|');

    return `(${match})`;
}

function resolveTypeName(name: BaseName) {
    switch (name) {
        case 'bigint': return '\\d+';
        case 'number': return '\\d+\\.\\d*|\\d*\\.\\d+|\\d+';
        case 'string': return '.*';
        case 'boolean': return 'true|false';
        case 'null':
        case 'undefined': return name;
    }
}
