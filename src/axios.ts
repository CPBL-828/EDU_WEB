import Axios from "axios";
import { CONSTANT } from "./constant";

let instance = Axios.create({
  baseURL: CONSTANT.BASE_URL,
  timeout: 1000 * 60 * 2,
  headers: { "Content-Type": "application/json" },
});

export const getApiClient = (t: string) => {
  if (!instance) {
    instance = Axios.create({
      baseURL: CONSTANT.BASE_URL,
      timeout: 1000 * 60 * 2,
      headers: { "Content-Type": "application/json" },
    });
  } else if (t === "file") {
    instance = Axios.create({
      baseURL: CONSTANT.BASE_URL,
      timeout: 1000 * 60 * 2,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return instance;
};

export const ApiClient = async (url: string, data: string) => {
  return await getApiClient("json")
    .post(url, data)
    .then((res) => {
      return res.data;
    })
    .catch((res) => {
      // console.log(res);
    });
};

export const FileClient = async (url: string, data: FormData) => {
  return await getApiClient("file")
    .post(url, data)
    .then((res) => {
      return res.data;
    })
    .catch((res) => {
      // console.log(res);
    });
};
