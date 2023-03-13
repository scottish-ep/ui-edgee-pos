import Api from "../index";
const qs = require("qs");

const getConfig = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/report-configs`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const updateConfig = async (params: any) => {
  const url = `/api/v2/report-configs/update-config`;
  const { data } = await Api.post(url, params);
  return data;
};

const ReportConfigApi = {
  getConfig,
  updateConfig,
};

export default ReportConfigApi;
