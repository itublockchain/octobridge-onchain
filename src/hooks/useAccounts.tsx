import { useTypedSelector } from "store";

export const useAccounts = () => {
  const { auth, web3 } = useTypedSelector((state) => state.global);

  return {
    auth,
    account: web3?.account,
    provider: web3?.provider,
    signer: web3?.signer,
    chainId: web3?.chainId,
    connector: web3?.connector,
    address: web3?.address,
  };
};
