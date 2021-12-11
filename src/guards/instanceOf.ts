import guard from './guard.ts';

type GenericClass = { new(...args: never[]): unknown };

/**
 * Creates a native instanceof guard. Can be useful when used in conjunction
 * with other guards.
 *
 * @example
 * class MyClass {
 *   // My class code...
 * }
 *
 * const isMyClass = instanceOf(MyClass);
 *
 * if (isMyClass(value)) {
 *     doSomethingWith(value); // value is typed as MyClass
 * }
 * else {
 *     console.error(isMyClass.errors); // Errors found
 * }
 */
export default function instanceOf<C extends GenericClass>(constructor: C) {
    return guard(
        `${constructor.name} instance`,
        (input): input is InstanceType<C> => input instanceof constructor
    );
}
