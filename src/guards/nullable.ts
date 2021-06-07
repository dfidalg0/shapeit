import { PrimitiveOrGuard } from '../types/guards';
import oneOf from './oneOf';

/**
 * Shorthand for oneOf(guard, 'null');
 */
export = function nullable<G extends Exclude<PrimitiveOrGuard<unknown>, 'null' | 'undefined'>>(guard: G) {
    return oneOf(guard, 'null');
}
