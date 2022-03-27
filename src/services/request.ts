import Axios from "axios";

const BASE_URL = "http://74af-77-231-98-202.ngrok.io/api/v1";

const axios = Axios.create({
  baseURL: BASE_URL,
});

export const apiGetNetworks = () => {
  return axios({ method: "get", url: "/networks" });
};

export const apiGetTokens = (params: any) => {
  return axios({ method: "get", url: "/tokens", params });
};

export const apiSubmitTxn = (data: any) => {
  return axios({ method: "post", url: "/submitTx", data });
};

export const apiRegisterToken = (data: any) => {
  return axios({ method: "post", url: "/registerToken", data });
};

export const getCovalentUrl = ({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) =>
  `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_1c56a51b5de9463fa8f4dbec5ec`;

export const getTrial = async (url: any) => {
  let response: any = await fetch(url);
  response = response.json();
  return response;
};
