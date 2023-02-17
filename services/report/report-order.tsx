import Api from "../index";
const qs = require("qs");

const orderOverview = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/order-overview?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const totalOrderByWarehouse = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/total-order-by-warehouse?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getOrderByChannel = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/order-by-channel?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const ReportOrderApi = {
  orderOverview,
  totalOrderByWarehouse,
  getOrderByChannel,
};

export default ReportOrderApi;
