/**
 * Represents a constructor function.
 */
export interface Constructor<T = any> {
    new(...args: any[]): T;
}

/**
 * Represents a class with a private/protected constructor.
 *
 * At runtime, private and protected constructors are indistinguishable from public constructors.
 *
 * So this type is only for typescript type checking.
 */
export type PrivateConstructor<TClass = any> = { new(): never } & TClass;

/**
 * Check if the value is a constructor. (including private constructor)
 *
 * Actually, "private constructor" is only for typescript, so cannot be checked at runtime.
 *
 * @param value
 */
export function isConstructor<T = any>(value: any): value is Constructor<T> {
    return typeof value === 'function' && !!value.prototype;
}
