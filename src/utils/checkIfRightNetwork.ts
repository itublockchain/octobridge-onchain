declare let window: Window & any;

const mainDetails = {
  id: "0xa869",
  name: "Avalanche Fuji C Chain",
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" },
};

export const checkIfRightNetwork = async (network = mainDetails) => {
  if (!window.ethereum) return;
  const networkId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (networkId != network.id) {
    return {
      status: false,
      fn: async () => {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network.id }],
          });
          return true;
        } catch (error: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          const WALLET_ERROR_CODE = 4902;

          if (error.code === WALLET_ERROR_CODE) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: network.id,
                    rpcUrls: network.rpcUrls,
                    nativeCurrency: network.nativeCurrency,
                    chainName: network.name,
                  },
                ],
              });
            } catch (addError) {
              console.log("[DEBUG] Network Add error", addError);
              return;
            }
          }
          // handle other "switch" errors
          console.log("[DEBUG] Switch Network Error");
          return;
        }
      },
    };
  } else {
    return { status: true, fn: async () => undefined };
  }
};
