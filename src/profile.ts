import { AppContext } from "./appcontext"
import { getBiddingItems, getCreatedItems, getListedItems, getOwnedItems, getSoldItems, getOwnedCollections } from "./assistservice";
import { CollectionPage } from "./collection/collectionpage";
import { Filter } from "./filters/filter";
import { ItemPage } from "./itempage";

export class Profile {
    private userDid: string;
    private walletAddr: string;
    private assistUrl: string;

    constructor(appContext: AppContext, userDid: string, walletAddr: string) {
        this.assistUrl = appContext.getAssistNode();
        this.userDid = userDid
        this.walletAddr = walletAddr
    }

    public getUserDid(): string {
        return this.userDid
    }

    public getWalletAddress(): string {
        return this.walletAddr
    }

    /**
     * Query the NFTs owned by this profile.
     *
     * @param _ealierThen
     * @param _capacity
     * @param _filter A filter condition
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<ItemPage> {
        try {
            return await getOwnedItems(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query owned item errors: ${error}`)
        }
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<ItemPage> {
        try {
            return await getListedItems(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query listed items error: ${error}`)
        }
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<ItemPage> {
        try {
            return await getBiddingItems(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query bidding items error: ${error}`)
        }
    }

    /**
     * Query the NFTs created by this profile.
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<ItemPage> {
        try {
            return await getCreatedItems(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query created items error: ${error}`)
        }
    }

    /**
     * Query the NFTs sold by this profile
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async querySoldItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<ItemPage> {
        try {
            return await getSoldItems(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query sold items error: ${error}`)
        }
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryOwnedCollections(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<CollectionPage> {
        try {
            return await getOwnedCollections(this.assistUrl, this.walletAddr)
        } catch (error) {
            throw new Error(`Query owned qcollections error: ${error}`)
        }
    }
}
