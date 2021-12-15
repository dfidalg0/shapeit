import guard from './guard';

/**
 * Creates a guard that always validates
 *
 * Equivalent to `unknown` type in TS.
 */
export default function unknown() {
    return guard('unknown', (_input): _input is unknown => true);
}
