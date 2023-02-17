import { notification } from "antd";
import Api from "../index";
const qs = require("qs");

const getOrders = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/orders/list-order-online?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getOrderOffline = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/orders/list-order-ofline?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getOrderInApp = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/orders/list-order-in-app?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const deleteMany = async (arrayId: any[], user_id: string) => {
  const url = `/api/v2/orders/delete-many`;
  const { data } = await Api.post(url, {
    arrayId: arrayId,
    user_id,
  });
  return data;
};

const getList = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/orders/list?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return [];
};

const updateMany = async (params: any) => {
  const url = `/api/v2/orders/update-many`;
  const { data } = await Api.post(url, params);
  return data;
};

const OrderApi = {
  getList,
  getOrders,
  deleteMany,
  updateMany,
  getOrderInApp,
  getOrderOffline,
};
export default OrderApi;
