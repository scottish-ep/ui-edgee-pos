import Api from "../index";
const qs = require("qs");

const getUser = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/users/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getUserDetail = async (id: any, data?: any) => {
  let filters: any = {};
  let populate: any = {};
  if (data?.populate) {
    let populates = data.populate;
    if (populates.item_source) {
      populate = {
        ...populate,
        item_source: true,
      };
    }
    if (populates.bhv_users) {
      populate = {
        ...populate,
        users: true,
      };
    }
  }
  const params = {
    filters,
    populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/users/${id}?${query}`;
  return Api.get(url);
};

const updateUser = async (itemId: number, params?: any) => {
  const url = `/api/v2/users/update/${itemId}`;
  const { data } = await Api.post(url, params);
  return data;
};

const deleteId = async (itemId: number) => {
  const url = `/api/v2/users/delete/${itemId}`;
  const { data } = await Api.get(url);
  return data;
};

const deleteManyUsers = async (arrayId: any[]) => {
  const url = `/api/v2/users/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addUser = async (params?: any) => {
  const url = `/api/v2/users/create`;
  const { data } = await Api.post(url, params);
  return data;
};

const getListStaff = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/users/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getListSource = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = "/api/v2/customer-sources/list";
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return [];
};

const UserApi = {
  getUser,
  getUserDetail,
  updateUser,
  deleteManyUsers,
  addUser,
  getListStaff,
  getListSource,
  deleteId,
};

export default UserApi;
