export const requestChain = async (chainId: any) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId?.toString(16)}` }],
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
              chainId: `0x${chainId?.toString(16)}`,
            },
          ],
        });
      } catch (addError) {
        console.log("[DEBUG] Network Add error", addError);
        return;
      }
    }
  }
};
