import Api from "../index";
const qs = require("qs");

const getStaffGroup = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/staff-groups/list?${query}`;
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

const getStaffGroupDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/staff-groups/${id}?${query}`;
  return Api.get(url);
};

const updateStaffGroup = async (itemId: number, params?: any) => {
  const url = `/api/v2/staff-groups/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteStaffErrors = async (itemId: string) => {
  const url = `/api/v2/staff-groups/${itemId}`;
  return Api.delete(url);
};

const addStaffGroup = async (groups?: any) => {
  const url = `/api/v2/staff-groups`;
  const { data } = await Api.post(url, {
    groups: groups,
  });

  if (data.success) return data.data;
  else null;
};

const StaffGroupApi = {
  getStaffGroup,
  getStaffGroupDetail,
  updateStaffGroup,
  deleteStaffErrors,
  addStaffGroup,
};

export default StaffGroupApi;
