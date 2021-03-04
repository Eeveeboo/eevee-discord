export declare class FunctionUtil {
    /**
     * Bind all methods on `scope` to that `scope`.
     *
     * Normal fat arrow/lambda functions in TypeScript are simply member functions
     * that replace the value of `this`, with `_this` (a reference to `this` from
     * within the constructor's scope). They're not on the prototype and as such do not
     * support inheritance. So no calling `super.myMethod()` if it's been
     * declared with a `=>`.
     *
     * `FunctionUtil.bindAllMethods( this )` should be called from the base class' constructor.
     * It will bind each method as such that it will always execute using the class scope.
     *
     * Essentially, we should now write class methods without `=>`. When executed,
     * the scope will be preserved and they will importantly continue to support
     * inheritance. Fat arrow/lambda functions (`=>`) are still great when you
     * don't require inheritance, for example, when using anonymous function callbacks.
     *
     * @param scope     Usually, pass the value of `this` from your base class.
     */
    static bindAllMethods(scope: {}): void;
}
export declare class ObjectUtil {
    /**
     * Searches the supplied object, and then down it's prototype chain until it
     * finds the object where `prop` is its own property. In other words, finds
     * the object in which `prop` was actually defined on, skipping objects that
     * merely inherit `prop`. This is useful when using methods like
     * `Object.getOwnPropertyDescriptor()` which only work on "own" properties.
     *
     * @param scope   The scope on which to start checking for
     * @param prop    The name of the property we're searching for
     * @returns {*}
     */
    static getPropertyDefinitionObject(scope: {}, prop: string): any;
}
