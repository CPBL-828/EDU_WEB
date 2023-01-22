import Axios from "axios";
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
