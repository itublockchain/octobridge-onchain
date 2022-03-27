import Avax from "assets/images/avax.png";
import Rinkeby from "assets/images/rinkeby.png";

export const NETWORKS = [
  {
    chainId: 43113,
    chainName: "Avalanche",
    nativeCurrency: {
      name: "Avax",
      symbol: "AVAX",
      decimals: 18,
    },
    logo: Avax,
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
    rpcUrls: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  {
    chainId: 73771,
    chainName: "Swimmer",
    nativeCurrency: {
      name: "Tus",
      symbol: "Tus.e",
      decimals: 18,
    },
    blockExplorerUrls: ["https://testnet-explorer.swimmer.network/"],
    rpcUrls:
      "https://testnet-rpc.swimmer.network/ext/bc/2Sk6j8TYVQc2oR1TtUz64EWHAYjDUoDQ4hpbu6FMN2JBKC77xa/rpc",
  },
  {
    chainId: 73772,
    chainName: "Ferhadır",
    nativeCurrency: {
      name: "Ferha",
      symbol: "FER",
      decimals: 18,
    },
    blockExplorerUrls: ["https://testnet-explorer.swimmer.network/"],
    rpcUrls:
      "https://testnet-rpc.swimmer.network/ext/bc/2Sk6j8TYVQc2oR1TtUz64EWHAYjDUoDQ4hpbu6FMN2JBKC77xa/rpc",
  },
];

export const NETWORK_IMAGE_MAP = {
  Fuji: Avax,
  Rinkeby: Rinkeby,
  "Avalanche Fuji Testnet": Avax,
  Mumbai: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=022",
};
