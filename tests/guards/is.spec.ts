import { is } from '@/guards';
import { Primitive } from '@/types/utils';
import { errorMessage } from '@/utils/messages';

const data = genData();

describe('Primitive guard (is)', () => {
    it('checks a primitive type', () => {
        for (const type in data) {
            const guard = is(type as Primitive);

            expect(guard(data[type])).toBe(true);
        }
    });

    it('invalidate incorrect primitives', () => {
        for (const type in data) {
            const guard = is(type as Primitive);
            const error = {
                $: [errorMessage(type)]
            };

            for (const another in data) {
                if (another === type) continue;

                expect(guard(data[another])).toBe(false);
                expect(guard.errors).toEqual(error);
            }
        }
    });
});
