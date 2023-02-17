import { notification } from "antd";
import Api from "../index";
const qs = require("qs");

const getItem = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/items/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) {
    return data.data;
  }
  return {
    data: [],
    totalPage: 0,
  };
};

const getListWholesale = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/whole-sales/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getItemDetail = async (id: any, dataParams?: any) => {
  const params = {
    populate: dataParams.populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/items/detail/${id}?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const getItemSkusToPrint = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/items/list-item-skus-code?${query}`;
  const { data } = await Api.get(url);

  return data;
};

const getProductMetrics = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/items/metrics?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const updateItem = async (itemId: number, params?: any) => {
  const url = `/api/v2/items/update/${itemId}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const deleteManyItems = async (arrayId: any[], user_id: any = null) => {
  const url = `/api/v2/items/delete-many`;
  const { data } = await Api.post(url, {
    arrayId: arrayId,
    user_id: user_id,
  });
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const addItem = async (params?: any) => {
  const url = `/api/v2/items/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const addWholesale = async (itemId: any, params?: any) => {
  const url = `/api/v2/whole-sales/create/${itemId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const toggleIsAllowWholesale = async (itemId: any, params?: any) => {
  const url = `/api/v2/whole-sales/toggle-wholesale/${itemId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.success({
      message: data.message,
    });
  }
};

const updateShowItem = async (itemId: number, params?: any) => {
  const url = `/api/v2/items/update-show-item/${itemId}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) {
    notification.success({
      message: data.data.message,
    });
  } else if (data.success == false) {
    notification.error({
      message: data.message,
    });
  }
};

const ItemApi = {
  getItem,
  getItemDetail,
  getProductMetrics,
  updateItem,
  deleteManyItems,
  addItem,
  getListWholesale,
  addWholesale,
  toggleIsAllowWholesale,
  updateShowItem,
  getItemSkusToPrint,
};

export default ItemApi;
