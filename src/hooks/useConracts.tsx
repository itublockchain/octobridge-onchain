import { ERC_20 } from "contract/abi/erc20";
import { ADDRESSES } from "contract/adresses";
import { ethers } from "ethers";
import { batch, useDispatch } from "react-redux";
import { setUSDCContract } from "store/slicers/contracts";

export const useContracts = () => {
  const dispatch = useDispatch();

  const setContracts = async (provider: any) => {
    const USDC_CONTRACT = new ethers.Contract(ADDRESSES.USDC, ERC_20, provider);

    //REGISTER CONTRACTS
    batch(() => {
      dispatch(setUSDCContract(USDC_CONTRACT));
    });
  };

  return { setContracts };
};
