import { ErrorsMapping, ValidationErrors } from '../types/validation';

export function makeErrors(raw: ErrorsMapping): ValidationErrors {
    const all = Object.entries(raw).flatMap(([path, messages]) => {
        return messages?.map(message => ({
            path, message
        })) || [];
    });

    const clone = { ...raw } as ValidationErrors;

    Object.defineProperty(clone, 'all', {
        value: all,
        configurable: false,
        enumerable: false,
        writable: false,
    });

    return clone;
}
