import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeTypes } from "types/theme";

type Web3 = {
  signer: any;
  provider: any;
  account: any;
  chainId: number;
  connector: any;
  address: any;
};

type GlobalState = {
  auth: boolean;
  theme: ThemeTypes;
  web3: Web3 | null;
  isRightNetwork: boolean;
};

const initialState: GlobalState = {
  auth: false,
  theme:
    (localStorage.getItem("theme") as ThemeTypes) === "dark"
      ? ThemeTypes.dark
      : ThemeTypes.light,
  web3: {
    signer: null,
    provider: null,
    account: null,
    chainId: 0,
    connector: null,
    address: null,
  },
  isRightNetwork: true,
};

export const globalSlicer = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.auth = action.payload;
    },
    setTheme: (state, action: PayloadAction<ThemeTypes>) => {
      state.theme = action.payload;
    },
    setWeb3: (state, action: PayloadAction<any>) => {
      state.web3 = action.payload;
    },
    setIsRightNetwork: (state, action: PayloadAction<boolean>) => {
      state.isRightNetwork = action.payload;
    },
    setWeb3Account: (state, action: PayloadAction<any>) => {
      if (state.web3) {
        state.web3.account = action.payload;
      }
    },
  },
});

export const { setAuth, setTheme, setWeb3, setIsRightNetwork, setWeb3Account } =
  globalSlicer.actions;
export default globalSlicer.reducer;
