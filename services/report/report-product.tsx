import Api from "../index";
const qs = require("qs");

const productOverview = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/product-overview?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getTopProductSale = async (params?: any) => {
  let filter: any = {};
  const query = qs.stringify(params, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/top-product-sale?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const getTotalProductSaleByWarehouse = async (params?: any) => {
  let filter: any = {};
  const query = qs.stringify(params, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/total-product-sale-by-warehouse?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return null;
};

const ReportProductApi = {
  productOverview,
  getTopProductSale,
  getTotalProductSaleByWarehouse,
};

export default ReportProductApi;
