import { param } from "jquery";
import Api from "../index";
const qs = require("qs");

const getLivestreamList = async (dataParams?: any) => {
  let filter: any = {};
  const query = qs.stringify(dataParams, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/livestreams/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const getLivestreamDetail = async (id: any, dataParams?: any) => {
  const params = {
    populate: dataParams.populate,
  };
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/livestreams/detail/${id}?${query}`;
  const { data } = await Api.get(url);

  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const updateLivestream = async (
  livestreamId: number | string,
  params?: any
) => {
  const url = `/api/v2/livestreams/update/${livestreamId}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const startLivestream = async (livestreamId: number | string, params?: any) => {
  const url = `/api/v2/livestreams/update/${livestreamId}/status`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const createLivestream = async (params?: any) => {
  const url = `/api/v2/livestreams/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const addParticipation = async (
  livestreamId: number | string,
  params?: any
) => {
  const url = `/api/v2/livestreams/particaipant/${livestreamId}`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const generateTokenForStreamer = async (params?: any) => {
  const url = `/api/v2/livestreams/generate-token-for-streamer`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const generateTokenForViewer = async (params?: any) => {
  const url = `/api/v2/livestreams/generate-token-for-viewer`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const getListComment = async (params?: any) => {
  let filter: any = {};
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  const url = `/api/v2/livestream-comments/list?${query}`;
  const { data } = await Api.get(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const deleteItem = async (id: any) => {
  const url = `/api/v2/livestreams/delete/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const LivestreamApi = {
  getLivestreamList,
  getLivestreamDetail,
  updateLivestream,
  createLivestream,
  startLivestream,
  generateTokenForStreamer,
  generateTokenForViewer,
  getListComment,
  addParticipation,
  deleteItem,
};

export default LivestreamApi;
