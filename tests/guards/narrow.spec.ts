import { narrow } from '@/guards';
import { NonEmptyArray, Primitive } from '@/types/utils';
import { cloneDeep } from 'lodash';

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
});
