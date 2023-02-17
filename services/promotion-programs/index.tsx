import Api from "../index";
const qs = require("qs");

const getPromotionProgram = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/promotion-programs/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getPromotionProgramDetail = async (id: any, dataParams?: any) => {
  const params = {
    populate: dataParams.populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/promotion-programs/detail/${id}?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getProductMetrics = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/promotion-programs/metrics?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updatePromotionProgram = async (programId: number | string, params?: any) => {
  const url = `/api/v2/promotion-programs/update/${programId}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteManyPromotionPrograms = async (arrayId: any[]) => {
  const url = `/api/v2/promotion-programs/delete-many`;
  const { data } = await Api.post(url, {
    arrayId: arrayId,
  });
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const addPromotionProgram = async (params?: any) => {
  const url = `/api/v2/promotion-programs/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const PromotionProgramApi = {
  getPromotionProgram,
  getPromotionProgramDetail,
  getProductMetrics,
  updatePromotionProgram,
  deleteManyPromotionPrograms,
  addPromotionProgram,
};

export default PromotionProgramApi;
