import Api from "../index";
import * as qs from "qs";

const getCustomerRecources = async (data?: any) => {
  let filter: any = {};
  let pagination: any = {};
  if (data?.id) {
    filter = {
      ...filter,
      id: data.id,
    };
  }

  if (data?.limit) {
    pagination.pageSize = data.limit;
  }

  if (data?.page) {
    pagination.page = data.page;
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
  const query = qs.stringify(params, {
    encodeValuesOnly: true, // prettify url
  });
  return Api.get(`/api/customer-sources?${query}`);
};

const CustomerResourceApi = {
  getCustomerRecources,
};

export default CustomerResourceApi;
