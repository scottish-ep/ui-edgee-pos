import Api from "../index";
const qs = require("qs");

const revenueOverviewOnline = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-revenue-online?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const revenueOverviewOffline = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-revenue-offline?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportRevenuaApi = {
  revenueOverviewOffline,
  revenueOverviewOnline,
};

export default ReportRevenuaApi;
