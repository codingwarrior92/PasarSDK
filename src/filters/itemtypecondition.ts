import { ConditionType, Condition } from "./condition";

enum ItemType {
    General,
    Avatar,
}

class ItemTypeCondition extends Condition {
    private types: ItemType[];

    public constructor() {
        super(ConditionType.ItemType);
    }

    public appendType(type: ItemType): ItemTypeCondition {
        this.types.push(type);
        return this;
    }
}

export {
    ItemType,
    ItemTypeCondition,
}
