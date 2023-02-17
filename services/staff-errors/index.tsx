import Api from "../index";
const qs = require("qs");

const getStaffError = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staff-errors/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
      // nextPage: 0,
      // previousPage: 0,
      // listPages: []
    };
};

const getStaffErrorDetail = async (id: any, data?: any) => {
  let filters: any = {};
  let populate: any = {};
  if (data?.populate) {
    let populates = data.populate;
  }
  const params = {
    filters,
    populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staff-errors/${id}?${query}`;
  return Api.get(url);
};

const updateStaffError = async (itemId: number, params?: any) => {
  const url = `/api/v2/staff-errors/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteStaffErrors = async (itemId: string) => {
  const url = `/api/v2/staff-errors/${itemId}`;
  return Api.delete(url);
};

const addStaffError = async (errors?: any) => {
  const url = `/api/v2/staff-errors`;
  const { data } = await Api.post(url, {
    errors: errors,
  });

  if (data.success) return data.data;
  else null;
};

const StaffErrorApi = {
  getStaffError,
  getStaffErrorDetail,
  updateStaffError,
  deleteStaffErrors,
  addStaffError,
};

export default StaffErrorApi;
