import { partial, shape, oneOf } from '@/guards';

describe('Partial guard', () => {
    it('creates a partial validator from an existing one', () => {
        const guard = partial(shape({
            a: oneOf('string', 'boolean'),
            b: shape({
                c: 'boolean'
            })
        }));

        const validInputs = [
            { b: { c: faker.datatype.boolean() } },
            { a: faker.datatype.string() },
            { a: faker.datatype.boolean() },
            {}
        ];

        const invalidInputs = [
            { a: faker.datatype.number() },
            { b: { c: faker.datatype.number() } },
            { b: {} },
            { d: faker.datatype.string() }
        ];

        validInputs.forEach(input => expect(guard(input)).toBe(true));
        invalidInputs.forEach(input => expect(guard(input)).toBe(false));
    });
});
