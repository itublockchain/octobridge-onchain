import { BigNumber } from "ethers";

export const isZero = (number: BigNumber) => {
  if (!number) {
    return false;
  }
  try {
    if (number.toNumber() === 0) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
