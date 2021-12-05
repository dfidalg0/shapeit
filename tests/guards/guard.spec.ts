import { custom } from '@/guards';
import { errorMessage } from '@/utils/messages';

describe('Custom guard creator', () => {
    it('allows the user to define its own typeguard', () => {
        const validInput = Symbol();
        const invalidInput = Symbol();

        const typename = faker.database.type();

        const guard = custom(typename, (input): input is typeof validInput => {
            return input === validInput;
        });

        expect(guard(validInput)).toBe(true);
        expect(guard(invalidInput)).toBe(false);

        expect(guard.errors).toEqual({
            $: [errorMessage(typename)]
        });
    });

    it('allows the user to specify its own error messages', () => {
        const errors = {};

        const guard = custom('my-type', (_): _ is unknown => {
            guard.errors = errors;

            return false;
        });

        guard(0);

        expect(guard.errors).toBe(errors);
    });

    it('warns when errors are set and input is valid', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(
            () => {}
        );

        const guard = custom('my-type', (setErrors): setErrors is unknown => {
            guard.errors = setErrors ? {} : null;

            return true;
        });

        guard(false);
        expect(console.warn).not.toBeCalled();

        guard(true);
        expect(console.warn).toBeCalled();
    });

    it('warns when errors are set to null and input is not valid', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(
            () => { }
        );

        const guard = custom('my-type', (setErrors): setErrors is unknown => {
            guard.errors = setErrors ? {} : null;

            return false;
        });

        guard(true);
        expect(console.warn).not.toBeCalled();

        guard(false);
        expect(console.warn).toBeCalled();
    });
});
