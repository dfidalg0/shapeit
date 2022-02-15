import { custom, guard } from '@/guards';
import { errorMessage } from '@/utils/messages';
import { makeErrors } from '@/utils/validation';
import { times } from 'lodash';

describe('Base guard creator', () => {
    it('is aliased as `custom`', () => {
        expect(guard).toBe(custom);
    });

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
        const errors = {
            $: undefined,
            '$.my-path': []
        };

        const guard = custom('my-type', (_): _ is unknown => {
            guard.errors = errors;

            return false;
        });

        guard(0);

        expect(guard.errors).toEqual(errors);
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

    it('returns all errors with errors.all', () => {
        const errMap = Object.fromEntries(
            times(3, () => [
                faker.datatype.string(),
                times(3, () => faker.datatype.string())
            ])
        );

        const guard = custom('typename', (input): input is true => {
            if (input) return true;

            guard.errors = errMap;

            return false;
        });

        guard(false);

        expect(guard.errors.all).toEqual(makeErrors(errMap).all);

        guard(true);

        expect(guard.errors).toBe(null);
    });

    it('warns when errors are set to any value outside the validator', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(
            () => { }
        );

        const guard = custom('name', (_input): _input is never => false);

        guard.errors = {};

        expect(console.warn).toBeCalled();
    });
});
