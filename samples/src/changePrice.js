import { useState, useEffect } from "react";
import { MyProfile, ListType, Token, AppContext } from "@crypto-dev/pasar-sdk-development";

const ChangePrice = () => {
    const listPricingToken = Token.getToken();

    const [orderId, setOrderId] = useState("");
    const [price, setPrice] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [pricingToken, setPricingToken] = useState(listPricingToken[Object.keys(listPricingToken)[0]]);
    const [currentListType, setCurrentListType] = useState(ListType[Object.keys(ListType)[0]]);

    const handleChangePrice = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);

            if(currentListType == ListType.OnAuction) {
                await myProfile.changePriceOnAuction(orderId, pricingToken, parseFloat(price), parseFloat(reservePrice), parseFloat(buyoutPrice));
            } else {
                await myProfile.changePrice(orderId, pricingToken, parseFloat(price));
            }
        } catch(err) {
            console.log(err);  
        }
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {Object.keys(ListType).map((key) => {
                    return <option key={ListType[key]} value={ListType[key]}>{ListType[key]}</option>
                })}
            </select>
            <div>
                <h3 className="sub_title">OrderId</h3>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)}/>
            </div>
            {currentListType == ListType.FixedPrice ? <div>
                <h3 className="Price">price</h3>
                    <input value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div> : <div>
                <div>
                    <h3 className="Price">Min Price</h3>
                        <input value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </div> 
                    <div>
                        <h3 className="Price">Reserve Price</h3>
                        <input value={reservePrice} onChange={(e) => setReservePrice(e.target.value)}/>
                    </div> 
                    <div>
                        <h3 className="Price">Buyout Price</h3>
                        <input value={buyoutPrice} onChange={(e) => setBuyoutPrice(e.target.value)}/>
                    </div>
                </div>
            }
            <div>
                <h3 className="sub_title">Pricing Token Type</h3>
                <select onChange={(e) => setPricingToken(e.target.value)}>
                    {Object.keys(listPricingToken).map((key) => {
                        return <option key={listPricingToken[key]} value={listPricingToken[key]}>{key}</option>
                    })}
                </select>
            </div>
            <button className="button" onClick={handleChangePrice}>List</button>
        </div>
    );
}

export default ChangePrice;
