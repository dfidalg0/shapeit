import { omit, shape, oneOf } from '@/guards';

describe('Omit guard', () => {
    it('creates a validator by picking keys of an existing one', () => {
        const guard = omit(shape({
            a: oneOf('string', 'boolean'),
            b: 'string',
            c: 'boolean'
        }), ['c']);

        const validInputs = [
            { a: faker.datatype.string(), b: faker.datatype.string() },
            { a: faker.datatype.boolean(), b: faker.datatype.string() },
        ];

        const invalidInputs = [
            { a: faker.datatype.number(), b: faker.datatype.string() },
            { a: faker.datatype.string(), b: faker.datatype.string(), c: faker.datatype.boolean() },
            { a: faker.datatype.boolean(), b: faker.datatype.boolean() },
            { c: faker.datatype.boolean() },
            { a: faker.datatype.boolean(), b: faker.datatype.string(), d: faker.datatype.number() }
        ];

        validInputs.forEach(input => expect(guard(input)).toBe(true));
        invalidInputs.forEach(input => expect(guard(input)).toBe(false));
    });
});
