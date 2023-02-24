import Web3 from "web3";
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import WalletConnectProvider  from "@walletconnect/web3-provider";
import { getChainTypeById } from "./chaintype";
import valuesTestNet from "./contracts/deploy/testnet.json";
import valuesMainNet from "./contracts/deploy/mainnet.json";

export class AppContext {
    private env: any;
    private appDID: string;

    private assistUrl: string;
    private ipfsUrl: string;
    private didResover: string;

    private web3: Web3;
    private walletConnector: WalletConnectProvider;

    static appContext: AppContext;

    private constructor(env: any) {
        this.env = env;
        this.assistUrl  = this.env['assistUrl'];
        this.ipfsUrl    = this.env['ipfsUrl'];
        this.didResover = this.env['didResover'];
        this.appDID     = this.env['appDid'];

        this.walletConnector = new EssentialsConnector().getWalletConnectProvider();
        this.web3 =  new Web3(this.isInAppBrowser() ? window['elastos'].getWeb3Provider(): this.walletConnector);
    }

    static createInstance(testnet: boolean) {
        this.appContext = new AppContext(
            testnet ? valuesTestNet: valuesMainNet
        );
    }

    static getInstance(): AppContext {
       return this.appContext;
    }

    public getAssistNode(): string {
        return this.assistUrl;
    }

    public getIPFSNode(): string {
        return this.ipfsUrl;
    }

    public getDidResolver(): string {
        return this.didResover
    }

    public getDiaAddress(): any {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["diaToken"];
    }

    public isInAppBrowser(): boolean {
        return window['elastos'] !== undefined && window['elastos'].name === 'essentialsiab';
    }

    public getChainType(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId);
        return chainName;
    }

    public getWeb3(): Web3 {
        return this.web3;
    }

    public getRegistryContract(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["registry"];
    }

    public getMarketContract(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["marketv2"];
    }

    public getPasarCollectionAddress(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["pasarNft"];
    }

    public getFeedsCollectionAddress(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["feedsNft"];
    }
}
