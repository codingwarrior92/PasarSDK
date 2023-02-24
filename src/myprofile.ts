import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import bs58 from 'bs58';
import { Category } from "./collection/category";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { resizeImage, requestSigndataOnTokenID, isNativeToken, checkParams } from "./utils";
import { AppContext } from './appcontext';
import { ContractHelper } from './contracthelper';
import { SocialLinks } from './sociallinks';

import PasarCollectionABI from './contracts/abis/pasarCollection';
import FeedsCollectionABI from './contracts/abis/feedsCollection';
import Token721ABI from "./contracts/abis/token721ABI"
import Token721Code from "./contracts/bytecode/token721Code";
import Token1155ABI from "./contracts/abis/token1155ABI"

/**
 * This class represent the Profile of current signed-in user.
 */
export class MyProfile {
    private appContext: AppContext;
    private contractHelper: ContractHelper;
    private ipfsUrl: string;

    private name: string;
    private userDid: string;
    private description: string;
    private avatar: string;
    private walletAddress: string;

    constructor(appContext: AppContext, userDid: string,
        walletAddress: string,
        name: string,
        description: string,
        avatar: string) {

        if (!appContext ||
            !checkParams(userDid) ||
            !checkParams(walletAddress)){
            throw new Error("appContext, userDid and walletAddress can not be empty values")
        }

        this.appContext = appContext;
        this.ipfsUrl = appContext.getIPFSNode()
        this.userDid = userDid;
        this.walletAddress = walletAddress;
        this.name = name || this.userDid;
        this.description = description || "";
        this.avatar = avatar;
        this.contractHelper = new ContractHelper(walletAddress, appContext);
    }

    public updateName(name: string): MyProfile {
        this.name = name || this.userDid
        return this;
    }

    public updateDescription(description: string): MyProfile {
        this.description = description
        return this;
    }

    public updateAvatar(avatar: string): MyProfile {
        this.avatar = avatar;
        return this;
    }

    public getUserDid(): string {
        return this.userDid
    }

    public getWalletAddress(): string {
        return this.walletAddress
    }

    public getName(): string {
        return this.name
    }

    public getDescription(): string {
        return this.description
    }

    /**
     * Generate a metadata json file of the NFT collection that is about to be registered.
     *
     * @param category The category of NFT collection
     * @param description The brief description of NFT collection
     * @param avatarPath The avatar image path
     * @param bannerPath The background image path
     * @param socialLinks The social media related to this NFT collection
     * @returns The URI to this collection metadata json file on IPFS storage.
     */
    public async createCollectionURI(category: Category,
        description: string,
        avatarPath: string,
        bannerPath: string,
        socialLinks: SocialLinks) {

        if (!checkParams(description) ||
            !checkParams(avatarPath) ||
            !checkParams(bannerPath)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let client = create({ url: this.ipfsUrl })
            let avatarCid = await client.add(avatarPath)
            let bannerCid = await client.add(bannerPath)

            let data = {
                avatar: `pasar:image:${avatarCid.path}`,
                background: `pasar:image:${bannerCid.path}`,
                description,
                category: category.toString(),
                socials: socialLinks.toJson(),
            }

            let plainData = bs58.encode(Buffer.from(JSON.stringify(data)))
            let signedData = await requestSigndataOnTokenID(plainData);
            let creatorJson = {
                did: this.userDid,
                name: this.name,
                description: this.description,
                signature: signedData && signedData.signature ? signedData.signature : ""
            }

            let metadata = {
                "version": "1",
                "creator": creatorJson,
                "data": data
            }

            let cid = await client.add(JSON.stringify(metadata))
            return `pasar:json:${cid.path}`
        }catch(error) {
            throw new Error(`Create collection metadata error: ${error}`);
        }
    }

    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     * Currently only ERC721 standard is supported.
     *
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @returns The deployed NFT collection contract address.
     */
     public async createCollection(name: string, symbol: string): Promise<string> {
        if (!checkParams(name) || !checkParams(symbol)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            return await this.contractHelper.createCollection(
                name, symbol, Token721ABI, Token721Code
            )
        } catch (error) {
            throw new Error(`Deploy a new collection error ${error}`)
        }
    }

