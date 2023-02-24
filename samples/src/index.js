import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import App from './App';
import MintNFT from './mintNFT';
import BurnNFT from './burnNFT';
import TransferNFT from './transfer';
import ListNFT from './listNft';
import ChangePrice from './changePrice';
import BuyNFT from './buyNft';
import BidNFT from './bidNft';
import SettleAuction from './settleAuction';
import UnlistNFT from './unlistNft';
import CreateCollection from './createCollection';
import UpdateCollectionInfo from './updateCollectionUri';

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const RouterCom = ()=>{
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/mint" element={<MintNFT />} />
      <Route path="/burn" element={<BurnNFT />} />
      <Route path="/transfer" element={<TransferNFT />} />
      <Route path="/list" element={<ListNFT />} />
      <Route path="/changeprice" element={<ChangePrice />} />
      <Route path="/buy" element={<BuyNFT />} />
      <Route path="/bid" element={<BidNFT />} />
      <Route path="/settle" element={<SettleAuction />} />
      <Route path="/unlist" element={<UnlistNFT />} />
      <Route path="/createcollection" element={<CreateCollection />} />
      <Route path="/updatecollectioninfo" element={<UpdateCollectionInfo />} />
    </Routes>
  </BrowserRouter>
}
ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <RouterCom />
  </Web3ReactProvider>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
