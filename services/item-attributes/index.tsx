import Api from "../index";
const qs = require("qs");

const getItemAttribute = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-attributes/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getItemAttributeDetailByItem = async (item_id: number) => {
  const url = `/api/v2/item-attributes/detail-by-item/${item_id}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return null;
};

const getItemAttributeDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/item-attributes/${id}?${query}`;
  return Api.get(url);
};

const updateItemAttribute = async (itemId: number, params?: any) => {
  const url = `/api/v2/item-attributes/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteManyItemAttributes = async (arrayId: any[]) => {
  const url = `/api/v2/item-attributes/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addItemAttribute = async (params?: any) => {
  const url = `/api/v2/item-attributes/create`;
  const { data } = await Api.post(url, params);
  if (data.success) return data.data;
  return null;
};

const ItemAttributeApi = {
  getItemAttribute,
  getItemAttributeDetailByItem,
  getItemAttributeDetail,
  updateItemAttribute,
  deleteManyItemAttributes,
  addItemAttribute,
};

export default ItemAttributeApi;
