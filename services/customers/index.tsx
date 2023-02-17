import { notification } from "antd";
import Api from "../index";
const qs = require("qs");

const createAddress = async (params?: any) => {
  const url = `/api/v2/customer-addresses/create`;
  const { data } = await Api.post(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
  }
};

const updateAddress = async (id: number, params?: any) => {
  const url = `/api/v2/customer-addresses/update/${id}`;
  const { data } = await Api.put(url, params);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
  }
};

const deleteAddress = async (id: number) => {
  const url = `/api/v2/customer-addresses/delete/${id}`;
  const { data } = await Api.delete(url);
  if (data.success == true) return data.data;
  else if (data.success == false) {
    notification.error({
      message: data.message,
    });
  }
};

const CustomerApi = {
  createAddress,
  deleteAddress,
  updateAddress,
};

export default CustomerApi;
