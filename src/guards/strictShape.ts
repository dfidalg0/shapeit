import shape from './shape';
import { GuardSchema } from '../types/guards';

/**
 * Equivalent of `shape(schema, true)`
 */
export default function strictShape<V extends GuardSchema>(schema: V) {
    return shape(schema, true);
}
