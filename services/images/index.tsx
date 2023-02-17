import Api from "../index";
const qs = require("qs");


const upload = async (file?: any) => {
  let formData = new FormData();
  formData.append('file', file);
  const url = `/api/v2/images/upload`;
  const { data } = await Api.post(url, formData);
  if (data.success == true) return data.data
  return null
};

const ImageApi = {
  upload
};

export default ImageApi;
