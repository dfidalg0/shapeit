import { looseShape, allOf } from '@/guards';
import { Primitive } from '@/types/utils';

describe('Union guard (allOf)', () => {
    it('always rejects an intersection of distinct primitives', () => {
        const data = genData();
        const types = Object.keys(data) as Primitive[];

        for (const type1 of types)
            for (const type2 of types) {
                if (type1 === type2) continue;

                const guard = allOf(type1, type2);

                for (const obj of Object.values(data)) {
                    expect(guard(obj)).toBe(false);
                }
            }
    });

    it('validates an intersection of the same primitive', () => {
        const data = genData();
        const types = Object.keys(data) as Primitive[];

        for (const type of types) {
            const guard = allOf(type, type);

            for (const [key, value] of Object.entries(data)) {
                expect(guard(value)).toBe(key === type);
            }
        }
    });

    it('validates an intersection of two guards', () => {
        const guard = allOf(
            looseShape({
                a: 'number',
            }),
            looseShape({
                b: 'string'
            })
        );

        const data = genData();

        for (const [key, value] of Object.entries(data)) {
            if (key === 'object') continue;

            expect(guard(value)).toBe(false);
        }

        expect(guard({ a: faker.datatype.number() })).toBe(false);
        expect(guard({ b: faker.datatype.string() })).toBe(false);
        expect(
            guard({
                a: faker.datatype.number(),
                b: faker.datatype.string()
            })
        ).toBe(true);
    });

    it('throws an error when no guards are provided', () => {
        // @ts-expect-error Empty array
        expect(() => allOf(/* no args */)).toThrow();
    });
});
