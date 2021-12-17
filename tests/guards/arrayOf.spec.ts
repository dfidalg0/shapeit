import { arrayOf } from '@/guards';
import { sizeErrorMessage } from '@/utils/messages';
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

    it('tests for max length', () => {
        const length = faker.datatype.number({ min: 1, max: 10 });

        const guard = arrayOf('string', length);

        const validInputs = times(
            length,
            i => times(i + 1, () => faker.datatype.string())
        );
        const invalidInput = times(length + 1, () => faker.datatype.string());

        for (const input of validInputs) {
            expect(guard(input)).toBe(true);
            expect(guard.errors).toBe(null);
        }

        expect(guard(invalidInput)).toBe(false);
        expect(guard.errors).toEqual({
            $: [sizeErrorMessage(`<= ${length}`)]
        });
    });

    it('throws an error if created with an invalid maximum size', () => {
        expect(() => arrayOf('string', 0)).toThrow();
        expect(() => arrayOf('number', -5)).toThrow();
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
