import { PrimitiveOrGuard } from '../types/guards';
import oneOf from './oneOf';

export = maybe;

/**
 * Shorthand for oneOf(guard, 'undefined');
 */
function maybe<G extends Exclude<PrimitiveOrGuard<unknown>, 'undefined'>>(guard: G) {
    return oneOf(guard, 'undefined');
}
