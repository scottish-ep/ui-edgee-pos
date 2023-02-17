import Api from "../index";
const qs = require("qs");

const getPromotionCombo = async (dataParams?: any) => {
  let filter: any = {};
  let pagination: any = {};
  if (dataParams?.id) {
    filter = {
      ...filter,
      id: dataParams.id,
    };
  }
  if (dataParams?.resourcesValue) {
    filter = {
      ...filter,
      item_source: {
        value: dataParams.resourcesValue,
      },
    };
  }
  if (dataParams?.name) {
    filter = {
      ...filter,
      name: {
        $contains: dataParams.name,
      },
    };
  }

  if (dataParams?.limit) {
    pagination.pageSize = dataParams.limit;
  }
  if (dataParams?.page) {
    pagination.page = dataParams.page;
  }

  const params = {
    filters: {
      ...filter,
    },
    pagination: {
      ...pagination,
    },
    populate: "*",
  };
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/combos/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getPromotionComboDetail = async (id: any, dataParams?: any) => {
  const params = {
    populate: dataParams.populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/combos/detail/${id}?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updatePromotionCombo = async (comboId: number | string, params?: any) => {
  const url = `/api/v2/combos/update/${comboId}`;
  const { data } = await Api.put(url, params);
  return data;
};

const updatePromotionComboStatus = async (comboId: number | string, params?: any) => {
  const url = `/api/v2/combos/update/${comboId}/status`;
  const { data } = await Api.patch(url, params);
  return data;
};


const deleteManyPromotionCombos = async (arrayId: any[]) => {
  const url = `/api/v2/combos/delete-many`;
  const { data } = await Api.post(url, {
    arrayId: arrayId,
  });
  return data;
};

const addPromotionCombo = async (params?: any) => {
  const url = `/api/v2/combos/create`;
  const { data } = await Api.post(url, params);
  return data;
};

const findSku = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/combos/find-sku?${query}`;
  const { data } = await Api.get(url);
  return data;
};

const PromotionComboApi = {
  getPromotionCombo,
  getPromotionComboDetail,
  updatePromotionCombo,
  updatePromotionComboStatus,
  deleteManyPromotionCombos,
  addPromotionCombo,
  findSku
};

export default PromotionComboApi;
