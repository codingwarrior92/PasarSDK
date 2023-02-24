import { ChainType, getChainIndexByType } from "./chaintype";
import { CollectionInfo } from "./collection/collectioninfo";
import { CollectionPage } from "./collection/collectionpage";
import { ItemInfo } from "./iteminfo";
import { ItemPage } from "./itempage";
import { ERCType } from "./erctype";

const getAllListedItems = async (assistUrl: string, earilerThan:number, pageNum = 1, pageSize = 10): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/listCollectibles?type=listed&after=${earilerThan}&pageNum=${pageNum}&pageSize=${pageSize}`)
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch collection info failed");
        }

        let dataInfo = data['data'];

        let totalCount = dataInfo['total'];
        let nftData = dataInfo['data'];
        let listNftInfo: ItemInfo[] = [];
        for(var i = 0; i < nftData.length; i++) {
            let itemNft =  getItemInfo(nftData[i]);
            listNftInfo.push(itemNft);
        }
        return new ItemPage(totalCount, 0, nftData.length, listNftInfo);
    } catch (error) {
        throw new Error(`Failed to get all listed NFTs on marketplace error: ${error}`);
    }
}

const getCollectionInfo = async (assistUrl: string, collectionAddr:string, chainType: ChainType): Promise<CollectionInfo> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getCollectionInfo?chain=${chainType}&collection=${collectionAddr}`);
        let json = await response.json();
        if (json['status'] != 200) {
            throw new Error("Call API to fetch collection info failed");
        }

        let body = json['data'];
        
        let collectionInfo = parseCollectionInfo(body);
        return collectionInfo;
    }catch (error) {
        throw new Error(`Failed to get Collection Info (erro: ${error}`);
    }
}

