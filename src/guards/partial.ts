import { reduce } from 'lodash';
import { ShapeGuard, GuardSchema, GuardType } from '../types/guards';
import oneOf from './oneOf';
import shape from './shape';

export = partial;

/**
 * Creates a shape where all object keys are optional.
 *
 * This is NOT valid for nested keys inside objects. If you really need it, use
 * deepPartial instead
 */
function partial<T extends ShapeGuard>(guard: T) {
    const { schema: baseSchema, strict } = guard._shape;

    const schema = reduce(baseSchema, (res, val, key) => {
        res[key] = oneOf(val, 'undefined');

        return res;
    }, {} as GuardSchema);

    return shape(schema, strict) as ShapeGuard<Partial<GuardType<T>>>;
}
