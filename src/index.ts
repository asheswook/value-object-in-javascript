import { Constructor, isConstructor, PrivateConstructor } from "./types";

/**
 * Decorator that allows a class to be treated as a Value Object.
 *
 * Like primitive types, Value Objects are immutable and can be compared by their values.
 *
 * In javascript, triple equals `===` operator compares object references.
 * With this decorator, the class constructor returns the same reference for the same values,
 * so you can compare them with triple equals.
 *
 * @example
 * ```typescript
 * ⁣@ValueObject()
 * class Money {
 *    constructor(
 *      public readonly currency: string, // USD, EUR, BTC, KRW...
 *      public readonly amount: number,
 *    ) {}
 * }
 *
 * new Money("USD", 1000) === new Money("USD", 1000) // true
 * new Money("BTC", 1) === new Money("BTC", 1) // true
 * new Money("USD", 1000) === new Money("EUR", 1000) // false
 * ```
 *
 */
export function ValueObject(): ClassDecorator {
    return function <T extends Constructor | PrivateConstructor>(constructor: T) {
        if (!isConstructor(constructor)) {
            throw new Error("ValueObject can only be applied to classes");
        }

        return class ValueObject extends constructor {
            static #nextId = 0;
            static #idMap = new WeakMap<object, number>();
            static #getObjectIdentifier(obj: object): number | object {
                if (typeof obj !== 'object' || obj === null) return obj;
                if (!ValueObject.#idMap.has(obj)) ValueObject.#idMap.set(obj, ValueObject.#nextId++);
                return ValueObject.#idMap.get(obj);
            }
            static #pool = new Map<string, WeakRef<ValueObject>>();
            static #registry = new FinalizationRegistry((key: string) => {
                ValueObject.#pool.delete(key)
            });

            constructor(...args: any[]) {
                const keyString = [constructor.constructor.name, ...args.map(ValueObject.#getObjectIdentifier)].join("-");
                const value = ValueObject.#pool.get(keyString)

                const valueDeref = value?.deref();
                if (valueDeref) return valueDeref;

                super(...args);
                const ref = new WeakRef(this);
                ValueObject.#pool.set(keyString, ref);
                ValueObject.#registry.register(this, keyString);
                return ref.deref()
            }
        } satisfies typeof constructor;
    }
}
