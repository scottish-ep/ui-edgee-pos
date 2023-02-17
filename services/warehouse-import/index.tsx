import { param } from "jquery";
import Api from "../index";
const qs = require("qs");

const createImportCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-imports/create`;
  const { data } = await Api.post(url, params);
  return data;
};

const getCommandItem = async (id?: string | number, params?: any) => {
  const query = qs.stringify(param, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/command-item/${id}?${query}`;
  const { data } = await Api.get(url, params);
  return data;
};

const getCommand = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/list?${query}`;
  const { data } = await Api.get(url);
  return data;
};

const updateManyCommand = async (params?: any) => {
  const url = `/api/v2/warehouse-imports/update-many`;
  const { data } = await Api.post(url, params);
  return data;
};

const WarehouseImportCommandApi = {
  createImportCommand,
  getCommandItem,
  updateManyCommand,
  getCommand,
};

export default WarehouseImportCommandApi;
