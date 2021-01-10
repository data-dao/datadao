import { IArcOptions } from "@daostack/arc.js"; // comment in Arc1
import { RetryLink } from "apollo-link-retry";

export const GRAPH_POLL_INTERVAL = 30000;
// import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// const Torus = require("@toruslabs/torus-embed");
// const Portis = require("@portis/web3");
// const Fortmatic = require("fortmatic");

export const BASE_URL = process.env.REACT_APP_BASE_URL
export const NETWORK = process.env.REACT_APP_NETWORK!.replace("main", "mainnet")
export const INFURA_ID = process.env.REACT_APP_INFURA_ID || 'e4588d11d73d47749c72f5f542832808'
export const HTTP_PROVIDER = `https://rinkeby.infura.io/v3/${INFURA_ID}`
export const NOTIFY_API_KEY = process.env.REACT_APP_NOTIFY_API_KEY || 'f6dc5add-50af-4526-9252-17d77e82acae'

function getWeb3ConnectProviderOptions(network: string) {
  if (typeof(window) === "undefined") {
    return null;
  }

  switch (network) {
    case "rinkeby":
      return {
        network: "rinkeby",
        // torus: {
        //   package: Torus,
        //   options: { network: "rinkeby" },
        // },
        // walletconnect: {
        //   package: isMobileBrowser() ? null : WalletConnectProvider,
        //   options: {
        //     infuraId: process.env.INFURA_ID,
        //   },
        // },
        // burnerconnect: {
        //   package: BurnerConnectProvider,
        //   options: {
        //     defaultNetwork: "4",
        //     defaultWallets: [
        //       { origin: "https://denver-demo.burnerfactory.com/", name: "Denver Demo Wallet" },
        //     ],
        //   },
        // },
        // portis: {
        //   package: Portis,
        //   options: {
        //     id: "aae9cff5-6e61-4b68-82dc-31a5a46c4a86",
        //   },
        // },
        // fortmatic: {
        //   package: Fortmatic,
        //   options: {
        //     key: "pk_test_659B5B486EF199E4",
        //   },
        // },
        // squarelink: {
        //   options: {
        //     id: null as any,
        //   },
        // },
      };
    case "kovan":
      return {
        network: "kovan",
        // torus: {
        //   package: Torus,
        //   options: { network: "kovan" },
        // },
        // walletconnect: {
        //   package: isMobileBrowser() ? null : WalletConnectProvider,
        //   options: {
        //     infuraId: process.env.INFURA_ID,
        //   },
        // },
        // burnerconnect: {
        //   package: BurnerConnectProvider,
        //   options: {
        //     defaultNetwork: "42",
        //     defaultWallets: [
        //       { origin: "https://denver-demo.burnerfactory.com/", name: "Denver Demo Wallet" },
        //     ],
        //   },
        // },
        // portis: {
        //   package: Portis,
        //   options: {
        //     id: "aae9cff5-6e61-4b68-82dc-31a5a46c4a86",
        //   },
        // },
        // fortmatic: {
        //   package: Fortmatic,
        //   options: {
        //     key: "pk_test_659B5B486EF199E4",
        //   },
        // },
        // squarelink: {
        //   options: {
        //     id: null as any,
        //   },
        // },
    };
    case "xdai":
      return {
        network: "xdai",
        // torus: {
        //   package: Torus,
        //   options: {
        //     networkParams: {
        //       host: "https://xdai.poanetwork.dev",
        //       chainId: 100,
        //       networkName: "xdai",
        //       network: "xdai",
        //     },
        //   },
        // },
    };
    case "mainnet":
      return {
        network: "mainnet",
        // torus: {
        //   package: Torus,
        //   options: { network: "mainnet" },
        // },
        // walletconnect: {
        //   package: isMobileBrowser() ? null : WalletConnectProvider,
        //   options: {
        //     infuraId: process.env.INFURA_ID,
        //   },
        // },
        // burnerconnect: {
        //   package: BurnerConnectProvider,
        //   options: {
        //     defaultNetwork: "1",
        //     defaultWallets: [
        //       { origin: "https://buffidao.com/", name: "BuffiDAO" },
        //     ],
        //   },
        // },
        // portis: {
        //   package: Portis,
        //   options: {
        //     id: "aae9cff5-6e61-4b68-82dc-31a5a46c4a86",
        //   },
        // },
        // fortmatic: {
        //   package: Fortmatic,
        //   options: {
        //     key: "pk_live_38A2BD2B1D4E9912",
        //   },
        // },
        // squarelink: {
        //   options: {
        //     id: null as any,
        //   },
        // },
    }
    default: {
        return {
            network: "private",

        }
    }
    
  }
}

// comment in Arc1
export type Settings = IArcOptions & {
    txSenderServiceUrl: string;
    web3ConnectProviderOptions: any;
    retryLink?: RetryLink;
}

export type NetworkSettings = {
    [network: string]: Settings; // comment in Arc1
    // [network: string]: any;
}

const daostackSubgraphEndpoints = {
    "http_main": "https://api.thegraph.com/subgraphs/name/daostack/v8_13_exp",
    "ws_main": "wss://api.thegraph.com/subgraphs/name/daostack/v8_13_exp",
    "http_rinkeby": "https://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_rinkeby",
    "ws_rinkeby": "wss://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_rinkeby",
    "http_kovan": "https://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_kovan",
    "ws_kovan": "wss://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_kovan",
    "http_xdai": "https://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_xdai",
    "ws_xdai": "wss://api.thegraph.com/subgraphs/name/daostack/v8_13_exp_xdai",
    "http_ganache": "http://127.0.0.1:8000/subgraphs/name/daostack",
    "ws_ganache": "ws://127.0.0.1:8001/subgraphs/name/daostack"
}

