import assert, { AssertionError } from '@/validation/assert';

describe('assert function', () => {
    it('throws when a condition is not matched', () => {
        const msg = faker.datatype.string();
        const err = new AssertionError(msg);

        expect(() => assert(false, msg)).toThrow(err);
    });

    it('continues execution when condition is matched', () => {
        expect(() => assert(true, '')).not.toThrow();
    });
});
