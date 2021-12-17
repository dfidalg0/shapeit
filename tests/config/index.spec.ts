import * as config from '@/config';

describe('configuration manager', () => {
    it('allows a global configuration to be set', () => {
        config.set('showWarnings', true);

        expect(config.get('showWarnings')).toBe(true);

        config.set('showWarnings', false);

        expect(config.get('showWarnings')).toBe(false);
    });

    it('resets to a default value when "default" is passed', () => {
        const defaultError = config.get('errorMessage');

        config.set('errorMessage', () => '');

        expect(config.get('errorMessage')).not.toBe(defaultError);

        config.set('errorMessage', 'default');

        expect(config.get('errorMessage')).toBe(defaultError);
    });
});
