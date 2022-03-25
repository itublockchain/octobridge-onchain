import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contract } from "ethers";

type ContractState = {
  USDC: Contract | null;
};

const initialState: ContractState = {
  USDC: null,
};

export const contractSlicer = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setUSDCContract: (state, action: PayloadAction<any>) => {
      state.USDC = action.payload;
    },
  },
});

export const { setUSDCContract } = contractSlicer.actions;
export default contractSlicer.reducer;
