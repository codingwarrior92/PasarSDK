import { OnePage } from "../onepage";
import { CollectionInfo } from "./collectioninfo";

export class CollectionPage extends OnePage<CollectionInfo> {
    constructor(totalCount: number, beforeTime: number, capacity: number, items: CollectionInfo[]) {
        super(totalCount, beforeTime, capacity, items)
    }

    public override getItems(): CollectionInfo[] {
        return super.getItems();
    }
}