    /**
     * Register an specific NFT collection onto Pasar marketplace.
     * Once the collection is registered to Pasar marketplace, the NFTs in this collection can
     * be listed onto market for trading.
     *
     * @param collection The NFT collection contract address
     * @param collectionURI The uri of the NFT collection referring to the metadata json file on
     *        IPFS storage
     * @param royalties The roraylty rates for this NFT collection
     * @returns The result of whether this NFT collection contract is registered ont Pasar or not
     */
    public async registerCollection(collection: string,
        name: string,
        collectionURI: string,
        royalties: RoyaltyRate[]) {

        if (!checkParams(collection) ||
            !checkParams(name) ||
            !checkParams(collectionURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.registerCollection(
                this.appContext.getRegistryContract(), collection, name, collectionURI,
                royalties
            )
        } catch (error) {
            throw new Error(`Register collection onto Pasar error: ${error}`)
        }
    }

    /**
     * Update collection URI or name for the NFT collection
     * Notice: the current wallet address should be the owner of this NFT collection.
     * @param collection The NFT collection contract address
     * @param name The new name of NFT collection
     * @param collectionURI The new uri of NFT collection to metadata json file on IPFS storage
     * @returns The result of whether the NFT collection is updated or not.
     */
    public async updateCollectionUri(collection: string,
        name: string,
        collectionURI: string) {

        if (!checkParams(collection) ||
            !checkParams(name) ||
            !checkParams(collectionURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.updateCollectionInfo(
                this.appContext.getRegistryContract(), collection, name, collectionURI
            )
        } catch (error) {
            throw new Error(`Update collection uri error: ${error}`)
        }
    }

    /**
     * Update royalties for the NFT collection
     * @param collection The NFT collection contract address
     * @param royaltyRates The roraylty rates for this NFT collection
     * @result
     */
     public async updateCollectionRoyalty(collection: string,
        royaltyRates: RoyaltyRate[]) {

        if (!checkParams(collection) || !royaltyRates) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.updateCollectionRoyalties(
                this.appContext.getRegistryContract(), collection, royaltyRates
            );
        } catch (error) {
            throw new Error(`Update collection royalty error: ${error}`)
        }
    }

    /**
     * Generate an metadata json file of the NFT that is about to be minted
     *
     * @param itemName The name of NFT item to be minted
     * @param itemDescription The brief description of an NFT item
     * @param itemImage The actual image of an NFT item
     * @param properties properties of nft
     * @param sensitive Indicator whether the NFT item contains sensitive content or not
     * @returns the tokenId and uri information
     */
    public async createTokenURI(itemName: string,
        itemDescription: string,
        itemImage: any,
        properties: any = null, // TODO: Must be json
        sensitive = false
    ): Promise<any> {
        if (!checkParams(itemName) ||
            !checkParams(itemDescription) ||
            !checkParams(itemImage)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            const client = create({ url: this.ipfsUrl });
            let imageCID  = await client.add(itemImage)
            let thumbnail = await resizeImage(itemImage, 300, 300) as any

            let thumbnailCID: any
            if(thumbnail['success'] === 0) {
                thumbnailCID = await client.add(thumbnail.fileContent)
            } else {
                thumbnailCID = imageCID
            }

            let tokenId = `0x${sha256(imageCID.path)}`;
            let signedData = await requestSigndataOnTokenID(tokenId);

            const creatorObject = {
                "did": this.userDid,
                "name": this.name,
                "description": this.description, // TODO: need signed data on tokenID here.
            }

            const imageObject = {
                "image": `pasar:image:${imageCID.path}`,
                "kind": itemImage.type.replace('image/', ''),
                "size": itemImage.size,
                "thumbnail": `pasar:image:${thumbnailCID.path}`,
                "signature": signedData && signedData.signature ? signedData.signature : ""
            }

            const metaObj = {
                "version": "2",
                "type": 'image',
                "name": itemName,
                "description": itemDescription,
                "creator": creatorObject,
                "data": imageObject,
                "adult": sensitive,
                "properties": properties || "",
            }

            let metaData = await client.add(JSON.stringify(metaObj));
            
            return {
                uri: `pasar:json:${metaData.path}`,
                tokenId: tokenId
            }
        } catch(error) {
            throw new Error(`Create token URI error: ${error}`);
        }
    }

    /**
     * Mint an NFT item from a specific collection contract with single quantity, in
     * this function, the tokenId of this NFT item would be generated by SHA25 agorithm
     * on tokenURI string of metadata json file on IPFS sotrage.
     * Notice: This function should be used for minting NFTs from dedicated collection.
     *
     * @param collection The collection contract where NFT items would be minted
     * @param tokenId the id of new nft
     * @param tokenURI The token uri to this new NFT item
     * @returns 
     */
    public async createItem(collection: string, tokenId: string, tokenURI: string): Promise<void> {
        if (!checkParams(collection) || !checkParams(tokenId) || !checkParams(tokenURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.mintERC721Item(collection, tokenId, tokenURI);
        } catch (error) {
            throw new Error(`Create NFT item error: ${error}`)
        }
    }

    /**
     * Mint an NFT item from a specific collection contract with single quantity, in
     * this function, the tokenId of this NFT item would be generated by SHA25 agorithm
     * on tokenURI string of metadata json file on IPFS sotrage.
     * Notice: This function should be used for minting NFTs from public collection.
     *
     * @param tokenId the id of new nft
     * @param tokenURI The token uri to this new NFT item
     * @param roylatyFee The royalty fee to the new NFT item
     * @returns
     */
    public async createItemFromFeeds(tokenId: string, tokenURI: string,roylatyFee: number): Promise<void> {
        if (!checkParams(tokenId) || !checkParams(tokenURI) || !checkParams(roylatyFee)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.mintFromFeedsCollection(
                this.appContext.getFeedsCollectionAddress(), tokenId, tokenURI, roylatyFee, ""
            );
        } catch (error) {
            throw new Error(`Create item from Feeds collection error: ${error}`)
        }
    }

    /**
     * Mint a nft on Pasar collection
     *
     * @param tokenId the id of new nft
     * @param tokenURI The token uri to this new NFT item
     * @param roylatyFee The royalty fee to the new NFT item
     * @returns
     */
    public async createItemFromPasar(tokenId: string, tokenURI: string,roylatyFee: number): Promise<void> {
        if ( !checkParams(tokenId) || !checkParams(tokenURI) || !checkParams(roylatyFee)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.mintFromPasarCollection(
                this.appContext.getPasarCollectionAddress(), tokenId, tokenURI, roylatyFee
            );
        } catch (error) {
            throw new Error(`Create item from Pasar collection error: ${error}`)
        }
    }

    /**
     * Transfer NFT item to another address.
     *
     * @param collection the collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param toAddr the target wallet address to recieve the NFT item
     * @returns
     */
    public async transferItem(collection: string, tokenId: string, toAddr: string) {
        if (!checkParams(collection) ||
            !checkParams(tokenId) ||
            !checkParams(toAddr)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.approveItems(Token721ABI, collection, toAddr);
            await this.contractHelper.transfer721Item(toAddr, tokenId, collection);
        } catch (error) {
            throw new Error(`Transfer NFT item error: ${error}`)
        }
    }

    public async transferItemInFeeds(tokenId: string, toAddr: string) {
        if (!checkParams(tokenId) ||
            !checkParams(toAddr)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let collection = this.appContext.getFeedsCollectionAddress()
            await this.contractHelper.approveItems(FeedsCollectionABI, collection, toAddr);
            await this.contractHelper.transferItemInFeeds(toAddr, tokenId, collection);
        } catch (error) {
            throw new Error(`Transfer NFT item in Feeds collection error: ${error}`)
        }
    }

    public async transferItemInPasar(tokenId: string, toAddr: string) {
        if (!checkParams(tokenId) ||
            !checkParams(toAddr)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let collection = this.appContext.getPasarCollectionAddress()
            await this.contractHelper.approveItems(PasarCollectionABI, collection, toAddr);
            await this.contractHelper.transferItemInFeeds(toAddr, tokenId, collection);
        } catch (error) {
            throw new Error(`Transfer NFT item in Pasar collection error: ${error}`)
        }
    }

     /**
     * Delete exiting NFT item.
     * Notice: the NFT item should be unlisted from marketplace first before deleting
     *         the item.
     *
     * @param collection The collection contract where NFT items would be burned
     * @param tokenId The tokenId of NFT item to be burned
     * @returns The result of whether the NFT is deleted or not.
     */
    public async deleteItem(collection: string, tokenId: string) {
        if (!checkParams(collection) ||
            !checkParams(tokenId) ) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.burnERC721Item(collection, tokenId);
        } catch (error) {
            throw new Error(`Delete item tokenId ${tokenId} from collection ${collection}`);
        }
    }

    public async deleteItemFromFeeds(tokenId: string) {
        if (!checkParams(tokenId)) {
            throw new Error("Parameters invalid with empty values")
        }
        try {
            let collection = this.appContext.getFeedsCollectionAddress()
            await this.contractHelper.burnItemInFeeds(collection, tokenId);
        } catch (error) {
            throw new Error(`Delete item tokenId ${tokenId} from Feeds collection`);
        }
    }

    public async deleteItemInPasar(tokenId: string) {
        if (!checkParams(tokenId)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let collection = this.appContext.getPasarCollectionAddress()
            await this.contractHelper.burnItemInPasar(collection, tokenId);
        } catch (error) {
            throw new Error(`Delete item tokenId ${tokenId} from Pasar collection`);
        }
    }

    /**
     * Create a metadata json file for trading either buyer or seller.
     *
     * @eturns The uri of metadata json file pushed onto IPFS storage.
     */
    public async createUserURI() {
        try {
            let client = create({url: this.ipfsUrl });
            let userCID = await client.add(JSON.stringify({
                "did": this.userDid,
                "name": this.name,
                "description": this.description
            }));

            return `pasar:json:${userCID.path}`;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * List an specific NFT item onto marketplace for rading with fixed price.
     *
     * @param collection The collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param pricingToken The token address of pricing token
     * @param price The price value to sell
     * @param sellerURI:
     */
    public async listItem(collection: string,
        tokenId: string,
        pricingToken:string,
        price: number,
        sellerURI: string) {

        if (!checkParams(collection) ||
            !checkParams(tokenId) ||
            !checkParams(pricingToken) ||
            !checkParams(sellerURI) || price > 0) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.approveItems(Token721ABI, collection, this.appContext.getMarketContract());
            await this.contractHelper.createOrderForSale(
                this.appContext.getMarketContract(),
                tokenId,
                collection,
                BigInt(price*1e18).toString(),
                pricingToken,
                sellerURI
            );
        } catch (error) {
            throw new Error(`List item on market error: ${error}`)
        }
    }

    private async listItem1155(collection: string,
        tokenId: string,
        pricingToken: string,
        price: number,
        sellerURI: string) {
        try {
            let marketContract = this.appContext.getMarketContract()
            await this.contractHelper.approveItems(Token1155ABI, collection, marketContract);
            await this.contractHelper.createOrderForSale(
                marketContract,
                tokenId,
                collection,
                BigInt(price*1e18).toString(),
                pricingToken,
                sellerURI
            );
        } catch (error) {
            throw new Error(`List item on market error: ${error}`)
        }
    }

    public async listItemFromFeeds(tokenId: string,
        pricingToken: string,
        price: number,
        sellerURI: string) {

        if (!checkParams(tokenId) ||
            !checkParams(pricingToken) ||
            !checkParams(sellerURI) || price > 0) {
            throw new Error("Parameters invalid with empty values")
        }

        let collection = this.appContext.getFeedsCollectionAddress()
        return await this.listItem1155(collection, tokenId, pricingToken, price, sellerURI)
    }

    public async listItemFromPasar(tokenId: string,
        pricingToken: string,
        price: number,
        sellerURI: string) {

        if (!checkParams(tokenId) ||
            !checkParams(pricingToken) ||
            !checkParams(sellerURI) || price > 0) {
            throw new Error("Parameters invalid with empty values")
        }

        let collection = this.appContext.getPasarCollectionAddress()
        return await this.listItem1155(collection, tokenId, pricingToken, price, sellerURI)
    }

    /**
     * Change the listed price for NFT item on marketplace
     * This function would be used to change the price of listed item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param newPricingToken The token address of new pricing token
     * @param newPrice The new listed price
     * @returns The result of bidding action.
     */
    public async changePrice(orderId: string,
        newPricingToken: string,
        newPrice: number) {

        if (!checkParams(orderId) ||
            !checkParams(newPricingToken) || newPrice > 0) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.changePrice(
                this.appContext.getMarketContract(),
                parseInt(orderId),
                BigInt(newPrice*1e18).toString(),
                newPricingToken
            )
        } catch (error) {
            throw new Error(`Change fixed price error: ${error}`)
        }
    }

    /**
     * Buy an item listed on marketplace
     * This function is used to buy the item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @returns The orderId of buying the order
     */
    public async buyItem(orderId: string,
        buyingPrice: number,
        buyingToken: string,
        buyerURI: string) {

        if (!checkParams(orderId) ||
            !checkParams(buyingToken) || buyingPrice > 0 ||
            !checkParams(buyerURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            if (!isNativeToken(buyingToken)) {
                await this.contractHelper.approveToken(
                    buyingPrice, buyingToken, this.appContext.getMarketContract()
                );
            }
            await this.contractHelper.buyItem(
                this.appContext.getMarketContract(),
                orderId, buyingPrice, buyingToken, buyerURI
            );
        } catch (error) {
            throw new Error(`Buying item ${orderId} error: ${error}`)
        }
    }

    /**
     * List an specific NFT item onto marketplace for rading on auction.
     *
     * @param collection The collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param pricingToken The contract address of ERC20 token as pricing token
     * @param minPrice The minimum starting price for bidding on the auction
     * @param reservePrice The minimum pricing that user
     * @param buyoutPrice The buyout price for the auction order, set to 0 to disable buyout
     * @param expirationTime: The time for ending the auction
     * @param sellerURI The uri of seller information on IPFS storage
     */
    public async listItemOnAuction(collection: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string) {

        if (!checkParams(collection) ||
            !checkParams(tokenId) ||
            !checkParams(pricingToken) || minPrice > 0 ||
            !checkParams(sellerURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let marketContract = this.appContext.getMarketContract()

            await this.contractHelper.approveItems(Token721ABI, collection, marketContract);
            await this.contractHelper.createOrderForAuction(
                marketContract,
                collection,
                tokenId,
                pricingToken,
                minPrice,
                reservePrice,
                buyoutPrice,
                expirationTime,
                sellerURI
            );
        } catch (error) {
            throw new Error(`List item on Auction from collection ${collection} error: ${error}`)
        }
    }

    private async listItemERC1155OnAuction(collection: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string) {

        try {
            let marketContract = this.appContext.getMarketContract()

            await this.contractHelper.approveItems(Token1155ABI, collection, marketContract);
            await this.contractHelper.createOrderForAuction(
                marketContract,
                collection,
                tokenId,
                pricingToken,
                minPrice,
                reservePrice,
                buyoutPrice,
                expirationTime,
                sellerURI
            );
        } catch (error) {
            throw new Error(`List item on Auction from collection ${collection} error: ${error}`)
        }
    }

    public async listItemOnAuctionFromFeeds(tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string) {

        if (!checkParams(tokenId) ||
            !checkParams(pricingToken) || minPrice > 0 ||
            !checkParams(sellerURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        return await this.listItemERC1155OnAuction(this.appContext.getFeedsCollectionAddress(),
            tokenId, pricingToken, minPrice, reservePrice, buyoutPrice, expirationTime, sellerURI)
    }

    public async listItemOnAuctionFromPasar(tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string) {

        if (!checkParams(tokenId) ||
            !checkParams(pricingToken) || minPrice > 0 ||
            !checkParams(sellerURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        return await this.listItemERC1155OnAuction(this.appContext.getPasarCollectionAddress(),
            tokenId, pricingToken, minPrice, reservePrice, buyoutPrice, expirationTime, sellerURI)
    }

    /**
     * Change the auction price for listed item on marketplace
     * This function would be used to change the price of listed item on auction
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param newPricingToken The token address of new pricing token
     * @param newMinPrice The new minimum starting price for bidding on the auction
     * @param newReservedPrice The new minimum pricing that user
     * @param newBuyoutPrice The new buyout price for the auction order, set to 0 to disable
     *        buyout
     * @returns The orderId
     */
    public async changePriceOnAuction(orderId: string,
        newPricingToken: string,
        newMinPrice: number,
        newReservedPrice: number,
        newBuyoutPrice: number) {

        if (!checkParams(orderId) ||
            !checkParams(newPricingToken) || newMinPrice > 0) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.changePriceOnAuction(
                this.appContext.getMarketContract(),
                parseInt(orderId),
                BigInt(newMinPrice*1e18).toString(),
                BigInt(newReservedPrice*1e18).toString(),
                BigInt(newBuyoutPrice*1e18).toString(),
                newPricingToken
            )
        } catch (error) {
            throw new Error(`Change price on auction error: ${error}`);
        }
    }

    /**
     * Offer a bidding price on list item that is being on auciton on marketplace.
     *
     * @param orderId The orderId of NFT item listed on auciton.
     * @param pricingToken
     * @param price The price offered by bidder
     * @param bidderURI The uri of bidder information on IPFS storage
     * @returns The result of bidding action.
     */
    public async bidItemOnAuction(orderId: string,
        pricingToken: string,
        price: number,
        bidderURI: string) {

        if (!checkParams(orderId) ||
            !checkParams(pricingToken) || price > 0 ||
            !checkParams(bidderURI)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            let marketContract = this.appContext.getMarketContract()
            if (!isNativeToken(pricingToken)) {
                await this.contractHelper.approveToken(price, pricingToken, marketContract);
            }

            await this.contractHelper.bidItemOnAuction(marketContract,
                orderId,
                price,
                pricingToken,
                bidderURI)
        } catch (error) {
            throw new Error(`Bidding item on auction error: ${error}`)
        }
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param orderId The orderId of NFT item listed on auciton.
     */
    public async settleAuction(orderId: string) {
        if (!checkParams(orderId)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.settleAuction(this.appContext.getMarketContract(), orderId);
        } catch (error) {
            throw new Error(`Settle auction on order ${orderId} error: ${error}`)
        }
    }

    /**
     * Unlist an item from marketplace, either it's with fixed price or on auction
     * When the item is on auction with bidding price, it would fail to call this function
     * to unlist NFT item.
     *
     * @param orderId The orderId of NFT item listed on marketplace
     * @returns
     */
    public async unlistItem(orderId: string) {
        if (!checkParams(orderId)) {
            throw new Error("Parameters invalid with empty values")
        }

        try {
            await this.contractHelper.unlistItem(this.appContext.getMarketContract(), orderId)
        } catch (error) {
            throw new Error(`Unlist item error: ${error}`)
        }
    }
}
