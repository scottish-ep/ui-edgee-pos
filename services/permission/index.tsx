import Api from "../index";
const qs = require("qs");

const list = async (dataParams?: any) => {
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
  const url = `/api/v2/permission/list?${query}`;

  const { data } = await Api.get(url);
  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
    };
};

const detail = async (id: string | number | undefined) => {
  const url = `/api/v2/permission/detail/${id}`;
  const { data } = await Api.get(url);
  if (data.success == true) return data.data;
  else if (data.success == false) window.alert(data.message);
};

const update = async (id: string | number | undefined, params?: any) => {
  const url = `/api/v2/permission/update/${id}`;
  const { data } = await Api.post(url, params);
  return data;
};

const create = async (params?: any) => {
  const url = `/api/v2/permission/create`;
  const { data } = await Api.post(url, params);
  return data;
};

const deleteId = async (id: string | number | undefined) => {
  const url = `/api/v2/permission/delete/${id}`;
  const { data } = await Api.get(url);
  return data;
};

const PermissionApi = {
  list,
  detail,
  update,
  create,
  deleteId,
};

export default PermissionApi;
