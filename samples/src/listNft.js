import { useState, useEffect } from "react";
import { MyProfile, ListType, Token, AppContext } from "@crypto-dev/pasar-sdk-development";

const ListNFT = () => {
    const listPricingToken = Token.getToken();
    const [collectionAddr, setCollectionAddr] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [exipirationTime, setExipirationTime] = useState("")
    const [pricingToken, setPricingToken] = useState(listPricingToken[Object.keys(listPricingToken)[0]]);
    const [currentListType, setCurrentListType] = useState(ListType[Object.keys(ListType)[0]]);

    useEffect(() => {
        setExipirationTime(timestampToDatetimeInputString(Date.now()));
    }, []);

    const handleList = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            let userURI = localStorage.getItem("user_uri");

            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);

            if(!userURI) {
                userURI = await myProfile.createUserURI();
                localStorage.setItem("user_uri", userURI);
            }

            if(currentListType == ListType.OnAuction) {
                console.log(exipirationTime);
                let dateTimeParts = exipirationTime.split('T');
                let dateParts = dateTimeParts[0].split("-");
                let timeParts = dateTimeParts[1].split(":");
                let expire = new Date(dateParts[0], dateParts[1]-1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]).getTime();
                await myProfile.listItemOnAuction(collectionAddr, tokenId, pricingToken, parseFloat(price), parseFloat(reservePrice), parseFloat(buyoutPrice), expire, userURI);
            } else {
                await myProfile.listItem(collectionAddr, tokenId, pricingToken, parseFloat(price), userURI);
            }
        } catch(err) {
            console.log(err);
        }
    }

    function timestampToDatetimeInputString(timestamp) {
        const date = new Date((timestamp + _getTimeZoneOffsetInMs()));
        return date.toISOString().slice(0, 19);
      }
    function _getTimeZoneOffsetInMs() {
        return new Date().getTimezoneOffset() * -60 * 1000;
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {Object.keys(ListType).map((key) => {
                    return <option key={ListType[key]} value={ListType[key]}>{ListType[key]}</option>
                })}
            </select>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={collectionAddr} onChange={(e) => setCollectionAddr(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">TokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
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
                    <div>
                        <h3 className="Price">Exipiration Time</h3>
                        <input type="datetime-local" value={exipirationTime} onChange={(e) => setExipirationTime(e.target.value)}/>
                    </div> 
                </div>
            }
            <div>
                <h3 className="sub_title">Pricing Type</h3>
                <select onChange={(e) => setPricingToken(e.target.value)}>
                    {Object.keys(listPricingToken).map((key) => {
                        return <option key={listPricingToken[key]} value={listPricingToken[key]}>{key}</option>
                    })}
                </select>
            </div>
            <button className="button" onClick={handleList}>List</button>
        </div>
    );
}

export default ListNFT;
