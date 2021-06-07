export type ValidationResult = {
    valid: true;
    errors: null;
} | {
    valid: false;
    errors: Record<string, string[]>;
}

export type ValidationErrors = ValidationResult['errors'];
