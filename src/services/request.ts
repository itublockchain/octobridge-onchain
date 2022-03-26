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
