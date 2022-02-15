import { literal } from '@/guards';
import { $, $$, $$$, valueToRegex } from '@/utils/literals';
import { pick, times } from 'lodash';
import { LiterableName } from '@/types/literals';

const litTypes = ['string', 'number', 'bigint', 'null', 'undefined', 'boolean'] as const;
const data = pick(genData(), litTypes);

describe('TS 4.1 Literals type guard', () => {
    it('ensures a type matches a specified literal', () => {
        for (const [type, value] of Object.entries(data)) {
            const suffix = faker.datatype.string(2);
            const guard = literal($(type as LiterableName), suffix);

            const validInput = `${value}${suffix}`;
            const invalidInput = validInput + faker.datatype.number(9);

            expect(guard(validInput)).toBe(true);
            expect(guard(invalidInput)).toBe(false);
        }
    });

    it('ensures a type matches a specified set of values as string', () => {
        const prefix = faker.datatype.string();

        const values = times(4, () => faker.datatype.number());

        const guard = literal(prefix, '---', $$(...values));

        for (const value of values) {
            const validInput = `${prefix}---${value}`;
            const invalidInput = validInput + faker.datatype.string(1);

            expect(guard(validInput)).toBe(true);
            expect(guard(invalidInput)).toBe(false);
        }
    });

    const numberRegex = $('number').regex.slice(1, -1);

    const r = String.raw;

    describe('$ helper', () => {
        it('creates a regular expression from multiple types', () => {
            const { regex } = $('number', 'null');

            expect(regex).toBe(`(${numberRegex}|null)`);
        });

        it('creates a regular expression from types and literal descriptors', () => {
            const { regex: withUnionRegex } = $('number', $$('a', 'b', 'c'));

            expect(withUnionRegex).toBe(`(${numberRegex}|(a|b|c))`);

            const { regex: withTemplateRegex } = $('bigint', $$$('a-', $('bigint')));

            expect(withTemplateRegex).toBe(r`(\d+|(a-(\d+)))`);
        });
    });

    describe('$$ helper', () => {
        it('creates a regex from a specific set of values', () => {
            const values = times(3, () => faker.datatype.number());

            const { regex } = $$(...values);

            expect(regex).toBe(`(${values.join('|')})`);
        });

        it('escapes string values', () => {
            const values = [
                r`\d`,
                r`[]`,
                r`()`,
                r`$`,
                r`^`
            ] as const;

            const { regex } = $$(...values);

            const expectedRegex = '(' + [
                r`\\d`,
                r`\[\]`,
                r`\(\)`,
                r`\$`,
                r`\^`
            ].join('|') + ')';

            expect(regex).toBe(expectedRegex);
        });
    });

    describe('$$$ helper', () => {
        it('creates a regex from a template', () => {
            const [
                bgn, mid, end
            ] = Array(3).fill(null).map(() => faker.datatype.string());

            const { regex } = $$$(bgn, $('number'), mid, $$(10, 11), end);

            const esc = [bgn, mid, end].map(valueToRegex);

            expect(regex).toBe(
                `(${esc[0]}(${numberRegex})${esc[1]}(10|11)${esc[2]})`
            );
        });
    });
});
