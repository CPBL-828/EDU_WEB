const makeJson = (data: object): string => {
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

export default {
  makeJson,
  parseJson,
  setItem,
  getItem,
  removeItem,
};
