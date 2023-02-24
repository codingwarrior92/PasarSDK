import { ChainType } from "./chaintype";

export class ContractAddress {
    private contract: string;
    private network: ChainType

    constructor(addr: string, network: ChainType) {
        this.contract = addr;
        this.network = network;
    }

    public getContract(): string {
        return this.contract;
    }

    public getNetwork(): ChainType {
        return this.network;
    }
}
