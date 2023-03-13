import Api from "../index";
const qs = require("qs");

const reportTransport = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-transport?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportTransportApi = {
  reportTransport,
};

export default ReportTransportApi;
