export default function assert(cond: unknown, msg: string): asserts cond {
    if (!cond) throw new AssertionError(msg);
}

export class AssertionError extends Error {}
