import { unknown } from '@/guards';

describe('unknown guard', () => {
    it('accepts any type', () => {
        const guard = unknown();

        const data = genData();

        for (const obj of Object.values(data)) {
            expect(guard(obj)).toBe(true);
        }
    });
});
