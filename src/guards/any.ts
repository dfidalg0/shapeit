import guard from './guard';

/**
 * Creates a guard that always validates
 *
 * Equivalent to `any` type in TS.
 *
 * For improved type safety, use unknown instead
 */
export default function any() {
    return guard('any', (_input): _input is any => true);
}
