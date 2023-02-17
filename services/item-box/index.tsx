import Api from "../index";
const qs = require("qs");

const getListItemBox = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/item-box/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const addItemBox = async (params?: any) => {
  const url = `/api/v2/item-box/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateItemBox = async (params?: any) => {
  const url = `/api/v2/item-box/update`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const toggleIsAllowWholesale = async (itemId: any) => {
  const url = `/api/v2/item-box/toggle-enable-item-box/${itemId}`;
  const { data } = await Api.post(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteMany = async (ids: any) => {
  const url = `/api/v2/item-box/delete-many`;
  const { data } = await Api.post(url, ids);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getItemBoxDetail = async (id: string | number | undefined) => {
  const url = `/api/v2/item-box/detail/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const ItemBoxApi = {
  getListItemBox,
  addItemBox,
  toggleIsAllowWholesale,
  deleteMany,
  getItemBoxDetail,
  updateItemBox
};

export default ItemBoxApi;
