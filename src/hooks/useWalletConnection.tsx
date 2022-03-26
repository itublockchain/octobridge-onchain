import { ethers } from "ethers";
import { batch, useDispatch } from "react-redux";
import Web3Modal from "web3modal";
import { providerOptions } from "utils/providerOptions";
import { setAuth, setWeb3, setWeb3Account } from "store/slicers/global";
import { useEffect } from "react";
import { useContracts } from "hooks/useConracts";

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions,
  theme: "dark",
  disableInjectedProvider: false,
});

export const useWalletConnection = ({
  autologin = true,
}: {
  autologin?: boolean;
}) => {
  const dispatch = useDispatch();

  const { setContracts } = useContracts();

  const connectWallet = async () => {
    try {
      const connector = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connector);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      dispatch(
        setWeb3({
          connector,
          provider,
          chainId: network.chainId,
          signer,
          address,
        })
      );
      setContracts(provider);
      if (accounts) {
        batch(() => {
          dispatch(setAuth(true));
          dispatch(setWeb3Account(accounts[0]));
        });
      }
    } catch (error) {}
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    window.location.reload();
  };

  useEffect(() => {
    if (autologin && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  return { connectWallet, disconnect };
};
