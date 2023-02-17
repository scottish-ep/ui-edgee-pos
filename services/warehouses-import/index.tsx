import Api from "../index";
const qs = require("qs");

const updateItemToCommand = async (id, dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/update-item/${id}`;

  const { data }: any = await Api.put(url, dataParams);
  if (data.success) {
    return data;
  }
  return data;
};

const addItemToCommand = async (id, dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/add-item/${id}`;

  const { data }: any = await Api.post(url, dataParams);
  if (data.success) {
    return data;
  }
  return data;
};

const deleteItemToCommand = async (id, dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/remove-items/${id}`;

  const { data }: any = await Api.post(url, dataParams);
  if (data.success) {
    return data;
  }
  return data;
};

const updateCommand = async (id, dataParams?: any) => {
  let filter: any = {};
  console.log("dataParams", dataParams);
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/warehouse-imports/update/${id}`;

  const { data }: any = await Api.put(url, dataParams);
  if (data.success) {
    return data;
  }
  return data;
};

const WarehousesImportApi = {
  updateItemToCommand,
  addItemToCommand,
  deleteItemToCommand,
  updateCommand,
};

export default WarehousesImportApi;
