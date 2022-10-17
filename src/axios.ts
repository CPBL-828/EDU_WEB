import Axios from "axios";

let axios = Axios.create({
  baseURL: "http://172.30.1.28:8000",
  timeout: 1000 * 60 * 3,
  headers: { "Content-Type": "application/json" },
});

export const getApiClient = () => {
  if (!axios) {
    axios = Axios.create({
      baseURL: "http://172.30.1.28:8000",
      timeout: 1000 * 60 * 3,
      headers: { "Content-Type": "application/json" },
    });
  }

  return axios;
};

export const ApiClient = async (url: string, data: object | string) => {
  console.log(data);
  return await getApiClient()
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      console.error();
    });
};
