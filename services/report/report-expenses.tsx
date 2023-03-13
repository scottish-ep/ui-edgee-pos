import Api from "../index";
const qs = require("qs");

const expenseOverview = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true,
  });
  const url = `/api/v2/reports/report-expense?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data;
  else return null;
};

const ReportExpenseApi = {
  expenseOverview,
};

export default ReportExpenseApi;
