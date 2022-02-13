import {
    LiterableName,
    Literable,
    LiteralDescriptor,
    FromLiteralDescriptor,
    Template,
    Concat
} from '../types/literals';
import { FromPrimitive } from '../types/utils';

const regexMap = {
    string: '.*',
    number: '(?:\\d+\\.\\d*|\\d*\\.\\d+|\\d+)(?:[eE][+-]?\\d+)?',
    bigint: '\\d+',
    boolean: 'true|false',
    null: 'null',
    undefined: 'undefined'
};


/**
 * Creates a literal descriptor from type names or constant unions
 *
 * @example
 * $('boolean'); // Equivalent to `${boolean}` in a literal type
 *
 * @example
 *
 * $('boolean', $$(10, 11)); // Equivalent to `${boolean | 10 | 11}` in a literal type
 */
export function $ <T extends (LiterableName | LiteralDescriptor)[]>(...values: T) {
    const descriptors = values.map(v => {
        if (typeof v === 'string') {
            return {
                regex: regexMap[v],
                typename: v
            } as LiteralDescriptor;
        }

        return v;
    });

    type ValueTypes<U> =
        U extends LiterableName
            ? FromPrimitive<U>
            : FromLiteralDescriptor<U>;

    const typename = descriptors.map(d => d.typename)
        .join('|')
        .replace(/\$/g, '\\$');

    const regex = '(' + descriptors.map(d => `${d.regex}`).join('|') + ')';

    type DescriptorType = ValueTypes<T[number]>;

    return {
        typename,
        regex
    } as LiteralDescriptor<DescriptorType>;
}

/**
 * Creates a literal descriptor from a constant union
 *
 * @example
 * $$('id', 'ID'); // Equivalent to `${'id' | 'ID'}` in a literal type
 */
export function $$<T extends Literable[]>(...values: T): LiteralDescriptor<T[number]> {
    const typename = values.map(valueToRegex).join('|');

    return {
        regex: `(${typename})`,
        typename
    } as LiteralDescriptor<T[number]>;
}

/**
 * Creates a literal descriptor from a literal template.
 *
 * @example
 * $$$('a', $('number')); // Equivalent to `${`a${number}`}` in a literal type
 */
export function $$$<T extends Template>(...template: T) {
    let regex = '';
    let typename = '`';

    for (const item of template) {
        if (typeof item === 'string') {
            regex += valueToRegex(item);
            typename += item;
        }
        else if ('regex' in item) {
            regex += item.regex;
            typename += `\${${item.typename}}`;
        }
    }

    typename += '`';

    return {
        typename,
        regex
    } as LiteralDescriptor<Concat<T>>;
}

function valueToRegex(value: Literable) {
    if (typeof value !== 'string') {
        value = String(value);
    }

    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn`
    // escape when the simpler form would be disallowed by Unicode patterns’
    // stricter grammar.
    return value
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
