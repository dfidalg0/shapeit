import { is, oneOf } from '@/guards';
import { errorMessage } from '@/utils/messages';

describe('Union guard (oneOf)', () => {
    it('validates an union of primitives', () => {
        const guard = oneOf('string', 'boolean');

        const str  = faker.datatype.string();
        const bool = faker.datatype.boolean();

        expect(guard(str)).toBe(true);
        expect(guard(bool)).toBe(true);

        expect(guard(null)).toBe(false);
        expect(guard.errors).toEqual({
            $: expect.arrayContaining([
                errorMessage('string'),
                errorMessage('boolean')
            ])
        });
    });

    it('validates an union of two guards', () => {
        const guard = oneOf(
            is('bigint'), is('symbol')
        );

        const bigint = BigInt(faker.datatype.number());
        const symbol = Symbol();
        const string = faker.datatype.string();

        expect(guard(bigint)).toBe(true);
        expect(guard(symbol)).toBe(true);

        expect(guard(string)).toBe(false);

        expect(guard.errors).toEqual({
            $: expect.arrayContaining([
                errorMessage('bigint'),
                errorMessage('symbol')
            ])
        });
    });

    it('throws an error when no guards are provided', () => {
        // @ts-expect-error empty array
        expect(() => oneOf(/* no args */)).toThrow();
    });
});
