import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/revenue-expenditure/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const add = async (params?: any, config?: any) => {
  const url = `/api/v2/revenue-expenditure/add`;
  const { data } = await Api.post(url, params, config);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const update = async (id :any, params?: any) => {
  const url = `/api/v2/revenue-expenditure/update/${id}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateStatus = async (params?: any) => {
  const url = `/api/v2/revenue-expenditure/update-status`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteMany = async (ids: any) => {
  const url = `/api/v2/revenue-expenditure/delete-many`;
  const { data } = await Api.post(url, {ids: ids});
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const RevenueExpenditureApi = {
  list,
  deleteMany,
  update,
  add,
  updateStatus
};

export default RevenueExpenditureApi;
