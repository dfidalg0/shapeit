import { validate } from '@/validation';
import { Rule, RulesSet } from '@/types/validation';
import { NonEmptyArray } from '@/types/utils';
import { times } from 'lodash';

describe('validate function', () => {
    it('validates an input against a rule', async () => {
        const n1 = faker.datatype.number({ min: 6 });
        const n2 = faker.datatype.number({ max: 4 });

        const error = faker.datatype.string();

        const rule: Rule<number> = (n, assert) => assert(n > 5, error);

        const [r1, r2] = await Promise.all([
            validate(n1, rule),
            validate(n2, rule)
        ]);

        expect(r1.valid).toBe(true);
        expect(r2.valid).toBe(false);

        expect(r1.errors).toBe(null);
        expect(r2.errors).toEqual({ $: [error] });
    });

    it('allows multiple rules to be applied on an object', async () => {
        const description = faker.datatype.string();
        const sym = Symbol(description);

        const rules: NonEmptyArray<Rule<symbol>> = [
            jest.fn((input, assert) => assert(input === sym, '')),
            jest.fn((input, assert) => assert(input.description === description, ''))
        ];

        const result = await validate(sym, rules);

        for (const rule of rules) {
            expect(rule).toBeCalled();
        }

        expect(result.valid).toBe(true);
        expect(result.errors).toBe(null);

        await expect(validate(sym, ...rules)).resolves.toEqual(result);
    });

    it('validates nested objects against rules', async () => {
        const data = genData();

        data.string = faker.datatype.string(5);

        const error = faker.datatype.string();

        const rulesSet: RulesSet<typeof data> = {
            string: (str, assert) => assert(str.length === 5, error)
        };

        const r1 = await validate(data, rulesSet);

        data.string = faker.datatype.string(4);

        const r2 = await validate(data, rulesSet);

        expect(r1.valid).toBe(true);
        expect(r2.valid).toBe(false);

        expect(r1.errors).toBe(null);
        expect(r2.errors).toEqual({ '$.string': [error] });
    });

    it('validates each element of an array with $each property', async () => {
        const length = faker.datatype.number({ min: 3, max: 10 });
        const input = times(length, () => faker.datatype.string(4));

        const error = faker.datatype.string();

        const r1 = await validate(input, {
            $each: (value, assert) => assert(value.length > 3, error)
        });

        expect(r1).toEqual({
            valid: true,
            errors: null
        });

        const r2 = await validate(input, {
            $each: (value, assert) => assert(value.length > 20, error)
        });

        expect(r2).toEqual({
            valid: false,
            errors: input.reduce((res, _, index) => {
                res[`$.${index}`] = [error];
                return res;
            }, {} as Record<string, string[]>)
        });
    });

    it('throws if no rules are specified', async () => {
        // @ts-expect-error no rule passed
        await expect(() => validate([])).rejects.toThrow();
    });
});
