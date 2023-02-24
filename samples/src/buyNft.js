import { useState, useEffect } from "react";
import { MyProfile, AppContext } from "@crypto-dev/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const BuyNFT = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
    const [quoteToken, setQuoteToken] = useState("");
    const [price, setPrice] = useState("");

    const handleBuy = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            let userURI = localStorage.getItem("user_uri");

            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);

            if(!userURI) {
                userURI = await myProfile.createUserURI();
                localStorage.setItem("user_uri", userURI);
            }
            await myProfile.buyItem(orderId, parseFloat(price), quoteToken, userURI);
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
                <h3 className="sub_title">QuoteToken</h3>
                <input value={quoteToken} onChange={(e) => setQuoteToken(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBuy}>Buy</button>
        </div>
    );
}

export default BuyNFT;
