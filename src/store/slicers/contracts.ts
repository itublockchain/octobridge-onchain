import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contract } from "ethers";

type ContractState = {
  OCTOBRIDGE20: Contract | null;
};

const initialState: ContractState = {
  OCTOBRIDGE20: null,
};

export const contractSlicer = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setOCTOBRIDGE20Contract: (state, action: PayloadAction<any>) => {
      state.OCTOBRIDGE20 = action.payload;
    },
  },
});

export const { setOCTOBRIDGE20Contract } = contractSlicer.actions;
export default contractSlicer.reducer;
