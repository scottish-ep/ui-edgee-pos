import { param } from "jquery";
import Api from "../index";
const qs = require("qs");

const getListWarehouseTransferCommand = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-transfers/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getTotalNumberTransferCommands = async (params?: any) => {
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-transfers/get-total-by-status?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const deleteManyTransferCommands = async (arrayId?: any) => {
  const url = `/api/v2/warehouse-transfers/delete-many`;
  const data: any = await Api.post(url, {
    arrayId: arrayId,
  });
  return data;
};

const getDetaiTransfersCommands = async (id: number | string) => {
  const url = `/api/v2/warehouse-transfers/edit/${id}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else {
    return {};
  }
};

const getItemSkuInTransferCommands = async (id: number | string) => {
  const url = `/api/v2/warehouse-transfer-items/get-item-transfer-command/${id}`;
  const { data } = await Api.get(url);
  return data;
};

const createTransferCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-transfers/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  return {};
};

const updateTransferCommand = async (params?: any, id?: number | string) => {
  const url = `/api/v2/warehouse-transfers/update/${id}`;
  const { data } = await Api.put(url, params);
  return data;
};

const updateManyTransferCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-transfers/update-many/`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
};

const WarehouseTransferCommandApi = {
  getListWarehouseTransferCommand,
  getTotalNumberTransferCommands,
  deleteManyTransferCommands,
  getDetaiTransfersCommands,
  getItemSkuInTransferCommands,
  createTransferCommand,
  updateTransferCommand,
  updateManyTransferCommand,
};

export default WarehouseTransferCommandApi;
