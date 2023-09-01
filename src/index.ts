import { z } from "zod";
import expr from "property-expr";

type User = {
    name: string;
    age: number;
    is_allowed: 0 | 1;
    is_blocked?: 0 | 1;
    messages: string[];
    activity: {
        is_online: 0 | 1 | undefined;
        last_posted: number;
    };
};

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType &
        (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

type TTransformer<
    TObject extends object,
    TKeys extends NestedKeyOf<TObject>,
> = {
    key: TKeys;
    selectorFn: ReturnType<typeof expr.getter>;
    setterFn: ReturnType<typeof expr.setter>;
};

class Transformer<TObject extends object, TKeys extends NestedKeyOf<TObject>> {
    object: TObject;
    transformers: TTransformer<TObject, NestedKeyOf>[];

    constructor(object: TObject) {
        this.object = object;
        this.transformers = [];
    }

    transform<R>(transformFn: (value: any) => R) {
        this.transformers.forEach(({ selectorFn, setterFn }) => {
            const value = selectorFn(this.object);
            setterFn(this.object, transformFn(value));
        });

        return this.object as unknown as CastProperties<
            TObject,
            "activity.is_online",
            R
        >;
    }

    // select(...keyPaths: TKeys[]) {
    //     keyPaths.forEach((keyPath) => {
    //         this.transformers.push({
    //             key: keyPath,
    //             selectorFn: expr.getter(keyPath),
    //             setterFn: expr.setter(keyPath),
    //         });
    //     });
    //     return this;
    // }

    select(keyPath: TKeys) {
        const transformer: TTransformer<TObject> = {
            key: keyPath,
            selectorFn: expr.getter(keyPath),
            setterFn: expr.setter(keyPath),
        };
        return this;
    }
}

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

type CastProperties<
    TModel extends object,
    TMatchedKey extends NestedKeyOf<User>,
    R,
    RootKey extends string = "",
> = {
    [Key in keyof TModel & string]: TModel[Key] extends RecursiveObject<
        TModel[Key]
    >
        ? CastProperties<TModel[Key], TMatchedKey, R, `${Key}`>
        : KeyPath<RootKey, Key> extends TMatchedKey
        ? R
        : TModel[Key];
};

const lumine = {
    name: "Lumine",
    age: 9999,
    is_allowed: 1,
    is_blocked: undefined,
    messages: ["123"],
    activity: {
        is_online: 1,
        last_posted: 0,
    },
};

type X = CastProperties<
    User,
    "activity.is_online" | "activity.last_posted",
    boolean
>;
const x: X = lumine as unknown as X;
x.activity.is_online;
x.activity.last_posted;

const y: CastProperties<typeof x, "age", string> =
    x as unknown as CastProperties<X, "age", string>;
y.age;

const transformer = new Transformer(lumine);

let output = transformer
    .select("activity.is_online")
    .transform((value) => Boolean(value));

output.is_allowed;
output.activity.is_online;

console.log(output);
