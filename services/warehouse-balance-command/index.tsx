import { notification } from "antd";
import { param } from "jquery";
import Api from "../index";
const qs = require("qs");

const getListWarehouseBalanceCommand = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-balances/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getTotalNumberBalanceCommands = async (params?: any) => {
  const url = `/api/v2/warehouse-balances/get-total-by-status`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const deleteManyBalanceCommands = async (arrayId?: any) => {
  const url = `/api/v2/warehouse-balances/delete-many`;
  const data: any = await Api.post(url, {
    arrayId: arrayId,
  });
  return data;
};

const getDetaiBalanceCommands = async (id: number | string) => {
  const url = `/api/v2/warehouse-balances/edit/${id}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else {
    notification.error({
      message: "Không tìm thấy phiếu cân bằng kho!",
    });
    return;
  }
};

const getItemSkuInBalanceCommands = async (id: number | string) => {
  const url = `/api/v2/warehouse-balance-items/get-item-balance-command/${id}`;
  const { data } = await Api.get(url);
  return data;
};

const createBalanceCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-balances/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
    return;
  }
};

const updateBalanceCommand = async (params?: any, id?: number | string) => {
  const url = `/api/v2/warehouse-balances/update/${id}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
    return;
  }
};

const updateManyBalanceCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-balances/update-many/`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
    return;
  }
};

const WarehouseBalanceCommandApi = {
  getListWarehouseBalanceCommand,
  getTotalNumberBalanceCommands,
  deleteManyBalanceCommands,
  getDetaiBalanceCommands,
  getItemSkuInBalanceCommands,
  createBalanceCommand,
  updateBalanceCommand,
  updateManyBalanceCommand,
};

export default WarehouseBalanceCommandApi;
