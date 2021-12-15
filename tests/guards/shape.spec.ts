import { strictShape, looseShape } from '@/guards';
import { errorMessage } from '@/utils/messages';
import { pick } from 'lodash';

const data = genData();

describe('Shape guard', () => {
    it('ensures an object is a plain record', () => {
        const guard = strictShape({});

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
        const guard = strictShape({
            string: 'string',
            object: strictShape({
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
        const guard = strictShape({
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

    describe('strict', () => {
        it('ensures an object has no additional properties', () => {
            const guard = strictShape({
                a: 'number'
            });

            expect(guard({
                a: faker.datatype.number(),
                [faker.datatype.string()]: faker.datatype.string(),
            })).toBe(false);
        });
    });

    describe('loose', () => {
        it('allows an object to have additional properties', () => {
            const guard = looseShape({
                a: 'number'
            });

            expect(guard({
                a: faker.datatype.number(),
                [faker.datatype.string()]: faker.datatype.string(),
            })).toBe(true);
        });
    });
});
