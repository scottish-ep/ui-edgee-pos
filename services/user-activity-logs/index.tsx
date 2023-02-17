import Api from "../index";
const qs = require("qs");

const getList = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/system-logs/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const deleteLogs = async (id?: any) => {
  const url = `/api/v2/system-logs/${id}`;
  const { data } = await Api.delete(url);

  if (data.success) return data.data;
  else return [];
};

const UserActivityLogApi = {
  getList,
  deleteLogs,
};

export default UserActivityLogApi;
