import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/debt/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getAllCustomer = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/debt/get-all-customer?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const addOrUpdateDebt = async (params?: any, config?: any) => {
  const url = `/api/v2/debt/add-or-update`;
  const { data } = await Api.post(url, params, config);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const addDebtItem = async (params?: any, config?: any) => {
  const url = `/api/v2/debt/add-debt-item`;
  const { data } = await Api.post(url, params, config);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};


const update = async (params?: any) => {
  const url = `/api/v2/debt/update`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateDebt = async (debtId :any, params?: any) => {
  const url = `/api/v2/debt/update-debt/${debtId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteDebtItem = async (debtItemId:any, params?: any) => {
  const url = `/api/v2/debt/delete-debt-item/${debtItemId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateStatusDebtItem = async (debtItemId:any, params?: any) => {
  const url = `/api/v2/debt/update-status-debt-item/${debtItemId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteMany = async (ids: any) => {
  const url = `/api/v2/debt/delete-many`;
  const { data } = await Api.post(url, ids);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const detail = async (id: string | number | undefined ) => {
  const url = `/api/v2/debt/detail/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const findDebt = async (id: string | number | undefined ) => {
  const url = `/api/v2/debt/find-debt/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getUsers = async () => {
  const url = `/api/v2/debt/get-users`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getDebtItems = async (debtId: any) => {
  const url = `/api/v2/debt/get-debt-items/${debtId}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const DebtApi = {
  addOrUpdateDebt,
  list,
  deleteMany,
  detail,
  update,
  getAllCustomer,
  findDebt,
  getUsers,
  getDebtItems,
  addDebtItem,
  updateDebt,
  deleteDebtItem,
  updateStatusDebtItem
};

export default DebtApi;
