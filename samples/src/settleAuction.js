import { useState, useEffect } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";

const SettleAuction = () => {
    const [orderId, setOrderId] = useState("");

    const handleSettle = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            await myProfile.settleAuction(orderId);
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
            <button className="button" onClick={handleSettle}>Settle</button>
        </div>
    );
}

export default SettleAuction;
