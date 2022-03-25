import { useAccounts } from "hooks/useAccounts";
import { useEffect } from "react";

export const useWalletEvents = () => {
  const { connector } = useAccounts();

  useEffect(() => {
    if (!connector) return;

    connector.on("accountsChanged", (accounts: string[]) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    connector.on("chainChanged", (chainId: number) => {
      window.location.reload();
    });
  }, [connector]);
};
