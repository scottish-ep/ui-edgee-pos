import Api from "../index";
const qs = require("qs");

const getItemCategory = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v1/item-categories?${query}`;
  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else return [];
};

const getItemCategoryDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/item-categories/${id}?${query}`;
  return Api.get(url);
};

const updateItemCategory = async (itemId: number, params?: any) => {
  const url = `/api/v2/item-categories/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteManyItemCategorys = async (arrayId: any[]) => {
  const url = `/api/v2/item-categories/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addItemCategory = async (params?: any) => {
  const url = `/api/v2/item-categories`;
  return Api.post(url, {
    data: params,
  });
};

const ItemCategoryApi = {
  getItemCategory,
  getItemCategoryDetail,
  updateItemCategory,
  deleteManyItemCategorys,
  addItemCategory,
};

export default ItemCategoryApi;
