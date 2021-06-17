import { nullable } from '@/guards';

describe('nullable guard', () => {
    it('creates a validator for target or null', () => {
        const guard = nullable('number');

        expect(guard(faker.datatype.number())).toBe(true);
        expect(guard(null)).toBe(true);
        expect(guard(faker.datatype.string())).toBe(false);
    });
});
