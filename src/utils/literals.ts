import { BaseName, BaseType, Literal, LitType } from '../types/literals';

/**
 * Creates a literal type part with type names or constant unions
 *
 * @example
 * $('boolean'); // Equivalent to `${boolean}` in a literal type
 *
 * @example
 *
 * $('boolean', $$(10, 11)); // Equivalent to `${boolean | 10 | 11}` in a literal type
 */
export function $ <T extends (BaseName | Literal)[]>(...values: T): LitType<T> {
    return { types: values };
}

/**
 * Creates a literal type part with a constant union
 *
 * @example
 * $$('id', 'ID'); // Equivalent to `${'id' | 'ID'}` in a literal type
 */
export function $$<T extends BaseType[]>(...values: T): Literal<T> {
    return { values };
}

export function escapeRegex(string: string) {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }

    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
