import guard from './guard';

/**
 * Creates a guard that never validates
 *
 * Equivalent to `never` type in TS.
 */
export default function never() {
    return guard('never', (_input): _input is never => false);
}
