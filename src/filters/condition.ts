enum ConditionType {
    Sensitive,
    PricingTokens,
    Collections,
    PriceRange,
    ListingStatus,
    ItemType,
    Blockchain,
    CollectionCategory,
}

class Condition {
    private type: ConditionType;

    protected constructor(type: ConditionType) {
        this.type = type;
    }

    public getType(): ConditionType {
        return this.type;
    }
}

export {
    ConditionType,
    Condition
}
