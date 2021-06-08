import { Validator, ValidationResult } from '../types/validation';

function createAsserter() {
    const errors: string[] = [];

    return Object.assign(<T> (cond: T, msg: string) => {
        if (!cond) errors.push(msg);

        return cond;
    }, { errors });
}

async function _validateRecursion<T>(
    input: T, rules: Validator<T>,
    path: string, errors: Record<string, string[]>
): Promise<void> {
    if (typeof rules === 'function') {
        const isValid = rules;

        const assert = createAsserter();

        await isValid(input, assert);

        if (assert.errors.length) {
            errors[path] = assert.errors;
        }
    }
    else {
        let promises: Promise<void>[] = [];

        if (Array.isArray(rules)) {
            promises = rules.map(
                rule => _validateRecursion(input, rule, path, errors)
            );
        }
        else if (typeof input === 'object' && input !== null) {
            const keys = Object.keys(rules) as (keyof T)[];

            promises = keys
                .filter(key => key in input)
                .map(key => _validateRecursion(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    input[key], (rules as any)[key],
                    `${path}.${key}`, errors
                ));
        }

        await Promise.all(promises);
    }
}

export default async function validate<T>(
    input: T, rules: Validator<T>
): Promise<ValidationResult> {
    const errors: Record<string, string[]> = {};

    await _validateRecursion(input, rules, '$', errors);

    return Object.keys(errors).length ? {
        valid: false, errors
    } : {
        valid: true, errors: null
    };
}
