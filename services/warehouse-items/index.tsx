import Api from "../index";
const qs = require("qs");

const getItemSku = async (warehouseId?: any) => {
  const url = `/api/v2/warehouse-items/list-item-sku/${warehouseId}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else
    return {
      data: [],
    };
};

const WarehouseItemApi = {
  getItemSku,
};

export default WarehouseItemApi;
