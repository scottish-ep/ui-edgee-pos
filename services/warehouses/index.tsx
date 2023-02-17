import Api from "../index";
const qs = require("qs");

const getWarehouse = async (dataParams?: any) => {
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
  const url = `/api/v2/warehouses/list?${query}`;
  const { data } = await Api.get(url);

  if (data.success) return data.data;
  else
    return {
      data: [],
      totalPage: 0,
      // nextPage: 0,
      // previousPage: 0,
      // listPages: []
    };
};

const getWarehouseDetail = async (id: any, data?: any) => {
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
  const url = `/api/v2/warehouses/${id}?${query}`;
  return Api.get(url);
};

const warehouseDetail = async (itemId: number) => {
  const url = `/api/v2/warehouses/detail/${itemId}`;
  return Api.get(url);
};

const updateWarehouse = async (itemId: number, params?: any) => {
  const url = `/api/v2/warehouses/${itemId}`;
  return Api.put(url, {
    data: params,
  });
};

const deleteManyWarehouses = async (arrayId: any[]) => {
  const url = `/api/v2/warehouses/delete-many`;
  return Api.post(url, {
    arrayId: arrayId,
  });
};

const addWarehouse = async (params?: any) => {
  const url = `/api/v2/warehouses`;
  return Api.post(url, {
    data: params,
  });
};


const WarehouseApi = {
  getWarehouse,
  getWarehouseDetail,
  updateWarehouse,
  deleteManyWarehouses,
  addWarehouse,
  warehouseDetail
};

export default WarehouseApi;
