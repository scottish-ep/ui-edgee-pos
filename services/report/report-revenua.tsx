import Api from "../index";
const qs = require("qs");

const getRevenueOverview = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/revenue-overview?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};


const getCustomerByLevel = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/customer-by-level?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getRevenueByPaymentMethod = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/revenue-by-payment-method?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getDebtOverview = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/debt-overtview?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getRevenueByOrderStatus = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/revenue-by-order-status?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getRevenueByChannel = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/revenue-by-channel?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getTransactionByWarehouse = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/transactions-by-warehouse?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const ReportRevenuaApi = {
  getRevenueOverview,
  getRevenueByOrderStatus,
  getRevenueByPaymentMethod,
  getRevenueByChannel,
  getTransactionByWarehouse,
  getCustomerByLevel,
  getDebtOverview,
};

export default ReportRevenuaApi;
