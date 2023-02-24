import { useState, useEffect } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const BidNFT = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
    const [price, setPrice] = useState("");
    const [quoteToken, setQuoteToken] = useState("");

    const handleBid = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            let userURI = localStorage.getItem("user_uri");

            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);

            if(!userURI) {
                userURI = await myProfile.createUserURI();
                localStorage.setItem("user_uri", userURI);
            }

            await myProfile.bidItemOnAuction(orderId, quoteToken, parseFloat(price), userURI);
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
            <div>
                <h3 >Quote Token</h3>
                <input value={quoteToken} onChange={(e) => setQuoteToken(e.target.value)}/>
            </div>
            <div>
                <h3 className="Price">Price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBid}>Bid</button>
        </div>
    );
}

export default BidNFT;
