import { useState, useEffect } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";

const UnlistNFT = () => {
    const [orderId, setOrderId] = useState("");

    const handleUnlist = async () => {
        try {        
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            await myProfile.unlistItem(orderId);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">OrderId</h3>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleUnlist}>Unlist NFT</button>
        </div>
    );
}

export default UnlistNFT;
