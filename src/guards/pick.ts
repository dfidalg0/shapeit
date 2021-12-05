import { ShapeGuard, GuardSchema, GuardType } from '../types/guards';
import shape from './shape';

/**
 * Creates a shape guard from an original shape by picking a set of its keys.
 */
export default function pick<T extends ShapeGuard, K extends keyof GuardType<T>>(guard: T, keys: K[]) {
    const { schema: baseSchema, strict } = guard._shape;

    const keysSet = new Set(keys);

    const schema = Object.entries(baseSchema).reduce((res, [key, val]) => {
        if (keysSet.has(key as K)) {
            res[key] = val;
        }

        return res;
    }, {} as GuardSchema);

    return shape(schema, strict) as ShapeGuard<Pick<GuardType<T>, K>>;
}
