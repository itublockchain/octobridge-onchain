import { ethers } from "ethers";
import { useAccounts } from "hooks/useAccounts";
import { useContracts } from "hooks/useConracts";
import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { setAuth, setWeb3, setWeb3Account } from "store/slicers/global";

export const useWalletEvents = () => {
  const { connector } = useAccounts();
  const dispatch = useDispatch();
  const { setContracts } = useContracts();

  useEffect(() => {
    if (!connector) return;

    connector.on("accountsChanged", (accounts: string[]) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    connector.on("chainChanged", (chainId: number) => {
      //window.location.reload();
      const updateProvider = async () => {
        const provider = new ethers.providers.Web3Provider(connector);
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
      };
      updateProvider();
    });
  }, [connector]);
};
