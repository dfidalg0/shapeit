import { instanceOf } from '@/guards';
import { errorMessage } from '@/utils/messages';

describe('instanceOf guard', () => {
    it('checks if a value is an instance of a specific class', () => {
        class TestClass {}

        class InheritedClass extends TestClass {}

        const testObj = new TestClass;
        const inheritedObj = new InheritedClass;

        const guard = instanceOf(TestClass);

        expect(guard(testObj)).toBe(true);
        expect(guard(inheritedObj)).toBe(true);
    });

    it('invalidates non-instances of the specified class', () => {
        class TestClass { property = faker.datatype.number(); }
        class InvalidClass { property = faker.datatype.number(); }

        const invalidValues = [
            ...Object.values(genData()),
            { property: faker.datatype.number() },
            new InvalidClass,
        ];

        const errors = {
            $: [errorMessage(`TestClass instance`)]
        };

        const guard = instanceOf(TestClass);

        for (const obj of invalidValues) {
            expect(guard(obj)).toBe(false);
            expect(guard.errors).toEqual(errors);
        }
    });
});
