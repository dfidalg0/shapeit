export function errorMessage(typename: string) {
    return `Invalid type provided. Expected: '${typename}'`;
}

export function sizeErrorMessage(size: number | string) {
    return `Invalid size provided. Expected: ${size}`;
}
