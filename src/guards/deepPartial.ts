import { reduce } from 'lodash';
import { ShapeGuard, GuardSchema, GuardType } from '../types/guards';
import { DeepPartial } from '../types/utils';
import { isShapeGuard } from '../utils/guards';
import oneOf from './oneOf';
import shape from './shape';

/**
 * Creates a shape where all object nested keys are optional
 */
export = function deepPartial<G extends ShapeGuard>(guard: G) {
    const { schema: baseSchema, strict } = guard._shape;

    const schema = reduce(baseSchema, (res, val, key) => {
        if (isShapeGuard(val)) {
            res[key] = oneOf(deepPartial(val), 'undefined');
        }
        else res[key] = oneOf(val, 'undefined');

        return res;
    }, {} as GuardSchema);

    return shape(schema, strict) as ShapeGuard<DeepPartial<GuardType<G>>>;
}
