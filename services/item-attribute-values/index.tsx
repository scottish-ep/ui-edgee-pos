import Api from "../index";
const qs = require("qs");

const getItemAttributeValue = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-attribute-values/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getItemAttributeValueDetail = async (id: any, data?: any) => {
  let filters: any = {};
  let populate: any = {};
  if (data?.populate) {
    let populates = data.populate;
    if (populates.item_source) {
      populate = {
        ...populate,
        item_source: true,
      };
    }
    if (populates.bhv_users) {
      populate = {
        ...populate,
        users: true,
      };
    }
  }
  const params = {
    filters,
    populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-attribute-values/${id}?${query}`;
  return Api.get(url);
};

const updateItemAttributeValue = async (itemId: number, params?: any) => {
  const url = `/api/v2/item-attribute-values/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteManyItemAttributeValues = async (arrayId: any[]) => {
  const url = `/api/v2/item-attribute-values/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addItemAttributeValue = async (params?: any) => {
  const url = `/api/v2/item-attribute-values/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const ItemAttributeValueApi = {
  getItemAttributeValue,
  getItemAttributeValueDetail,
  updateItemAttributeValue,
  deleteManyItemAttributeValues,
  addItemAttributeValue,
};

export default ItemAttributeValueApi;
