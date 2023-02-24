import { useState } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";

const BurnNFT = () => {
    const [tokenId, setTokenId] = useState("");

    const handleBurn = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            await myProfile.deleteItemFromFeeds(tokenId);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBurn}>Burn</button>
        </div>
    );
}

export default BurnNFT;
