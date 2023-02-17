import Api from "../index";
const qs = require("qs");

const getStaffErrorRelation = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staff-error-relations?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getStaffErrorRelationDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/staff-error-relations/${id}?${query}`;
  const res = await Api.get(url);
  if (res.data.success) return res.data;
  return {};
};

const updateStaffErrorRelation = async (itemId: string, params?: any) => {
  const url = `/api/v2/staff-error-relations/${itemId}`;
  return Api.put(url, params);
};

const deleteStaffErrorRelations = async (itemId: any) => {
  const url = `/api/v2/staff-error-relations/${itemId}`;
  return Api.delete(url);
};

const createStaffErrorRelations = async (params?: any) => {
  const url = `/api/v2/staff-error-relations`;
  const { data } = await Api.post(url, params);
  if (data.success) return data.data;
  else null;
};

const StaffErrorRelationApi = {
  getStaffErrorRelation,
  getStaffErrorRelationDetail,
  updateStaffErrorRelation,
  deleteStaffErrorRelations,
  createStaffErrorRelations,
};

export default StaffErrorRelationApi;
