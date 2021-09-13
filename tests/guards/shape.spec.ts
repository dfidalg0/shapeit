import { shape } from '@/guards';
import { errorMessage } from '@/utils/messages';
import { pick } from 'lodash';

const data = genData();

describe('Shape guard', () => {
    it('ensures an object is a plain record', () => {
        const guard = shape({});

        for (const type in data) {
            if (type === 'object') continue;

            expect(guard(data[type])).toBe(false);
            expect(guard.errors).toEqual({
                $: [errorMessage('object')]
            });
        }

        expect(guard({})).toBe(true);
    });

    it('ensures an object matches a shape', () => {
        const guard = shape({
            string: 'string',
            object: shape({
                number: 'number'
            })
        });

        const validInput = {
            string: faker.datatype.string(),
            object: {
                number: faker.datatype.number()
            }
        };

        const invalidInput = pick(validInput, 'string');

        expect(guard(validInput)).toBe(true);
        expect(guard(invalidInput)).toBe(false);

        expect(guard.errors).toMatchObject({
            '$.object': expect.any(Array)
        });
    });

    it('ensures all keys of an object match their types', () => {
        const guard = shape({
            string: 'string',
            number: 'number'
        });

        const invalidInputs = [
            { string: faker.datatype.number(), number: faker.datatype.number() },
            { string: faker.datatype.string(), number: faker.datatype.string() },
            { string: faker.datatype.number(), number: faker.datatype.string() }
        ];

        for (const input of invalidInputs) {
            expect(guard(input)).toBe(false);
        }
    });
});
