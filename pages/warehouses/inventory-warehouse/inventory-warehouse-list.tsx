import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { warehouses, productList } from "../../../const/constant";
import { StatusColorEnum, StatusList } from "../../../types";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import { IInventoryWareHouses } from "../warehouse.type";
import { isArray, onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import PaginationCustom from "../../../components/PaginationCustom";
import { get } from "lodash";
import WarehouseApi from "../../../services/warehouses";
import WarehousesInventoryApi from "../../../services/warehouses-inventory";
import ItemCategoryApi from "../../../services/item-categories";
import { useDebounce } from "usehooks-ts";
import { CSVLink } from "react-csv";

const InventoryWareHouseList = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [inventoryWareHouses, setInventoryWareHouses] = useState<
    IInventoryWareHouses[]
  >([]);
  const [inventoryItemExport, setInventoryItemExport] = useState<any[]>([]);
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
    }[]
  >([]);
  const [itemcategories, setItemcategories] = useState<
    {
      label: string;
      value: string | number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<any>({});
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [selectdWarehouse, setSelectWarehouse] = useState();

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getListWarehouse();
    getListItemCategory();
  }, []);

  useEffect(() => {
    selectdWarehouse && getInventoryWarehouse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedSearchTerm, pagination.page, pagination.pageSize]);

  const getInventoryWarehouse = async () => {
    setLoading(true);
    const { data, totalOrders } =
      await WarehousesInventoryApi.getInventoryWarehouse({
        ...filter,
        name: debouncedSearchTerm,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
    setPagination({
      ...pagination,
      total: totalOrders || 0,
    });
    let rawInventory = data.map((item: any) => {
      return {
        ...item,
        item_code: get(item, "item.code"),
        category: get(item, "item.item_category.name"),
      };
    });
    setInventoryItemExport(rawInventory);
    setInventoryWareHouses(data);
    setLoading(false);
  };

  const getListWarehouse = async () => {
    const data = await WarehouseApi.getWarehouse();
    const listWarehouseManagement =
      isArray(data) &&
      data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    setWareHouseManagement(listWarehouseManagement);
    setSelectWarehouse(listWarehouseManagement[0].value);
    setFilter((filter) => ({
      ...filter,
      warehouse_id: listWarehouseManagement[0].value,
    }));
  };

  const getListItemCategory = async () => {
    const { data } = await ItemCategoryApi.getItemCategory();
    setItemcategories(data);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const headers = [
    { label: "Mã sản phẩm", key: "item_code" },
    { label: "Mã SKU", key: "sku" },
    { label: "Tên sản phẩm", key: "name" },
    { label: "Danh mục", key: "category" },
    { label: "SL tồn kho", key: "quantity" },
  ];

  const columns: ColumnsType<IInventoryWareHouses> = [
    {
      title: "Mã sản phẩm",
      width: 150,
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => onCoppy(e, get(record, "item.code"))}
        >
          {get(record, "item.code")}
        </span>
      ),
    },
    {
      title: "Mã SKU",
      width: 150,
      dataIndex: "sku",
      key: "sku",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#384ADC] font-semibold">
          {record.sku}
        </span>
      ),
    },
    {
      title: "Tên sản phẩm",
      width: 270,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {record.name}
        </span>
      ),
    },
    {
      title: "Danh mục",
      width: 150,
      dataIndex: "category_id",
      key: "category_id",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {get(record, "item.item_category.name")}
        </span>
      ),
    },
    {
      title: "SL tồn kho",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {get(record, "quantity")}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý tồn kho" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouseManagement}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  warehouse_id: e,
                });
                setSelectWarehouse(e);
              }}
              value={selectdWarehouse}
            />
          </div>
          <Button
            variant="outlined"
            width={136}
            icon={<Icon icon="transfer" size={24} />}
          >
            <a
              href="/warehouse/transfer-commands/create"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chuyển kho
            </a>
          </Button>
          <Button
            variant="outlined"
            width={116}
            icon={<Icon icon="import-2" size={24} />}
          >
            <a
              href="/warehouse/import-commands/create"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nhập kho
            </a>
          </Button>
          <CSVLink
            headers={headers}
            data={inventoryItemExport}
            filename={"ton-kho.csv"}
            onClick={() => {
              message.success("Download thành công");
            }}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="export" size={24} />}
            >
              Xuất file
            </Button>
          </CSVLink>
          <Button
            variant="no-outlined"
            width={62}
            color="white"
            icon={<Icon icon="question" size={16} />}
          >
            <a
              href="https://docs.google.com/document/d/1wXPHowLeFIU6q-iXi-ryM56m7GuLahu4FFxsNPzJXYw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hỗ trợ
            </a>
          </Button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex flex-1 min-w-[639px]"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          onChange={(e: any) => {
            setSearchKey(e.target.value);
            setPagination({
              ...pagination,
              page: 1,
            });
          }}
        />
        <Select
          allowClear
          clearIcon={<Icon icon="cancel" size={16} />}
          containerClassName="max-w-fit	"
          prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
          placeholder="Tìm theo danh mục sản phẩm"
          style={{ width: 306 }}
          options={itemcategories}
          onChange={(e) =>
            setFilter({
              ...filter,
              category_id: e,
            })
          }
        />
      </div>
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={[...inventoryWareHouses]}
        onChange={(e: any) => {
          setPagination({
            ...pagination,
            page: e.current || 1,
            pageSize: e.pageSize || 10,
          });
        }}
        pagination={{
          total: pagination.total,
          defaultPageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        scroll={{ x: 50 }}
      />
    </div>
  );
};

ReactDOM.render(<InventoryWareHouseList />, document.getElementById("root"));
