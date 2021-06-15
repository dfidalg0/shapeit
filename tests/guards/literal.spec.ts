import { literal } from '@/guards';
import { BaseName } from '@/types/literals';
import { $, $$ } from '@/utils/literals';
import { pick } from 'lodash';

const data = pick(genData(), ['string', 'number', 'bigint', 'null', 'undefined', 'boolean']);

describe('TS 4.1 Literals type guard', () => {
    it('ensures a type matches a specified literal', () => {
        for (const [type, value] of Object.entries(data)) {
            const guard = literal($(type as BaseName), '--');

            const validInput = `${value}--`;
            const invalidInput = validInput + faker.datatype.number(9);

            expect(guard(validInput)).toBe(true);
            expect(guard(invalidInput)).toBe(false);
        }
    });
});
