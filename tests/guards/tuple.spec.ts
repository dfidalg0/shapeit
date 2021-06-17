import { tuple } from '@/guards';

describe('Tuple guard', () => {
    it('ensures an object is a tuple type', () => {
        const guard = tuple('string', 'number');

        const validInput = [faker.datatype.string(), faker.datatype.number()];
        const invalidInputs = [
            faker.datatype.number(),
            [...validInput, faker.datatype.number()],
            [validInput[0]]
        ];

        expect(guard(validInput)).toBe(true);

        for (const input of invalidInputs) {
            expect(guard(input)).toBe(false);
        }
    });

    it('ensures all fields match their corresponding types', () => {
        const guard = tuple('number', 'string');

        const validInput = [faker.datatype.number(), faker.datatype.string()];

        const invalidInputs = [
            [faker.datatype.string(), faker.datatype.string()],
            [faker.datatype.number(), faker.datatype.number()],
            [faker.datatype.string(), faker.datatype.number()]
        ];

        expect(guard(validInput)).toBe(true);

        for (const input of invalidInputs) {
            expect(guard(input)).toBe(false);
        }
    });
});