export const settings: NetworkSettings = {
  ganache: {
    graphqlHttpProvider: daostackSubgraphEndpoints['http_ganache'],
    graphqlWsProvider: daostackSubgraphEndpoints['ws_ganache'],
    graphqlSubscribeToQueries: false,
    web3Provider: "http://127.0.0.1:8545",
    // web3Provider: "ws://127.0.0.1:8545",
    // web3ProviderRead: "ws://127.0.0.1:8545",
    ipfsProvider: "http://127.0.0.1:5001/api/v0",
    txSenderServiceUrl: "https://tx-sender-service.herokuapp.com/send-tx",
    web3ConnectProviderOptions: {},
  },
  rinkeby: {
    graphqlHttpProvider: process.env.ARC_GRAPHQLHTTPPROVIDER || daostackSubgraphEndpoints['http_rinkeby'],
    graphqlWsProvider:  process.env.ARC_GRAPHQLWSPROVIDER || daostackSubgraphEndpoints['ws_rinkeby'],
    graphqlSubscribeToQueries: false,
    web3Provider:  process.env.ARC_WEB3PROVIDER || `https://rinkeby.infura.io/ws/v3/${INFURA_ID}`,
    // web3Provider:  process.env.ARC_WEB3PROVIDER || `wss://rinkeby.infura.io/ws/v3/${INFURA_ID}`,
    // web3ProviderRead:  process.env.ARC_WEB3PROVIDERREAD || `wss://rinkeby.infura.io/ws/v3/${INFURA_ID}`,
    ipfsProvider: process.env.ARC_IPFSPROVIDER || "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    txSenderServiceUrl: "https://tx-sender-service.herokuapp.com/send-tx",
    web3ConnectProviderOptions: getWeb3ConnectProviderOptions("rinkeby"),
  },
  kovan: {
    graphqlHttpProvider: process.env.ARC_GRAPHQLHTTPPROVIDER || daostackSubgraphEndpoints['http_kovan'],
    graphqlWsProvider:  process.env.ARC_GRAPHQLWSPROVIDER || daostackSubgraphEndpoints['ws_kovan'],
    graphqlSubscribeToQueries: false,
    web3Provider:  process.env.ARC_WEB3PROVIDER || `https://kovan.infura.io/ws/v3/${INFURA_ID}`,
    // web3Provider:  process.env.ARC_WEB3PROVIDER || `wss://kovan.infura.io/ws/v3/${INFURA_ID}`,
    // web3ProviderRead:  process.env.ARC_WEB3PROVIDERREAD || `wss://kovan.infura.io/ws/v3/${INFURA_ID}`,
    ipfsProvider: process.env.ARC_IPFSPROVIDER || "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    txSenderServiceUrl: "https://tx-sender-service.herokuapp.com/send-tx",
    web3ConnectProviderOptions: getWeb3ConnectProviderOptions("kovan"),
  },
  xdai: {
    graphqlHttpProvider: process.env.ARC_GRAPHQLHTTPPROVIDER || daostackSubgraphEndpoints['http_xdai'],
    graphqlWsProvider:  process.env.ARC_GRAPHQLWSPROVIDER || daostackSubgraphEndpoints['ws_xdai'],
    graphqlSubscribeToQueries: false,
    web3Provider: process.env.ARC_WEB3PROVIDER || "https://xdai.poanetwork.dev",
    // web3Provider: process.env.ARC_WEB3PROVIDER || "wss://xdai.poanetwork.dev/wss",
    // web3ProviderRead: process.env.ARC_WEB3PROVIDERREAD || "wss://xdai.poanetwork.dev/wss",
    ipfsProvider: process.env.ARC_IPFSPROVIDER || "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    txSenderServiceUrl: "",
    web3ConnectProviderOptions: getWeb3ConnectProviderOptions("xdai"),
  },
  main: {
    graphqlHttpProvider: process.env.ARC_GRAPHQLHTTPPROVIDER || daostackSubgraphEndpoints['http_main'],
    graphqlWsProvider: process.env.ARC_GRAPHQLWSPROVIDER || daostackSubgraphEndpoints['ws_main'],
    graphqlSubscribeToQueries: false,
    web3Provider: process.env.ARC_WEB3PROVIDER || `https://mainnet.infura.io/ws/v3/${INFURA_ID}`,
    // web3Provider: process.env.ARC_WEB3PROVIDER || `wss://mainnet.infura.io/ws/v3/${INFURA_ID}`,
    // web3ProviderRead: process.env.ARC_WEB3PROVIDERREAD || `wss://mainnet.infura.io/ws/v3/${INFURA_ID}`,
    ipfsProvider: process.env.ARC_IPFSPROVIDER || "https://api.thegraph.com:443/ipfs-daostack/api/v0",
    // txSenderServiceUrl: "https://tx-sender-service-mainnet.herokuapp.com/send-tx",
    txSenderServiceUrl: "",
    web3ConnectProviderOptions: getWeb3ConnectProviderOptions("mainnet"),
  },
};