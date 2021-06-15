import { literal } from '@/guards';
import { $, $$ } from '@/utils/literals';
import { pick, times } from 'lodash';
import { BaseName } from '@/types/literals';

const litTypes = ['string', 'number', 'bigint', 'null', 'undefined', 'boolean'] as const;
const data = pick(genData(), litTypes);

describe('TS 4.1 Literals type guard', () => {
    it('ensures a type matches a specified literal', () => {
        for (const [type, value] of Object.entries(data)) {
            const suffix = faker.datatype.string(2);
            const guard = literal($(type as BaseName), suffix);

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
});
