export type ValidationResult = {
    valid: true;
    errors: null;
} | {
    valid: false;
    errors: Record<string, string[]>;
}

export type ValidationErrors = ValidationResult['errors'];

export interface Rule<T> {
    (input: T, assert: <C> (condition: C, msg: string) => C): unknown;
}

export type RulesMap<T> = T extends object ? T extends unknown[] ?
    {
        $each: Validator<T[number]>
    } : {
        [K in keyof T]?: Validator<T[K]>
    } :
    never;

type ValidationSequence<T> = [Rule<T>, RulesMap<T>];

export type Validator<T> = ValidationSequence<T>[number] | ValidationSequence<T>;
