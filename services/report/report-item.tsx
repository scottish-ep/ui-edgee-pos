import Api from "../index";
const qs = require("qs");

const reportItem = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-item?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportItemApi = {
  reportItem,
};

export default ReportItemApi;
