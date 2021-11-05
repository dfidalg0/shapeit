import { ShapeGuard, GuardSchema, GuardType } from '../types/guards';
import oneOf from './oneOf';
import shape from './shape';

/**
 * Creates a shape where all object keys are optional.
 *
 * This is NOT valid for nested keys inside objects. If you really need it, use
 * deepPartial instead
 */
export default function partial<T extends ShapeGuard>(guard: T) {
    const { schema: baseSchema, strict } = guard._shape;

    const schema = Object.entries(baseSchema).reduce((res, [key, val]) => {
        res[key] = oneOf(val, 'undefined');

        return res;
    }, {} as GuardSchema);

    return shape(schema, strict) as ShapeGuard<Partial<GuardType<T>>>;
}
