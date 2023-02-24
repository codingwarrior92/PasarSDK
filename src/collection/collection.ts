import { Filter } from "../filters/filter";
import { AppContext } from "../appcontext";
import { CollectionInfo } from "./collectioninfo";
import { SocialLinks } from "../sociallinks";
import { ItemPage } from "../itempage";
import { ChainType } from "../chaintype";
import { ERCType } from "../erctype";

class Collection {
    private assistURI: string;
    private metadata: CollectionInfo;

    constructor(appContext: AppContext, collecionInfo: CollectionInfo) {
        this.assistURI = appContext.getAssistNode();
        this.metadata = collecionInfo;
    }

    public getContractAddress(): string {
        return this.metadata.getContractAddress();
    }

    public getNetwork(): ChainType {
        return this.metadata.getNetwork();
    }

    public getCreatorDid(): string {
        return this.metadata.getCreatorDid();
    }

    public getOwnerAddress(): string {
        return this.metadata.getOwnerAddress();
    }

    public getName(): string {
        return this.metadata.getName();
    }

    public getSymbol(): string {
        return this.metadata.getSymbol();
    }

    public getSoicalLinks(): SocialLinks {
        return this.metadata.getSoicalLinks();
    }

    public getAvatar(): string {
        return this.metadata.getAvatar();
    }

    public getBanner(): string {
        return this.metadata.getBanner();
    }

    public getDescription(): string {
        return this.metadata.getDescription();
    }

    public getERCStandard(): ERCType {
        return this.metadata.getERCStandard();
    }

    public getCategory(): string {
        return this.metadata.getCategory();
    }

    public queryItemCount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryTradingVolume(pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryFloorPrice(pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryItems(_beforeTime: number, _capcity = 0, _filter = new Filter()): Promise<ItemPage> {
        throw new Error("Method not implemented");
    }
}

export {
    Collection,
}
