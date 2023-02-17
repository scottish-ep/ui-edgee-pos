import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/review-managements?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else return [];
};

const updateReview = async (reviewId: number, params?: any) => {
  const url = `/api/v2/review-managements/${reviewId}`;
  const { data } = await Api.put(url, params);
  if (data.success) return data.data;
  else return null;
};

const deleteReview = async (reviewId: number, params?: any) => {
  const url = `/api/v2/review-managements/delete/${reviewId}`;
  const { data } = await Api.delete(url);
  if (data.success) return data.data;
  else return null;
};

const ReviewManagementApi = {
  list,
  updateReview,
  deleteReview,
};

export default ReviewManagementApi;
