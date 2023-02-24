
import React, {useEffect, useState} from 'react'
import {Profile, Market, AppContext } from '@crypto-dev/pasar-sdk-development';
import {
  useNavigate
} from "react-router-dom";

import {signin, signout, checkSign} from "./connect/connectors";

function SigninEE() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(checkSign());
  let appContext = AppContext.getInstance();
  let profile =  new Profile(appContext, "", "0x35ba08cd8E620d86d255893c3c65628513dABF65");
  let market = new Market(appContext);
  let now = (Date.now() / 1000).toFixed();

  const handleGetListedItem = async () => {
    now = (Date.now() / 1000).toFixed();
    console.log(now);
    let result = await market.queryItems(0, 1, 10);
    console.log(result);
  }

  const handleGetOwnedCollection = async () => {
    let result = await profile.queryOwnedCollections();
    console.log(result);
  }

  const handleGetOwnedListedNft = async () => {
    let result = await profile.queryListedItems();
    console.log(result);
  }

  const handleGetOwnedNft = async () => {
    let result = await profile.queryOwnedItems();
    console.log(result);
  }

  const handleGetCreatedNft = async () => {
    let result = await profile.queryCreatedItems();
    console.log(result);
  }

  const handleGetBiddingNft = async () => {
    let result = await profile.queryBiddingItems();
    console.log(result);
  }

  const handleGetSoldNft = async () => {
    let result = await profile.querySoldItems();
    console.log(result);
  }

  const handleSigninEE1 = async () => {
    let result = await signin();
    console.log(result);
    localStorage.setItem("user", JSON.stringify(result));
    setLogin(checkSign());
    AppContext.createInstance(true);
  }

  const handleSignout = async () => {
    await signout();
    localStorage.removeItem("user");
    setLogin(checkSign());
  }

  const handleClickButton = (path) => {
    navigate(path);
  }

  return (
    !login ?
    <div>
        <button onClick={handleSigninEE1}>Sign in with EE</button>
        {/* <button onClick={handleSigninMM}>Sign in with MM</button> */}
        <button onClick={handleGetListedItem}>Get Listed Nfts</button>
        <button onClick={handleGetOwnedCollection}>Get Owned Collection</button>
        <button onClick={handleGetOwnedListedNft}>Get Owned Listed Nft</button>
        <button onClick={handleGetOwnedNft}>Get Owned Nft</button>
        <button onClick={handleGetCreatedNft}>Get Created Nft</button>
        <button onClick={handleGetBiddingNft}>Get Bidding Nft</button>
        <button onClick={handleGetSoldNft}>Get Sold Nft</button>
    </div> :
    <div>
        <button onClick={handleSignout}>Sign out</button>

        <div>
          <button onClick={()=> handleClickButton('/mint')}>Add New NFT</button>
          <button onClick={()=> handleClickButton('/burn')}>Burn NFT</button>
          <button onClick={()=> handleClickButton('/transfer')}>Transfer NFT</button>
          <button onClick={()=> handleClickButton('/list')}>List NFT</button>
          <button onClick={()=> handleClickButton('/changeprice')}>Change Price</button>
          <button onClick={()=> handleClickButton('/buy')}>Buy NFT</button>
          <button onClick={()=> handleClickButton('/bid')}>Bid NFT</button>
          <button onClick={()=> handleClickButton('/settle')}>Settle Auction</button>
          <button onClick={()=> handleClickButton('/unlist')}>Unlist NFT</button>
          <button onClick={()=> handleClickButton('/createcollection')}>Create Collection</button>
          <button onClick={()=> handleClickButton('/updatecollectioninfo')}>Update Collection Info</button>
          
        </div>
        
    </div>

    
  );
}

export default SigninEE;
