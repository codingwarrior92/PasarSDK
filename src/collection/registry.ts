import { AppContext } from "../appcontext";
import { Filter } from "../filters/filter";
import { CollectionPage } from "./collectionpage";

class Registry {
    private assistURL: string;

    constructor(appContext: AppContext) {
        this.assistURL = appContext.getAssistNode()
    }

    public queryCollectionCount(): Promise<number> {
        throw new Error("Method not implemented")
    }

    public queryCollections(beforeTime: number, _capcity: number, _queryFilter = new Filter()
    ): Promise<CollectionPage> {
        throw new Error("Method not implemented")
    }

    public getLatestCollection(queryFilter = new Filter()) {
        throw new Error("Method not implemented")
    }
}

export {
    Registry
}
