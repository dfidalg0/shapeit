import { PrimitiveOrGuard } from '../types/guards';
import oneOf from './oneOf';

/**
 * Shorthand for oneOf(guard, 'undefined');
 */
export default function maybe<G extends Exclude<PrimitiveOrGuard<unknown>, 'undefined'>>(guard: G) {
    return oneOf(guard, 'undefined');
}
