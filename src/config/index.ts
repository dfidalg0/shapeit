type Config = typeof config;

const config = {
    errorMessage: (typename: string) => `Invalid type provided. Expected: '${typename}'`,
    sizeErrorMessage: (size: number | string) => `Invalid size provided. Expected: ${size}`
};

const defaults = { ...config };

export function set<K extends keyof Config>(key: K, value: Config[K] | 'default') {
    if (value === 'default') {
        return config[key] = defaults[key];
    }

    return config[key] = value;
}

export function get<K extends keyof Config>(key: K): Config[K] {
    return config[key];
}
