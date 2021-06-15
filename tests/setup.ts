import faker from 'faker';

const genData = () => ({
    string: faker.datatype.string(),
    number: faker.datatype.number(),
    null: null,
    undefined: undefined,
    object: JSON.parse(faker.datatype.json()),
    bigint: BigInt(faker.datatype.number()),
    boolean: faker.datatype.boolean(),
    symbol: Symbol()
});

Object.assign(global, {
    faker, genData
});
