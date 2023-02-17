import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/order-check-command/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const add = async (params?: any, config?: any) => {
  const url = `/api/v2/order-check-command/create`;
  const { data } = await Api.post(url, params, config);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const update = async (params?: any) => {
  const url = `/api/v2/order-check-command/update`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

// const toggleIsAllowWholesale = async (itemId: any) => {
//   const url = `/api/v2/item-box/toggle-enable-item-box/${itemId}`;
//   const { data } = await Api.post(url);
//   if (data.success == true) return data.data;
//   else if (data.success == false) window.alert(data.message);
// };

const deleteMany = async (ids: any) => {
  const url = `/api/v2/order-check-command/delete-many`;
  const { data } = await Api.post(url, ids);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateCommandItemsStatus = async (params: any) => {
  const url = `/api/v2/order-check-command/update-command-items-status`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const detail = async (id: string | number | undefined ) => {
  const url = `/api/v2/order-check-command/detail/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getOrderCheckCommandItems = async (id: string | number | undefined, params?: any) => {
  let filter: any = {};
  const query = qs.stringify(params, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/order-check-command/get-command-items/${id}?${query}`;
  const { data } = await Api.get(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const OrderCheckCommandApi = {
  add,
  list,
  deleteMany,
  detail,
  update,
  getOrderCheckCommandItems,
  updateCommandItemsStatus
};

export default OrderCheckCommandApi;
