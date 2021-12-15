import { any } from '@/guards';

describe('any guard', () => {
    it('accepts any type', () => {
        const guard = any();

        const data = genData();

        for (const obj of Object.values(data)) {
            expect(guard(obj)).toBe(true);
        }
    });
});
