import shape from './shape';
import { GuardSchema } from '../types/guards';

/**
 * Equivalent of `shape(schema, false)`
 */
export default function looseShape<V extends GuardSchema>(schema: V) {
    return shape(schema, false);
}
