import { useState } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";

const TransferNFT = () => {
    const [collectionAddr, setCollectionAddr] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [toAddress, setToAddress] = useState("");

    const handleTransfer = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            await myProfile.transferItem(collectionAddr, tokenId, toAddress);
        } catch(err) {
            console.log(err);
        }
    }   

    return (
        <div>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={collectionAddr} onChange={(e) => setCollectionAddr(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">to</h3>
                <input value={toAddress} onChange={(e) => setToAddress(e.target.value)}/>
            </div>
            <button className="button" onClick={handleTransfer}>Transfer</button>
        </div>
    );
}

export default TransferNFT;
