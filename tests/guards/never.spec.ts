import { never } from '@/guards';

describe('never guard', () => {
    it('never accepts any type', () => {
        const guard = never();

        const data = genData();

        for (const obj of Object.values(data)) {
            expect(guard(obj)).toBe(false);
        }
    });
});
