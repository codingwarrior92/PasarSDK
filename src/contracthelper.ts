import Web3 from 'web3';
import marketV2ABI from "./contracts/abis/marketV2";
import RegistryABI from "./contracts/abis/registry";
import FeedsCollectionABI from "./contracts/abis/feedsCollection";
import PasarCollectionABI from "./contracts/abis/pasarCollection";
import Token721ABI from './contracts/abis/token721ABI';
import Token20ABI from './contracts/abis/erc20ABI';
import { RoyaltyRate } from './collection/RoyaltyRate';
import { AppContext } from './appcontext';

const gasLimit = 5000000;

const getGasPrice = async(web3: Web3): Promise<string> => {
    return await web3.eth.getGasPrice().then((_gasPrice: any) => {
        return _gasPrice*1 > 20*1e9 ? (20*1e9).toString() : _gasPrice
    })
}

/**
 * This class is to call the contract functions
 */
export class ContractHelper {
    private static zeroAddr = "0x0000000000000000000000000000000000000000";
    private account: string;
    private web3: Web3;

    constructor(account: string, appContext: AppContext) {
        this.account = account;
        this.web3 = appContext.getWeb3();
    }

    async mintFromFeedsCollection(
        collectionAddr: string,
        tokenId: string,
        tokenURI: string,
        royaltyRate: number,
        didURI: string
    ) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(FeedsCollectionABI, collectionAddr).methods.mint(
                tokenId, 1, tokenURI, royaltyRate * 10000, didURI
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error: any) => {
                reject(error)
            });
        })
    }

    async mintFromPasarCollection(
        collectionAddr: string,
        tokenId: string,
        tokenURI: string,
        royaltyRate: number
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(PasarCollectionABI, collectionAddr).methods.mint(
                tokenId, 1, tokenURI, royaltyRate * 10000
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error: any) => {
                reject(error)
            });
        })
    }

    async mintERC721Item (
        collectionAddr: string,
        tokenId: string,
        tokenURI: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, collectionAddr).methods.mint(
                tokenId, tokenURI
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error: any) => {
                reject(error)
            });
        })
    }

    private burnERC1155Item = async (
        collectionABI: any,
        collectionAddr: string,
        tokenId: string
    ) => {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(collectionABI, collectionAddr).methods.burn(tokenId, 1).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    async burnItemInFeeds(
        collectionAddr: string,
        tokenId: string){
        return await this.burnERC1155Item(FeedsCollectionABI, collectionAddr, tokenId);
    }

    async burnItemInPasar(
        collectionAddr: string,
        tokenId: string){
        return await this.burnERC1155Item(PasarCollectionABI, collectionAddr, tokenId);
    }

    async burnERC721Item(
        collectionAddr: string,
        tokenId: string)
    {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, collectionAddr).methods.burn(tokenId).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    async approveItems (
        contractABI: any,
        baseToken: string,
        approvalAddress: any
    ) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(contractABI, baseToken).methods.setApprovalForAll(
                approvalAddress, true
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    private transferERC1155Item = async (
        contractABI: any,
        toAddress: string,
        tokenId: string,
        baseToken: string
    ) => {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(contractABI, baseToken).methods.safeTransferFrom(
                this.account, toAddress, tokenId, 1
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async transferItemInFeeds(
        to: string,
        tokenId: string,
        baseToken: string) {
        return await this.transferERC1155Item(FeedsCollectionABI, to, tokenId, baseToken);
    }

    async transferItemInPasar(
        to: string,
        tokenId: string,
        baseToken: string) {
        return await this.transferERC1155Item(PasarCollectionABI, to, tokenId, baseToken);
    }

    async transfer721Item (
        toAddress: string,
        tokenId: string,
        baseToken: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, baseToken).methods.safeTransferFrom(
                this.account, toAddress, tokenId
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async createOrderForSale (
        marketContract: string,
        tokenId: string,
        baseToken: string,
        price: string,
        quoteToken: string,
        sellerURI: string
     ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            let startTime = (new Date().getTime()/1000).toFixed();
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.createOrderForSale(
                baseToken, tokenId, 1, quoteToken, price, startTime, sellerURI
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async createOrderForAuction (
        marketContract: string,
        baseToken: string,
        tokenId: string,
        quoteToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.createOrderForAuction(
                baseToken,
                tokenId,
                1,
                quoteToken,
                BigInt(minPrice*1e18).toString(),
                BigInt(reservePrice*1e18).toString(),
                BigInt(buyoutPrice*1e18).toString(),
                (new Date().getTime()/1000).toFixed(),
                (expirationTime/1000).toFixed(), sellerURI
            ).send({'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async changePrice (contractMarket: string,
        orderId: number,
        newPrice: string,
        quoteToken: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, contractMarket).methods.changeSaleOrderPrice(
                orderId, newPrice, quoteToken
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async changePriceOnAuction (marketContract: string,
        orderId: number,
        newMinPrice: string,
        newReservedPrice: string,
        newBuyoutPrice: string,
        quoteToken: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.changeAuctionOrderPrice(
                orderId, newMinPrice, newReservedPrice, newBuyoutPrice, quoteToken
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async buyItem (marketContract: string,
        orderId: string,
        price: number,
        quoteToken: string,
        did: string
    ): Promise<void> {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.buyOrder(
                orderId, did
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': quoteToken == ContractHelper.zeroAddr ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async bidItemOnAuction (marketContract: string,
        orderId: string,
        price: number,
        quoteToken: string,
        bidderURI: string
    ): Promise<void> {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.bidForOrder(
                orderId, price.toString(), bidderURI,
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': quoteToken == ContractHelper.zeroAddr ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            })
        })
    }

    async settleAuction (marketContract: string, orderId: string) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.settleAuctionOrder(
                orderId
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            })
        })
    }

    async unlistItem (marketContract: string, orderId: string) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.cancelOrder(
                orderId
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    async createCollection (
        name: string,
        symbol: string,
        abi: any,
        byteCode: any
    ): Promise<string> {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            const tokenConf = {diaDecimals: 18, diaValue: 0.01, nPPM: 1000000, PPM: 1000000}
            let diaAddress = AppContext.getInstance().getDiaAddress();
            let diaValue = BigInt((10 ** tokenConf.diaDecimals * tokenConf.diaValue * tokenConf.nPPM) / tokenConf.PPM).toString();
            let registeredContract = new this.web3.eth.Contract(abi).deploy({
                data: `0x${byteCode}`,
                arguments: [
                    name,
                    symbol,
                    diaAddress,
                    diaValue
                ],
            })
            let transactionParams = {
                'from': this.account,
                'gas': gasLimit,
                'gasPrice': gasPrice,
            }

            if(AppContext.getInstance().isInAppBrowser())
                transactionParams['to'] = ""
            registeredContract.send(transactionParams).then(newContractInstance=>{
                console.log('Contract deployed at address: ', newContractInstance.options.address)
                resolve(newContractInstance.options.address)
            }).catch((error) => {
                reject(error);
            })
        })

    }

    async registerCollection (registryContract: string,
        collectionAddr: string,
        name: string,
        collectionUri: string,
        royalties: RoyaltyRate[]
    ) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            let addresses: string[] = [];
            let values: number[] = [];

            for (var i = 0; i < royalties.length; i++) {
                addresses.push(royalties[i].receiptAddr);
                values.push(royalties[i].value * 10000);
            }

            new this.web3.eth.Contract(RegistryABI, registryContract).methods.registerToken(
                collectionAddr, name, collectionUri, addresses, values,
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    async updateCollectionInfo(registryContract: string,
        collectionAddr: string,
        name: string,
        collectionUri: string
    ) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(RegistryABI, registryContract).methods.updateTokenInfo(
                collectionAddr, name, collectionUri
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    async updateCollectionRoyalties (registryContract: string,
        collectionAddr: string,
        royalties: RoyaltyRate[]
    ) {
        let gasPrice = await getGasPrice(this.web3)
        return new Promise((resolve, reject) => {
            let addresses: string[] = [];
            let values: number[] = [];
            let item: any;

            for (item in royalties) {
                addresses.push(item.receiptAddr);
                values.push(item.value * 10000);
            }

            new this.web3.eth.Contract(RegistryABI, registryContract).methods.changeTokenRoyalty(
                collectionAddr, addresses, values
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error:Error) => {
                reject(error)
            });
        })
    }

    async approveToken (amount: number,
        quoteToken: string,
        marketContract: string
    ){
        let gasPrice = await getGasPrice(this.web3)
        let erc20Contract = new this.web3.eth.Contract(Token20ABI, quoteToken);
        let approvedAmount = BigInt(await erc20Contract.methods.allowance(this.account, marketContract).call())
        if (approvedAmount <= amount) {
            await erc20Contract.methods.approve(marketContract, amount.toString()).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': gasLimit,
                'value': 0
            });
        }
    }
}

