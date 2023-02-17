import Api from "../index";
const qs = require("qs");

const getStaff = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staffs/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getStaffDetail = async (id: any, data?: any) => {
  let filters: any = {};
  let populate: any = {};
  if (data?.populate) {
    populate = data.populate;
  }
  const params = {
    filters,
    populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staffs/detail/${id}?${query}`;
  const res = await Api.get(url);
  if (res.data.success) return res.data;
  return {};
};

const updateStaff = async (itemId: string, params?: any) => {
  const url = `/api/v2/staffs/${itemId}`;
  return Api.put(url, params);
};

const deleteManyStaffs = async (arrayId: any[]) => {
  const url = `/api/v2/staffs/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addStaff = async (params?: any) => {
  const url = `/api/v2/staffs/add`;
  return Api.post(url, {
    ...params,
  });
};

const StaffApi = {
  getStaff,
  getStaffDetail,
  updateStaff,
  deleteManyStaffs,
  addStaff,
};

export default StaffApi;
