import { Category } from "./category";
import { ERCType } from "../erctype";
import { ChainType } from "../chaintype";
import { SocialLinks } from "../sociallinks";

class CollectionInfo {
    private constractAddr: string;
    private network: ChainType;
    private creatorDid: string;
    private ownerAddress: string;
    private name: string;
    private symbol: string;

    private socialLinks: SocialLinks;
    private avatar: string;
    private banner: string;
    private description: string;
    private ercType: ERCType;
    private category: Category;

    private uri: string;
    private owners: number;
    private items: number;
    private lowestPrice: bigint;
    private tradingVolume: bigint;

    constructor(contractAddr: string,
        network: ChainType,
        creatorDid: string,
        creatorAddr: string,
        name: string,
        symbol: string
    ) {
        this.constractAddr = contractAddr;
        this.network = network;
        this.creatorDid = creatorDid;
        this.ownerAddress = creatorAddr;
        this.name = name;
        this.symbol = symbol;
    }

    public setSocialLinks(soicalLinks: SocialLinks): CollectionInfo {
        this.socialLinks = soicalLinks;
        return this;
    }

    public setAvatar(avatar: string): CollectionInfo {
        this.avatar = avatar;
        return this;
    }

    public setBanner(banner: string): CollectionInfo {
        this.banner = banner;
        return this;
    }

    public setDescription(description: string): CollectionInfo {
        this.description = description;
        return this;
    }

    public setErcType(ercType: ERCType): CollectionInfo {
        this.ercType = ercType;
        return this;
    }

    public setCategory(category: Category): CollectionInfo {
        this.category = category;
        return this;
    }

    public setUri(uri: string): CollectionInfo {
        this.uri = uri;
        return this;
    }

    public setItems(items: number): CollectionInfo {
        this.items = items;
        return this;
    }

    public setOwners(owners: number): CollectionInfo {
        this.owners = owners;
        return this;
    }

    public setLowestPrice(price: bigint): CollectionInfo {
        this.lowestPrice = price;
        return this;
    }

    public setTradingVolume(tradingVolume: bigint): CollectionInfo {
        this.tradingVolume = tradingVolume;
        return this;
    }

    public getContractAddress(): string {
        return this.constractAddr;
    }

    public getNetwork(): ChainType {
        return this.network;
    }

    public getCreatorDid(): string {
        return this.creatorDid;
    }

    public getOwnerAddress(): string {
        return this.ownerAddress;
    }

    public getName(): string {
        return this.name;
    }

    public getSymbol(): string {
        return this.symbol;
    }

    public getSoicalLinks(): SocialLinks {
        return this.socialLinks;
    }

    public getAvatar(): string {
        return this.avatar;
    }

    public getBanner(): string {
        return this.banner;
    }

    public getDescription(): string {
        return this.description;
    }

    public getERCStandard(): ERCType {
        return this.ercType;
    }

    public getCategory(): string {
        return this.category;
    }

    public getUri(): string {
        return this.uri;
    }

    public getOwners(): number {
        return this.owners;
    }

    public getItems(): number {
        return this.items;
    }

    public getLowestPrice(): bigint {
        return this.lowestPrice;
    }

    public getTradingVolume(): bigint {
        return this.tradingVolume;
    }
}

export {
    CollectionInfo,
}
