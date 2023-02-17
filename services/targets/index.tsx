import Api from "../index";
const qs = require("qs");

const addTarget = async (params?: any) => {
  const url = `/api/v2/targets/create`;
  const { data } = await Api.post(url, params);
  if (data.success) return data.data;
  else null;
};

const updateTarget = async (id: number | string, params?: any) => {
  const url = `/api/v2/targets/update/${id}`;
  const { data } = await Api.put(url, params);
  if (data.success) return data.data;
  else null;
};

const getList = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/targets/list?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else null;
};

const getTargetListByStaff = async (params: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/target-groups/list-for-staff-detail?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else null;
};

const getDetail = async (id: number | string) => {
  const url = `/api/v2/targets/detail/${id}`;
  const { data } = await Api.get(url);
  if (data.success) {
    return data.data;
  } else {
    return null;
  }
};

const TargetApi = {
  addTarget,
  updateTarget,
  getList,
  getDetail,
  getTargetListByStaff,
};

export default TargetApi;
