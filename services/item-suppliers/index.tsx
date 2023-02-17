import Api from "../index";
const qs = require("qs");

const getItemSupplier = async (dataParams?: any) => {
  // if (dataParams?.limit) {
  //   pagination.pageSize = dataParams.limit;
  // }
  // if (dataParams?.page) {
  //   pagination.page = dataParams.page;
  // }

  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-suppliers/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const getItemSupplierDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/item-suppliers/${id}?${query}`;
  return Api.get(url);
};

const updateItemSupplier = async (itemId: number, params?: any) => {
  const url = `/api/v2/item-suppliers/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteManyItemSuppliers = async (arrayId: any[]) => {
  const url = `/api/v2/item-suppliers/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addItemSupplier = async (params?: any) => {
  const url = `/api/v2/item-suppliers`;
  return Api.post(url, {
    data: params,
  });
};

const ItemSupplierApi = {
  getItemSupplier,
  getItemSupplierDetail,
  updateItemSupplier,
  deleteManyItemSuppliers,
  addItemSupplier,
};

export default ItemSupplierApi;
