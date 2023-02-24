import { ListType } from './listtype';
import { ChainType } from './chaintype';

export class ItemInfo {
    // token metadata
    private tokenId: string;
    private tokenIdHex: string;
    private name: string;
    private description: string;
    private thumbnail: string;
    private image: string;
    private sensitive: boolean;
    private properties: any;

    private createTime: number; // Minted timestamp
    private baseToken: string;  // Collection contract.
    private network: ChainType; // ESC/ETH/FSN

    private holder: string;
    private royaltyOwner: string;
    private royaltyRate: number;

    // fields relatd to be listed on market.
    private listedTime: number;

    private orderId: string;
    private orderType: ListType;
    private quoteToken: string;
    private orderState: any;

    // listed as fixed price
    private fixedPrice: string;

    // listed as auction
    private expiration: number;
    private minPrice: string;
    private reservePrice: string;
    private buyoutPrice: string;

    constructor(id: string,
        tokenIdHex: string,
        name: string,
        description: string,
        thumbnail: string,
        image:string,
        sesitive: boolean,
        properties: any,
        tokenVersion: number,
        networkIndex: number,
        holder: string,
        royaltyOwner: string,
        createTime: number,
        marketTime: number,
        endTime: number,
        orderId: string = null,
        quoteToken: string = null,
        price: string = null,
        buyoutPrice: string = null,
        reservePrice: string = null,
        orderState: any = null,
        orderType: any = null) {

        this.tokenId = id;
        this.tokenIdHex = tokenIdHex;
        this.name = name;
        this.description = description;
        this.thumbnail = thumbnail;
        this.image = image;
        this.sensitive = sesitive;
        this.properties = properties;
        this.holder = holder;
        this.royaltyOwner = royaltyOwner;
        this.createTime = createTime;
        this.listedTime = marketTime;
        this.expiration = endTime;
        this.orderId = orderId;
        this.quoteToken = quoteToken;
        this.fixedPrice = price;
        this.buyoutPrice = buyoutPrice;
        this.reservePrice = reservePrice;
        this.orderState = orderState;
        this.orderType = orderType;

        if(orderType == null || orderType == "") {
            this.orderType = null;
        } else if(parseInt(orderType) == 1) {
            this.orderType = ListType.FixedPrice;
        } else if(parseInt(orderType) == 2) {
            this.orderType = ListType.OnAuction;
        }

        switch(networkIndex) {
            case 1:
                this.network = ChainType.ESC;
                break;
            case 2:
                this.network = ChainType.ETH;
                break;
            case 3:
                this.network = ChainType.FSN;
                break;
            default:
                this.network = ChainType.ESC;
                break;
        }
    }

    public getTokenId(): string {
        return this.tokenId;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getThumbnail(): string {
        return this.thumbnail;
    }

    public getImage(): string {
        return this.image;
    }

    public getEnsensitve(): boolean {
        return this.sensitive;
    }

    public getProperties(): any {
        return this.properties;
    }

    public getCreated(): number {
        return this.createTime;
    }

    public getCollection(): string {
        return this.baseToken;
    }

    public getChainNetwork(): ChainType {
        return this.network;
    }

    public getHolder(): string {
        return this.holder;
    }

    public getRoyaltyOwner(): string {
        return this.royaltyOwner;
    }

    public getRoyaltyRate(): number {
        return this.royaltyRate;
    }

    public getListed(): number {
        return this.listedTime;
    }

    public getOrderId(): string {
        return this.orderId;
    }

    public getListType(): ListType {
        return this.orderType;
    }

    public getPricingToken(): string {
        return this.quoteToken;
    }

    public getFixedPrice(): string {
        return this.fixedPrice;
    }

    public getExpirated(): number {
        return this.expiration;
    }

    public getMinPrice(): string {
        return this.minPrice;
    }

    public getReservePrice(): string {
        return this.reservePrice;
    }

    public getBuyoutPrice(): string {
        return this.buyoutPrice;
    }

    public getOrderState(): string {
        return this.orderState.toString();
    }
}