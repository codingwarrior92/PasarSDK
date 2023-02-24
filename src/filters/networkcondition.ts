import { ChainType } from "../chaintype";
import { Condition, ConditionType } from "./condition"

export class NetworkCondition extends  Condition {
    private network: string;

    public constructor(network: ChainType) {
        super(ConditionType.Blockchain)
        this.network = network;
    }

    public getNetwork(): string {
        return this.network;
    }
}
