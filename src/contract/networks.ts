import Avax from "assets/images/avax.png";
import Rinkeby from "assets/images/rinkeby.png";

export const NETWORKS = {
  4: {
    name: "Rinkeby",
    layerZero: {
      id: 10001,
      endpoint: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
    },
    networkId: 4,
    rpc: "https://rinkeby.infura.io/v3/5f6507414db54d61b6cfe765b8b231c1",
  },
  43113: {
    name: "Fuji",
    layerZero: {
      id: 10006,
      endpoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
    },
    networkId: 43113,
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  80001: {
    name: "Mumbai",
    layerZero: {
      id: 10009,
      endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
    },
    networkId: 80001,
    rpc: "https://rpc-mumbai.matic.today",
  },
};


export const NETWORK_IMAGE_MAP = {
  Fuji: Avax,
  Rinkeby: Rinkeby,
  "Avalanche Fuji Testnet": Avax,
  Mumbai: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=022",
};
