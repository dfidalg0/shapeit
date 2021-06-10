import { PrimitiveOrGuard } from '../types/guards';
import oneOf from './oneOf';

export = nullable;

/**
 * Shorthand for oneOf(guard, 'null');
 */
function nullable<G extends Exclude<PrimitiveOrGuard<unknown>, 'null' | 'undefined'>>(guard: G) {
    return oneOf(guard, 'null');
}
