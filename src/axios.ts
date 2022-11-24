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
  return await getApiClient()
    .post(url, data)
    .then((res) => {
      console.log(
        "성공했으니 작업하세요\n" +
          "두다다다다다다다\n" +
          "두다다다다다다다\n" +
          "　(∩`・ω・)\n" +
          "＿/_ミつ/￣￣￣/\n" +
          "　　 ＼/＿＿＿/\n"
      );
      return res.data;
    })
    .catch(() => {
      console.error();
      console.log(
        "또안돼또또안된다고\n" +
          "쾅쾅　　　　　쾅쾅\n" +
          "쾅쾅（∩8ㅁ8）쾅쾅\n" +
          "　＿/_ﾐつ/￣￣￣/\n" +
          "   　 ＼/＿＿＿/\n"
      );
    });
};
