import Api from "../index";
const qs = require("qs");

const reportOrder = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-order?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportOrderApi = {
  reportOrder,
};

export default ReportOrderApi;
