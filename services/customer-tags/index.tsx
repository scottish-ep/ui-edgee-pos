import Api from "../index";
const qs = require("qs");

const list = async (params?: any) => {
  const url = `/api/v2/customer-tags/list`;
  const { data } = await Api.get(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const CustomerTagApi = {
  list,
};

export default CustomerTagApi;
