import { PrimitiveOrGuard } from '../types/guards';
import oneOf from './oneOf';

/**
 * Shorthand for oneOf(guard, 'null');
 */
export default function nullable<G extends Exclude<PrimitiveOrGuard<unknown>, 'null' | 'undefined'>>(guard: G) {
    return oneOf(guard, 'null');
}
