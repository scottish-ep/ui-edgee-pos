import Api from "../index";
const qs = require("qs");

const getItemSku = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-skus/list-skus?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getListWholesale = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/whole-sales/list-whole?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getItemSkuDetail = async (id: any, dataParams?: any) => {
  const params = {
    populate: dataParams.populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-skus/detail/${id}?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateItemSku = async (id: number, params?: any) => {
  const url = `/api/v2/item-skus/update/${id}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateManyItemSku = async (itemId: number, params?: any) => {
  const url = `/api/v2/item-skus/update-many/${itemId}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteManyItemSkus = async (arrayId: any[]) => {
  const url = `/api/v2/item-skus/delete-many`;
  const { data } = await Api.post(url, {
    arrayId: arrayId,
  });
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const addItemSku = async (params?: any) => {
  const url = `/api/v2/item-skus/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getList = async (params?: any) => {
  let filter: any = {};
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-skus/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const ItemSkuApi = {
  getItemSku,
  getItemSkuDetail,
  getListWholesale,
  updateItemSku,
  updateManyItemSku,
  deleteManyItemSkus,
  addItemSku,
  getList,
};

export default ItemSkuApi;
