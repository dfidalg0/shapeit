import { arrayOf } from '@/guards';
import { times } from 'lodash';

describe('arrayOf guard', () => {
    it('checks if an input is an array with elements of a type', () => {
        const guard = arrayOf('string');

        const validInput = times(4, () => faker.datatype.string());

        expect(guard(validInput)).toBe(true);

        const invalidInputs = [
            ...Object.values(genData())
                .filter(v => !Array.isArray(v)),
            times(4, () => faker.datatype.number()),
            [...validInput, Symbol()]
        ];

        for (const input of invalidInputs) {
            expect(guard(input)).toBe(false);
        }
    });

    it('tells in which position the error is', () => {
        const guard = arrayOf('number');

        const genInvalidInput = (index: number) => [
            ...times(index, () => faker.datatype.number()),
            faker.datatype.string()
        ];

        for (let i = 0; i < 5; ++i) {
            const input = genInvalidInput(i);
            expect(guard(input)).toBe(false);

            expect(guard.errors).toMatchObject({
                [`$.${i}`]: expect.anything()
            });
        }
    });
});
