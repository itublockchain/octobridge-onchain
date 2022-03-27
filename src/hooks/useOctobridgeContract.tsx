import { useTypedSelector } from "store";

export const useOctobridgeContract = () => {
  const contract = useTypedSelector((state) => state.contract.OCTOBRIDGE20);

  return contract;
};
