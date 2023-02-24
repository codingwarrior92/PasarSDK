import { AppContext } from "./appcontext";
import { ChainType } from "./chaintype";

enum TokenELA {
  ELA = '0x0000000000000000000000000000000000000000',
  DIA = '0x2C8010Ae4121212F836032973919E8AeC9AEaEE5',
  WELA = '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4',
  GLIDE = '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27',
  ELK = '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
  BUNNY = '0x75740FC7058DA148752ef8a9AdFb73966DEb42a8',
  ethUSDC = '0xA06be0F5950781cE28D965E5EFc6996e88a8C141',
  bnbBUSD = '0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57'
}

enum TokenETH {
  ETH = '0x0000000000000000000000000000000000000000',
  ELAOnETH = '0xe6fd75ff38Adca4B97FBCD938c86b98772431867'
}

export class Token {
  static getToken() {
    let chainType = AppContext.getInstance().getChainType();
    switch(chainType) {
      case ChainType.ESC:
        return TokenELA;
      case ChainType.ETH:
        return TokenETH;
      default:
        return TokenELA;
    }
  }
}
