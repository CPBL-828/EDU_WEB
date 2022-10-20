import Axios from "axios";
import { CONSTANT } from "./constant";

let axios = Axios.create({
  baseURL: CONSTANT.BASE_URL,
  timeout: 1000 * 60 * 2,
  headers: { "Content-Type": "application/json" },
});

export const getApiClient = () => {
  if (!axios) {
    axios = Axios.create({
      baseURL: CONSTANT.BASE_URL,
      timeout: 1000 * 60 * 2,
      headers: { "Content-Type": "application/json" },
    });
  }

  return axios;
};

export const ApiClient = async (url: string, data: string) => {
  console.log(data);
  return await getApiClient()
    .post(url, data)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch(() => {
      console.error();
    });
};
