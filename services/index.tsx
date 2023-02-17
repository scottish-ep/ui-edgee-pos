import axios from "axios";
import { notification } from "antd";

let baseURL = process.env.NEXT_PUBLIC_API_URL;

const Api = axios.create({
  baseURL: baseURL,
});
// console.log("process.env", process.env);

Api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let userInfo = JSON.parse(localStorage.getItem("user") || "{}");
    if (userInfo.token) {
      const token = `Bearer ${userInfo.token}`;
      // @ts-ignore
      config.headers.common["Authorization"] = token;
    }
  }
  return config;
});

Api.interceptors.response.use(
  (res) => {
    return res;
  },
  function (err) {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("user");
    }
    if (status === 422) {
      const messages = err?.response?.data;
      Object.keys(messages).forEach((el) => {
        notification.error({
          message: messages[el][0],
        });
      });
    }
    return Promise.reject(err);
  }
);

export default Api;
