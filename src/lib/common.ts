import { CONSTANT, KEYS, USER_KEY } from "../constant";
import {
  KYO_MAIN,
  KYO_SUB,
  PAR_MAIN,
  PAR_SUB,
  STU_MAIN,
  STU_SUB,
  TEA_MAIN,
  TEA_SUB,
} from "../dummyCategory";
import { categoryInterface, defaultInterface, studentInterface } from "./types";
import { ref } from "vue";
import { ApiClient } from "../axios";

const makeJson = (data: object | Array<object>): string => {
  return JSON.stringify(data);
};

const parseJson = (json: string): any => {
  return JSON.parse(json);
};

const setItem = (key: string, data: string) => {
  localStorage.setItem(key, data);
};

const getItem = (key: string): any => {
  return parseJson(localStorage.getItem(key) as string);
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

/*
@brief 사용자가 현재 선택한 메인 및 서브 카테고리 추적
 */
const findCategory = () => {
  const data = ref<Array<defaultInterface>>([
    { KEY: "main", VALUE: "" },
    { KEY: "sub", VALUE: "" },
  ]);

  if (!getItem(KEYS.MR)) {
    data.value = [
      { KEY: "main", VALUE: "메인" },
      { KEY: "sub", VALUE: "" },
    ];

    return data.value;
  } else {
    const userKey: string = getItem(KEYS.UK).userKey;
    const mr: string = getItem(KEYS.MR).mr?.split("/")[0]?.toUpperCase();
    const sr: string = getItem(KEYS.SR)
      ? getItem(KEYS.SR).sr?.split("/")[0]?.toUpperCase()
      : undefined;
    if (userKey === USER_KEY.STU) {
      STU_MAIN.map((item: categoryInterface) => {
        if (mr === item.KEY) {
          data.value[0].VALUE = item.VALUE as string;

          if (item.HAS_CHILD) {
            STU_SUB.map((child: defaultInterface) => {
              if (item.KEY === child.KEY) {
                (child.VALUE as defaultInterface[]).map(
                  (v: defaultInterface) => {
                    if (sr === v.KEY) {
                      data.value[1].VALUE = v.VALUE as string;
                    }
                  }
                );
              }
            });
          }
        }
      });
    } else if (userKey === USER_KEY.PAR) {
      PAR_MAIN.map((item: categoryInterface) => {
        if (mr === item.KEY) {
          data.value[0].VALUE = item.VALUE as string;

          if (item.HAS_CHILD) {
            PAR_SUB.map((child: defaultInterface) => {
              if (item.KEY === child.KEY) {
                (child.VALUE as defaultInterface[]).map(
                  (v: defaultInterface) => {
                    if (sr === v.KEY) {
                      data.value[1].VALUE = v.VALUE as string;
                    }
                  }
                );
              }
            });
          }
        }
      });
    } else if (userKey === USER_KEY.TEA) {
      TEA_MAIN.map((item: categoryInterface) => {
        if (mr === item.KEY) {
          data.value[0].VALUE = item.VALUE as string;

          if (item.HAS_CHILD) {
            TEA_SUB.map((child: defaultInterface) => {
              if (item.KEY === child.KEY) {
                (child.VALUE as defaultInterface[]).map(
                  (v: defaultInterface) => {
                    if (sr === v.KEY) {
                      data.value[1].VALUE = v.VALUE as string;
                    }
                  }
                );
              }
            });
          }
        }
      });
    } else if (userKey === USER_KEY.KYO_ADM || userKey === USER_KEY.ETC_ADM) {
      KYO_MAIN.map((item: categoryInterface) => {
        if (mr === item.KEY) {
          data.value[0].VALUE = item.VALUE as string;

          if (item.HAS_CHILD) {
            KYO_SUB.map((child: defaultInterface) => {
              if (item.KEY === child.KEY) {
                (child.VALUE as defaultInterface[]).map(
                  (v: defaultInterface) => {
                    if (sr === v.KEY) {
                      data.value[1].VALUE = v.VALUE as string;
                    }
                  }
                );
              }
            });
          }
        }
      });
    }

    return data.value;
  }
};

const getImg = (f: string) => {
  return CONSTANT.FILE_URL + f;
};

const setChildren = async (p: string) => {
  let data = { userKey: "", search: "", lectureKey: "", parentKey: p };

  const result = await ApiClient("/members/getStudentList/", makeJson(data));

  if (result) {
    if (result.count > 0) {
      return result.resultData[0] as studentInterface;
    }
  }
};

export default {
  makeJson,
  parseJson,
  setItem,
  getItem,
  removeItem,
  findCategory,
  getImg,
  setChildren,
};
