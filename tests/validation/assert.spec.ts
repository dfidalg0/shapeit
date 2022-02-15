import { assert, AssertionError } from '@/validation';

describe('assert function', () => {
    it('throws when a condition is not matched', () => {
        const msg = faker.datatype.string();
        const err = new AssertionError(msg);

        expect(() => assert(false, msg)).toThrow(err);
    });

    it('continues execution when condition is matched', () => {
        expect(() => assert(true, '')).not.toThrow();
    });

    describe('assertion error', () => {
        it('extends the `Error` native class', () => {
            expect(new AssertionError()).toBeInstanceOf(Error);
        });
    });
});
