export type ValidationResult = {
    valid: true;
    errors: null;
} | {
    valid: false;
    errors: Partial<Record<string, string[]>> /* & {
        readonly all: ValidationError[];
    }; */;
}

// export interface ValidationError {
//     path: string;
//     message: string;
// }

export type ValidationErrors = ValidationResult['errors'];

export interface Rule<T> {
    (input: T, assert: typeof import('../validation/assert').default): unknown
}

export type RulesMap<T> = T extends object
    ? T extends unknown[]
        ? {
            $each: RulesSet<T[number]>
        }
        : {
            [K in keyof T]?: RulesSet<T[K]>
        }
    : never;

export type RulesSet<T> = Rule<T> | RulesMap<T> | [RulesSet<T>, ...RulesSet<T>[]];

/**
 * This is an alias for RulesSet<T> in order to not break compatibility on
 * 0.5.1 patch release.
 *
 * @deprecated Use RulesSet<T> instead
 * @alias RulesSet
 */
export type Validator<T> = RulesSet<T>;
