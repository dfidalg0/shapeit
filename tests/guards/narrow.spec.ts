import narrow, { genType } from '@/guards/narrow';
import { NonEmptyArray, Primitive } from '@/types/utils';
import { cloneDeep, pick } from 'lodash';

describe('Narrow guard', () => {
    it('checks if an input matches a set of values', () => {
        const data = genData();

        const [invalid, ...valid] = Object.values(data);

        const guard = narrow(...valid as NonEmptyArray<Primitive>);

        for (const input of valid) {
            expect(guard(input)).toBe(true);
        }

        expect(guard(invalid)).toBe(false);
    });

    it('compares an input with a target object deeply', () => {
        const target = {
            some: 'object',
            with: {
                some: {
                    deep: 'properties'
                }
            }
        };

        const guard = narrow(target);

        const input = cloneDeep(target);

        expect(guard(input)).toBe(true);

        input.some = 'another object';

        expect(guard(input)).toBe(false);
    });

    it('never validates a function', () => {
        const f = jest.fn();

        expect(() => narrow(f)).toThrow();

        const guard = narrow(f, 10);

        expect(guard(f)).toBe(false);

        expect(guard(10)).toBe(true);
    });

    describe('typename generator', () => {
        it('returns "null" or "undefined" when narrowing these values', () => {
            expect(genType(null)).toBe('null');
            expect(genType(undefined)).toBe('undefined');
        });

        it('returns a symbol\'s description when narrowing it', () => {
            const description = faker.datatype.string();
            const sym = Symbol(description);

            expect(genType(sym)).toBe(`Symbol(${description})`);
        });

        it('returns a primitive type name with its value', () => {
            const data = pick(genData(), 'string', 'number', 'bigint', 'boolean');

            for (const [type, value] of Object.entries(data)) {
                if (type === 'string') {
                    expect(genType(value)).toBe(`[string] ${JSON.stringify(value)}`);
                    continue;
                }

                expect(genType(value)).toBe(`[${type}] ${value}`);
            }

            const num = new Number(faker.datatype.number());
            const str = new String(faker.datatype.string());

            expect(genType(num)).toBe(`[number] ${num.valueOf()}`);
            expect(genType(str)).toBe(`[string] ${JSON.stringify(str.valueOf())}`);
        });

        it('returns a constructor name with its value', () => {
            const obj = JSON.parse(faker.datatype.json());
            obj[faker.datatype.string()] = BigInt('0');

            const content: string = Object.entries(obj)
                .map(([key, value]) => `${JSON.stringify(key)}: ${genType(value)}`)
                .join(', ');

            expect(genType(obj)).toBe(`[Object] {${content}}`);
        });

        it('returns [Object: null prototype] as typename', () => {
            const obj = Object.create(null);

            expect(genType(obj)).toBe(`[Object: null prototype] {}`);
        });
    });
});
