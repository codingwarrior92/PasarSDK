import { ChainType } from "../chaintype";
import { ContractAddress } from "../contractaddress";
import { Condition, ConditionType } from "./condition";

export class CollectionCondition extends Condition {
    private collections: ContractAddress[];

    public constructor() {
        super(ConditionType.Collections);
    }

    public appendCollection(contract: string, network: ChainType): CollectionCondition {
        this.collections.push(new ContractAddress(contract, network));
        return this;
    }

    public count(): number {
        return this.collections.length;
    }

    public getCollection(index: number): ContractAddress {
        return this.count() > index ? this.collections[index]: null;
    }
}
