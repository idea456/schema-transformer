type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType &
        (string | number)]: ObjectType[Key] extends RecursiveObject<
        ObjectType[Key]
    >
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

// TODO: Resolve more cases for Record, Set, Map, etc
type RecursiveObject<T> = T extends Date
    ? never
    : T extends any[]
    ? never
    : T extends object
    ? T
    : never;

type KeyPath<
    RootKey extends string,
    ChildKey extends string,
> = RootKey extends "" ? `${ChildKey}` : `${RootKey}.${ChildKey}`;

type AttributeType<
    T,
    Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
        ? AttributeType<T[Head], Tail>
        : never
    : Path extends keyof T
    ? T[Path]
    : never;

type DeepCastProperties<
    TModel extends object,
    CastType extends unknown,
    SelectedKeys extends string,
    RootKey extends string = "",
> = {
    [Key in keyof TModel & string]: TModel[Key] extends RecursiveObject<
        TModel[Key]
    >
        ? DeepCastProperties<TModel[Key], CastType, SelectedKeys, `${Key}`>
        : KeyPath<RootKey, Key> extends SelectedKeys
        ? CastType
        : TModel[Key];
};
