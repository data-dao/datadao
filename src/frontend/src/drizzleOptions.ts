import Web3 from "web3";

import TestContract from "./contracts/TestContract.json";
import MasterDataTokenFactory from "./contracts/MasterDataTokenFactory.json";
import MasterDataToken from "./contracts/MasterDataToken.json";

const options = {
  web3: {
    // block: false,
    // customProvider: new Web3("wss://rinkeby.infura.io/ws/v3/e4588d11d73d47749c72f5f542832808"),
    networkWhitelist: [
      // 1, // Mainnet
      // 3, // Ropsten
      4, // Rinkeby
      // 5, // Goerli
      // 42 // Kovan
    ]
  },
  contracts: [
    MasterDataTokenFactory,
    MasterDataToken,
    TestContract
  ],
  events: {
    "MasterDataTokenFactory": ["MasterDataTokenCreated"],
  }
};

export default options;
