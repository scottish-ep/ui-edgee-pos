import Api from "../index";
const qs = require("qs");

const getInventoryWarehouse = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-items/inventory?${query}`;

  const { data } = await Api.get(url);
  if (data.success) {
    return data.data;
  }
  return {
    data: [],
    totalPage: 0,
  };
};

const WarehousesInventoryApi = {
  getInventoryWarehouse,
};

export default WarehousesInventoryApi;
