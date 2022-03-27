import { OCTOBRIDGE20 } from "contract/abi/octobridge20";
import { ADDRESSES } from "contract/adresses";
import { ethers } from "ethers";
import { batch, useDispatch } from "react-redux";
import { setOCTOBRIDGE20Contract } from "store/slicers/contracts";

export const useContracts = () => {
  const dispatch = useDispatch();

  const setContracts = async (provider: any) => {
    const OCTOBRIDGE_CONTRACT = new ethers.Contract(
      ADDRESSES.OCTOBRIDGE20,
      OCTOBRIDGE20,
      provider
    );

    //REGISTER CONTRACTS
    batch(() => {
      dispatch(setOCTOBRIDGE20Contract(OCTOBRIDGE_CONTRACT));
    });
  };

  return { setContracts };
};
