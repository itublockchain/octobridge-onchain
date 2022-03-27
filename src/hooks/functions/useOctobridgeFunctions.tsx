import { useAccounts } from "hooks/useAccounts";
import { useOctobridgeContract } from "hooks/useOctobridgeContract";
import { useRequest } from "hooks/useRequest";

export const useOctobridgeFunctions = () => {
  const CONTRACT = useOctobridgeContract();
  const { auth, signer } = useAccounts();

  const lock = async ({
    _originChain,
    _destination,
    _dstChainId,
    _tokenAddress,
    _amount,
    _dstRelayer,
  }: {
    _originChain: any;
    _destination: any;
    _dstChainId: any;
    _tokenAddress: any;
    _amount: any;
    _dstRelayer: any;
  }) => {
    if (!auth) {
      return;
    }

    const txn = await CONTRACT?.connect(signer).lock(
      _originChain,
      _destination,
      _dstChainId,
      _tokenAddress,
      _amount,
      _dstRelayer
    );

    console.log(txn);

    const res = await txn.wait();
    return res;
  };

  return { lock };
};