const getItemByTokenId = async (assistUrl: string, baseToken:string, tokenId:string): Promise<ItemInfo> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getCollectibleInfo?baseToken=${baseToken}&chain=ela&tokenId=${tokenId}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch specific NFT failed");
        }

        let itemInfo = data['data'];
        let itemNFT = getItemInfo(itemInfo);
        return itemNFT;
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const getOwnedCollections = async (assistUrl: string, walletAddress: string): Promise<CollectionPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getCollectionsByWalletAddr?chain=all&walletAddr=${walletAddress}`)
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch owned Collections failed");
        }
        let collections: CollectionInfo[] = [];
        let body = data['data'];

        for (var i = 0; i < body.length; i++) {
            let info = parseCollectionInfo(body[i]);
            collections.push(info);
        }

        return new CollectionPage(0, 0, body.length, collections);
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const parseCollectionInfo = (itemInfo: any): CollectionInfo => {
    let creator = itemInfo['creator'];
    let data = itemInfo['data'];

    let collectionInfo = new CollectionInfo(
        itemInfo['token'],
        itemInfo['chain'],
        creator && creator['did'] ? creator['did'] : null,
        itemInfo['owner'],
        itemInfo['name'],
        itemInfo['symbol']
    );

    collectionInfo.setSocialLinks(data && data['socials'] ? data['socials'] : null)
        .setDescription(data && data['description'] ? data['description'] : null)
        .setAvatar(data && data['avatar'] ? data['avatar'] : null)
        .setBanner(data && data['background'] ? data['background'] : null)
        .setCategory(data && data['category'] ? data['category'] : null)
        .setErcType(itemInfo['is721'] ? ERCType.ERC721 : ERCType.ERC1155)
        .setUri(itemInfo['uri'])
        .setItems(itemInfo['items'])
        .setOwners(itemInfo['owners'])
        .setLowestPrice(itemInfo['lowestPrice'])
        .setTradingVolume(itemInfo['tradeVolume'])

        return collectionInfo;
}

const getItemInfo = (itemInfo:any):ItemInfo => {
    let tokenData = itemInfo['token'] ? itemInfo['token'] : itemInfo;
    let image = tokenData['image'] ? tokenData['image'] : tokenData['data'] && tokenData['data']['image'] ? tokenData['data']['image'] : null;
    let thumbnail = tokenData['thumbnail'] ? tokenData['thumbnail'] : tokenData['data'] && tokenData['data']['thumbnail'] ? tokenData['data']['thumbnail'] : image;
    let properties = tokenData['properties'] ? tokenData['properties'] : tokenData['attributes'] ? tokenData['attributes'] : null;

    let itemNft = new ItemInfo(
        itemInfo['tokenId'] !== undefined ? itemInfo['tokenId'] : itemInfo['token']['tokenId'],
        itemInfo['tokenIdHex'] !== undefined ? itemInfo['tokenIdHex'] : itemInfo['token']['tokenIdHex'],
        itemInfo['name'] !== undefined ? itemInfo['name'] : itemInfo['token']['name'],
        itemInfo['description'] !== undefined ? itemInfo['description'] : itemInfo['token']['description'],
        thumbnail,
        image,
        itemInfo['adult'] !== undefined? itemInfo['adult'] : itemInfo['token'] && itemInfo['token']['adult'] ? itemInfo['token']['adult'] : false,
        itemInfo['properties'] !== properties,
        itemInfo['version'] !== undefined ? itemInfo['version'] : itemInfo['token']['version'],
        itemInfo['chain'] !== undefined ? itemInfo['chain'] : itemInfo['token']['chain'],
        itemInfo['tokenOwner'] !== undefined ? itemInfo['tokenOwner'] : itemInfo['token']['tokenOwner'],
        itemInfo['royaltyOwner'] !== undefined ? itemInfo['royaltyOwner'] : itemInfo['token']['royaltyOwner'],
        itemInfo['createTime'] !== undefined ? itemInfo['createTime'] : itemInfo['token']['createTime'],
        itemInfo['createTime'] !== undefined ? parseInt(itemInfo['createTime']) : parseInt(itemInfo['order']['createTime']),
        itemInfo['endTime'] !== undefined ? parseInt(itemInfo['endTime']) : parseInt(itemInfo['order']['endTime']),
        itemInfo['orderId'] !== undefined ? itemInfo['orderId'] : itemInfo['order']['orderId'],
        itemInfo['quoteToken'] !== undefined ? itemInfo['quoteToken'] : itemInfo['order']['quoteToken'],
        itemInfo['price'] !== undefined ? itemInfo['price'] : itemInfo['order']['price'],
        itemInfo['buyoutPrice'] !== undefined ? itemInfo['buyoutPrice'] : itemInfo['order'] && itemInfo['order']['buyoutPrice'] !== undefined ? itemInfo['order']['buyoutPrice'] : null,
        itemInfo['reservePrice'] !== undefined ? itemInfo['reservePrice'] : itemInfo['order'] && itemInfo['order']['reservePrice'] !== undefined ? itemInfo['order']['reservePrice'] : null,
        itemInfo['orderState'] !== undefined ? itemInfo['orderState'] : itemInfo['order']['orderState'],
        itemInfo['orderType'] !== undefined ? itemInfo['orderType'] : itemInfo['order']['orderType']
    );

    return itemNft;
}

const packItemPage = (dataArray: any): ItemPage => {
    let items: ItemInfo[] = [];
    for(var i = 0; i < dataArray.length; i++) {
        let itemNft = getItemInfo(dataArray[i]);
        console.log(itemNft);
        items.push(itemNft);
    }

    return new ItemPage(0, 0, dataArray.length, items);
}

const getOwnedItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getOwnedCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get owned NFTs with error: ${error}`);
    }
}

const getCreatedItems = async(assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getMintedCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get created NFTs with error: ${error}`);
    }
}

const getListedItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getListedCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const getBiddingItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getBidsCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    }catch (error) {
        throw new Error(`Failed to get bidding NFTs with error: ${error}`);
    }
}

const getSoldItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getSoldCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch sold NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get sold NFTs with error: ${error}`);
    }
}

export {
    getAllListedItems,
    getCollectionInfo,
    getItemByTokenId,
    getOwnedCollections,
    getCreatedItems,
    getOwnedItems,
    getListedItems,
    getSoldItems,
    getBiddingItems
}
