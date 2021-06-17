import { deepPartial, shape, oneOf } from '@/guards';

describe('Deep Partial guard', () => {
    it('creates a deep partial validator from an existing one', () => {
        const isValid = deepPartial(shape({
            a: oneOf('string', 'boolean'),
            b: shape({
                c: 'boolean',
                d: shape({
                    e: 'number'
                })
            })
        }));

        const validInputs = [
            { b: { c: faker.datatype.boolean() } },
            { a: faker.datatype.string() },
            { b: { d: {} } },
            { b: {} },
            {}
        ];

        const invalidInputs = [
            { a: faker.datatype.number() },
            { b: { c: faker.datatype.number() } },
            { d: faker.datatype.string() }
        ];

        validInputs.forEach(input => expect(isValid(input)).toBe(true));
        invalidInputs.forEach(input => expect(isValid(input)).toBe(false));
    });
});
