import Axios, { AxiosResponse } from "axios";
import { CONSTANT } from "./constant";

let instance = Axios.create({
  baseURL: CONSTANT.BASE_URL,
  timeout: 1000 * 60 * 2,
  headers: { "Content-Type": "application/json" },
});

export const getApiClient = () => {
  if (!instance) {
    instance = Axios.create({
      baseURL: CONSTANT.BASE_URL,
      timeout: 1000 * 60 * 2,
      headers: { "Content-Type": "application/json" },
    });
  }

  return instance;
};

export const ApiClient = async (url: string, data: string) => {
  return await getApiClient()
    .post(url, data)
    .then((res) => {
      return res.data;
    })
    .catch((res) => {
      console.log(res);
    });
};

const forceFileDownload = (res: AxiosResponse, title: string) => {
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", title);
  document.body.appendChild(link);
  link.click();
};

export const downloadWithAxios = async (url: string, title: string) => {
  return await getApiClient()
    .get(url)
    .then((res) => {
      forceFileDownload(res, title);
    })
    .catch((e) => {
      console.error(e);
    });
};
