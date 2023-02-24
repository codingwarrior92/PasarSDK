import { Condition, ConditionType } from "../filters/condition";

enum Category {
    General = 'General',
    Collectibles = 'Collectibles',
    Art = 'Art',
    Photograhpy = 'Photography',
    TradingCards = 'TradingCards',
    Utility = 'Utility',
    Domains = 'Domains',
}

const getCategoryList = (): string[] => {
    return [
        Category.General,
        Category.Collectibles,
        Category.Art,
        Category.Photograhpy,
        Category.TradingCards,
        Category.Utility,
        Category.Domains
    ];
}

class CategoryConditon extends Condition {
    private category: Category;

    public constructor(category: Category = null) {
        super(ConditionType.CollectionCategory);
        this.category = category;
    }

    public getCategory(): Category {
        return this.category;
    }
}

export {
    Category,
    getCategoryList,
    CategoryConditon,
}
