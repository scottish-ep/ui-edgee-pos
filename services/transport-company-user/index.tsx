import Api from "../index";
const qs = require("qs");

const getListUser = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/transport-company-users/users?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return [];
};

const TransportCompanyUserApi = {
  getListUser,
};

export default TransportCompanyUserApi;
