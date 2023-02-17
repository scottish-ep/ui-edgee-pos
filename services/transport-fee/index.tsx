import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/transport-fees?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const update = async (dataParams?: any) => {
  const url = `/api/v2/transport-fees`;
  const { data } = await Api.post(url, dataParams);
  if (data.success) return data.data;
  else return null;
};

const TransportFeeApi = {
  list,
  update,
};

export default TransportFeeApi;
