import { is } from '../guards';
import { ShapeGuard, PrimitiveOrGuard } from '../types/guards';

export function isShapeGuard(guard: unknown): guard is ShapeGuard {
    return typeof guard === 'function' && '_shape' in guard;
}

export function isPlainRecord(input: unknown): input is Record<string, unknown> {
    return (
        typeof input === 'object' &&
        input !== null &&
        !Array.isArray(input) &&
        !Object.getOwnPropertySymbols(input).length
    );
}

export function resolveGuard(guardOrPrimitive: PrimitiveOrGuard<unknown>) {
    if (typeof guardOrPrimitive === 'string') {
        return is(guardOrPrimitive);
    }

    return guardOrPrimitive;
}
