import Api from "../index";
const qs = require("qs");

const getStaffSaleOrder = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/reports/staff-sale-order?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const ReportStaffApi = {
  getStaffSaleOrder,
};

export default ReportStaffApi;
