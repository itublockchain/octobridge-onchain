import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Octobridge dApp", // Required Required unless you provide a JSON RPC url; see `rpc` below
      rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    },
  },
};
