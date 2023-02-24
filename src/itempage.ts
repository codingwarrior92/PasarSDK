import { ItemInfo } from "./iteminfo"
import { OnePage } from "./onepage";

export class ItemPage extends OnePage<ItemInfo> {
    constructor(totalCount: number, beforeTime: number, capacity: number, items: ItemInfo[]) {
        super(totalCount, beforeTime, capacity, items)
    }

    public override getItems(): ItemInfo[] {
        return super.getItems();
    }
}
