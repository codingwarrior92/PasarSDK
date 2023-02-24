import { ChainType } from "../chaintype";
import { ContractAddress } from "../contractaddress";
import { Condition, ConditionType } from "./condition";

export class PriceRangeCondition extends Condition {
    private token: string;
    private network: ChainType;
    private minPrice: number;
    private maxPrice: number;

    public constructor(token: string, network: ChainType, minPrice: number, maxPrice: number) {
        super(ConditionType.PriceRange);
        this.token = token;
        this.network = network;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public getToken(): ContractAddress {
        return new ContractAddress(this.token, this.network)
    }

    public getMinPrice(): number {
        return this.minPrice;
    }

    public getMaxPrice(): number {
        return this.maxPrice;
    }
}
