import Api from "../index";
const qs = require("qs");

const getAllList = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/transport-company/get-all?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getDetail = async (id: number | string) => {
  const url = `/api/v2/transport-company/${id}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const TransportCompanyApi = {
  getAllList,
  getDetail,
};

export default TransportCompanyApi;
