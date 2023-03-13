import Api from "../index";
const qs = require("qs");

const reportDebt = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-debt?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportDebtApi = {
  reportDebt,
};

export default ReportDebtApi;
