# shapeit

[![GitHub license](https://img.shields.io/github/license/diegood12/shapeit?color=brightgreen)](https://github.com/diegood12/shapeit/blob/main/LICENSE)
[![Github Actions](https://github.com/diegood12/shapeit/actions/workflows/test.yml/badge.svg)](https://github.com/diegood12/shapeit/actions)
[![npm version](https://img.shields.io/npm/v/shapeit.svg)](https://www.npmjs.com/package/shapeit)

shapeit is an object validation tools for Javascript and, specially, Typescript. With it, you can ensure any javascript object has a provided shape corresponding to a typescript type. You can also do asynchronous data validation of any nested object and get decent error messages.

### **NOTE**: Breaking changes on 0.5

* Importing `shapeit`'s subfolders won't work anymore.
    * Fix: If you had any import like `import { ... } from 'shapeit/...';`, import it directly from `'shapeit'`.

## Usage

shapeit consists of two different parts.

The first one is called guards and is dedicated to typecheking, so, its synchronous all the way down since typescript demands.

The second one is called validation and is dedicated to apply rules to a typechecked input. Since validation can be asynchronous, all the rules are applied asynchronously.

### Guards

A basic example of guards usage would be like this
```js
const sp = require('shapeit');

// First we create a guard
const personShape = sp.shape({
    name: 'string',
    age: 'number',
});

// Then we create some objects (consider they as unknown types)
const p1 = {
    name: 'John',
    age: 26
};

const p2 = {
    name: 'Mary',
    age: '27'
};

// Then we test then against the created shape
if (personShape(p1)) {
    p1; // p1 is now typed as { name: string; age: number }
}

personShape.errors; // null

if (personShape(p2)) {
    p2; // This line is not executed since p2 doesn't fit the shape
}

personShape.errors; // { '$.age': [ "Invalid type provided. Expected: 'number'" ] }

```

<details>
<summary>
    And a more complex one (expand)
</summary>

```ts
import * as sp from 'shapeit';

const personShape = sp.shape({
    name: 'string',
    age: 'number',
    emails: sp.arrayOf('string')
});

const person = {
    name: 'John Doe',
    age: 25,
    emails: [
        'john.doe@example.com',
        'john_doe@email.com',
        null
    ]
};

if (personShape(person)) {
    person; // Unexecuted line
}

personShape.errors; // { '$.emails.2': [ "Invalid type provided. Expected: 'string'" ] }
```
</details>

### Validation
Validation can be a little bit trickier. It consists of a set of rules, which are functions that receive the object and an assert function. The trick here is that it works deeply.

A simple example would be like this
```js
const sp = require('shapeit');

// First, we get a valid typed object
const person = {
    name: 'Not John Doe',
    age: 25
};

// Then we can validate it
sp.validate(person, {
    name: (name, assert) => {
        assert(name === 'John Doe', 'You must be John Doe');
    },
    age: (age, assert) => {
        assert(age >= 18, 'You must be at least 18 years old');
    }
}).then(result => {
    result.valid; // false
    result.errors; // { '$.name': ['You must be John Doe'] }
});
```

<details>
<summary>
And a more complex one (expand)
</summary>

```typescript
import * as sp from 'shapeit';

// Typescript interface (you can obtain that with guards too)
interface Person {
    name: string;
    age: number;
    emails: string[];
    // Notice "job" is an optional parameter
    job?: {
        id: number;
        bossId: number;
    }
}

const person: Person = {
    name: 'John Doe',
    age: 25,
    emails: [
        'john.doe@example.com',
        'john_doe@email.com'
    ],
    job: {
        id: 13,
        bossId: 10
    }
};

validate(person, {
    name: (name, assert) => {
        assert(name === 'John Doe', 'You must be John Doe');
    },
    age: (age, assert) => {
        assert(age >= 18, 'You must be at least 18 years old');
    },
    // An object validator can be an object with its keys
    job: {
        // Those rules will be evaluated only if key "job"
        // exists in the person object. So, don't need to
        // worry about that
        id: async (jobId, assert) => {
            assert(
                await existsOnDb(jobId),
                'This job doesnt exist on database'
            )
        },
        // Rules can be asynchronous functions 🥳
        // and all of them will be executed in parallel
        bossId: async (bossId, assert) => {
            assert(
                await existsOnDb(bossId),
                'This employee doesnt exist on database'
            )
        }
    },
    // When you need to validate the entire object and its keys,
    // you can pass an array containing
    // its rule and the rules for its members
    emails: [
        (emails, assert) => {
            assert(emails.length > 0, 'Provide at least one email');
        },
        {
            // $each is a way to apply the same rule
            // to all the array elements
            $each: (email, assert) => {
                assert(isValidEmail(email), 'Invalid email');
            }
        }
    ]
}).then(result => {
    // Do something with validation result
});
```
</details>


This way, you can set schemas to validate all your incoming data with typesafety and get error messages matching the fields of your object.

## Configuration

`shapeit` allows you to configure the error messages generated by the type guards like below.

```js
const { config } = require('shapeit');

config.set('errorMessage', typename => {
    return `I was expecting for a ${typename}`;
});

config.set('sizeErrorMessage', size => {
    return `Give me an array of size ${size} the next time`;
});
```

Or, if you just want to return to the default values,

```js
config.set('errorMessage', 'default');
config.set('sizeErrorMessage', 'default');
```

You can also get the current configuration like below

```js
const genErrorMessage = config.get('errorMessage');
```

## Reference

### Types

<details>
<summary>
<code>Primitive</code>
</summary>

String representing a JS basic type.

```ts
type Primitive =
    | 'number' | 'string'    | 'boolean'
    | 'bigint' | 'object'    | 'symbol'
    | 'null'   | 'undefined';
```
</details>

<details>
<summary>
    <code>ValidationErrors</code>
</summary>

Representation of the errors found on a validation process. It's a map of property paths to an array of error messages.

```ts
type ValidationErrors = Record<string, string[]>;
```
</details>

<details>
<summary>
    <code>Guard</code>
</summary>

Basic guard type. Can be called to verify a type synchronously. Validation errors will be present on `Guard.errors` after validation is complete.

```ts
type Guard<T> = {
    (input: unknown): input is T;
    errors: ValidationErrors;
}
```
</details>

<details>
<summary>
    <code>GuardSchema</code>
</summary>

Schema for defining a shape guard. Represents the keys of an object mapped to their respective types.

```ts
type GuardSchema = Record<string, Primitive | Guard>;
```
</details>

### Guards

<details>
<summary>
<code>is(type: Primitive)</code>
</summary>

Creates a basic guard for a primitive type
```js
const isString = is('string');

if (isString(value)) {
    value; // string
}
else {
    console.error(isString.errors); // Errors found
}
```
</details>

<details>
<summary>
<code>instanceOf(constructor: GenericClass)</code>
</summary>

Creates a native instanceof guard. Can be useful when used in conjunction with other guards.
```js
class MyClass {
  // My class code...
}

const isMyClass = instanceOf(MyClass);

if (isMyClass(value)) {
    doSomethingWith(value); // value is typed as MyClass
}
else {
    console.error(isMyClass.errors); // Errors found
}
```
</details>

<details>
<summary>
    <code>oneOf(...types: (Primitive | Guard)[])</code>
</summary>

Creates a guard for a union type from primitive names or other guards
```js
const isValid = oneOf('string', is('number'));

if (isValid(input)) {
    doSomethingWith(input); // input is typed as string | number
}
else {
    console.error(isValid.errors); // Errors found
}
```
</details>

<details>
<summary>
    <code>allOf(...types: (Primitive | Guard)[])</code>
</summary>

Creates a guard for a intersection type from primitive names or other guards
```js
const isValid = allOf(
    looseShape({ a: 'string' }),
    looseShape({ b: 'number' })
);

if (isValid(input)) {
    doSomethingWith(input); // input is typed as { a: string; b: number; }
}
else {
    console.error(isValid.errors); // Errors found
}
```
</details>

<details>
<summary>
    <code>shape(schema: GuardSchema, strict = true)</code>
</summary>

Makes a guard for an object. Types can be specified with other guards or
primitive names.

```js
const isValidData = shape({
  name: 'string',
  emails: arrayOf('string')
});

if (isValidData(input)) {
  doSomethingWith(input); // input is typed as { name: string, emails: string[] }
}
else {
  console.error(isValidData.errors); // Errors found
}
```

The `strict` parameter can be passed to specify if the validation must ensure there are no extraneous keys on the object or not (defaults to true).

```js
const isValidData = shape({
  name: 'string',
  emails: arrayOf('string')
}, false);

// This will be valid
isValidData({
  name: 'John Doe',
  emails: ['john@doe.com', 'john.doe@example.com'],
  age: 34
});
```
</details>

<details>
<summary>
    <code>arrayOf(type: Primitive | Guard)</code>
</summary>
Creates an array shape where all elements must have the same type

```js
const emailsShape = sp.arrayOf('string');

const peopleShape = sp.arrayOf(
  sp.shape({
    name: 'string',
    age: 'number'
  })
);
```
</details>

<details>
<summary>
    <code>tuple(...types: (Primitive | Guard)[])</code>
</summary>

Creates a guard for a tuple type. The order of the arguments is the same as the type order of the tuple

```js
const entryShape = sp.tuple('string', 'number');

if (entryShape(input)) {
  input; // Typed as [string, number]
}
```
</details>

<details>
<summary>
    <code>literal(...template: Template)</code>
</summary>

Creates a guard for a template literal type. It's used alongside with `$` and `$$`.

`$` is used for generating a tempate type derived from a primitive or a list of primitives or literals

```js
const idTemplate = sp.literal('id-', sp.$('bigint'));

if (idTemplate(input)) {
  input; // input is typed as `id-${bigint}`
}
```

`$$` is used for generating sets of allowed values.

```js
const versionTemplate = sp.literal(
    sp.$('bigint'), '.', sp.$('bigint'), '.', sp.$('bigint'),
    sp.$$('', '-alpha', '-beta')
);

if (versionTemplate(input)) {
  input; // input is typed as `${bigint}.${bigint}.${bigint}${'' | '-alpha' | '-beta'}`
}
```
</details>

<details>
<summary>
    <code>narrow(...targets: any[])</code>
</summary>


Creates a guard that perfectly narrows a type.

```js
const is10 = sp.narrow(10);

if (is10(input)) {
  input; // typed as 10
}

const isAorB = sp.narrow('a', 'b');

if (isAorB(input)) {
  input; // typed as 'a' | 'b'
}

const isLikeMyVerySpecificObject = sp.narrow({
  my: {
    specific: {
      property: 'my-specific-value'
    }
  },
  another: {
    specific: {
      property: 'another-specific-value'
    }
  }
});

if (isLikeMyVerySpecificObject(input)) {
  input; // typed exactly as the (very specific) object provided
}
```
</details>

<details>
<summary>
  <code>unknown()</code>
</summary>

Creates a guard that always validates

Equivalent to `unknown` type in TS.
</details>

<details>
<summary>
  <code>never()</code>
</summary>
Creates a guard that never validates

Equivalent to `never` type in TS.
</details>

<details>
<summary>
  <code>any()</code>
</summary>

Creates a guard that always validates

Equivalent to `any` type in TS.

For improved type safety, use unknown instead
</details>

<details>
<summary>
  <code>custom(name: string, validator: (input: unknown) => input is any)</code>
</summary>

Creates a custom guard from a typeguard function

```ts
const myCustomType = sp.custom(
  'myCustomType',
  (input): input is MyCustomType => {
    let result : boolean;

    // test if input is MyCustomType

    return result;
  }
);
```

`custom` also allows you to define your own error messages by simply seting the `errors` property of the generated guard.

```ts
const myCustomType = sp.custom(
  'myCustomType',
  (input): input is MyCustomType => {
    let result : boolean;

    // test if input is MyCustomType

    if (!result) {
      myCustomType.errors = {
        '$.my.property': ['This value is invalid']
      }
    }

    return result;
  }
);
```
</details>

#### Helpers

<details>
<summary>
    <code>looseShape(schema: GuardSchema)</code>
</summary>
Equivalent of <code>shape(schema, false)</code>
</details>

<details>
<summary>
    <code>strictShape(schema: GuardSchema)</code>
</summary>
Equivalent of <code>shape(schema, true)</code>
</details>

<details>
<summary>
    <code>pick(guard: Guard, keys: string[])</code>
</summary>
Creates a shape guard from an original shape by picking a set of its keys.
</details>

<details>
<summary>
    <code>omit(guard: Guard, keys: string[])</code>
</summary>
Creates a shape guard from an original shape by omiting a set of its keys.
</details>

<details>
<summary>
    <code>partial(guard: Guard)</code>
</summary>
Creates a shape where all object keys are optional.

This is NOT valid for nested keys inside objects. If you really need it, use deepPartial instead
</details>

<details>
<summary>
    <code>deepPartial(guard: Guard)</code>
</summary>
Creates a shape where all object keys and nested keys are optional
</details>

<details>
<summary>
    <code>maybe(guard: Primitive | Guard)</code>
</summary>
Shorthand for <code>oneOf(guard, 'undefined');</code>
</details>

<details>
<summary>
    <code>nullable(guard: Primitive | Guard)</code>
</summary>
Shorthand for <code>oneOf(guard, 'null');</code>
</details>

## Roadmap

* ~~Add ESM support~~ 🎉
* Improve the validation API
* Add validation mechanism to the guards API directly
* Improve docs
* Release v1.0
