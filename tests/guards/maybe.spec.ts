import { maybe } from '@/guards';

describe('Maybe guard', () => {
    it('creates a validator for target or undefined', () => {
        const guard = maybe('number');

        expect(guard(faker.datatype.number())).toBe(true);
        expect(guard(undefined)).toBe(true);
        expect(guard(faker.datatype.string())).toBe(false);
    });
});
