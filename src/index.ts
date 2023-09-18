import expr from "property-expr";

export class Transformer<TObject extends object> {
    object: TObject;

    constructor(object: TObject) {
        this.object = object;
    }

    select<SelectedKeys extends NestedKeyOf<TObject>>(
        ...selectedKeys: SelectedKeys[]
    ) {
        const apply = <ReturnType>(
            transformFn: (
                value: AttributeType<TObject, SelectedKeys>,
            ) => ReturnType,
        ) => {
            selectedKeys.forEach((selectedKey) => {
                const value = expr.getter(selectedKey)(this.object);
                expr.setter(selectedKey)(this.object, transformFn(value));
            });

            return new Transformer(
                this.object as DeepCastProperties<
                    TObject,
                    ReturnType,
                    SelectedKeys
                >,
            );
        };
        return {
            apply,
        };
    }

    transform() {
        return this.object;
    }
}
