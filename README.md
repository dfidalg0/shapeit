# shapeit
shapeit is an object validation tools for Javascript and, specially, Typescript. With it, you can ensure any javascript object has a provided shape corresponding to a typescript type. You can also do asynchronous data validation of any nested object and get decent error messages.

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

And a more complex one
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

And a more complex one would be
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
        bossId: async (jobId, assert) => {
            assert(
                await existsOnDb(jobId),
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

This way, you can set schemas to validate all your incoming data with typesafety and get error messages matching the fields of your object.
