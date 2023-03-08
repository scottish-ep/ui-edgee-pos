/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format, parseISO } from "date-fns";

import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import DateRangePickerCustom from "../../../components/DateRangePicker/DateRangePickerCustom";
import { IItemWholeSale } from "../promotion.type";
import ModalEditWholeSale from "./ModalEditWholeSale";
import { isArray, onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import PaginationCustom from "../../../components/PaginationCustom";
import ItemApi from "../../../services/items";
import { IProduct } from "../../products/product.type";
import WarehouseApi from "../../../services/warehouses";
import { IWareHouses } from "../../warehouses/warehouse.type";
import { IOption } from "../../../types/permission";
import ItemCategoryApi from "../../../services/item-categories";
import type { RangePickerProps } from "antd/es/date-picker";
import { uuid } from "uuidv4";
import { CSVLink } from "react-csv";
import Api from "../../../services";
import { useDebounce } from "usehooks-ts";
import ItemSkuApi from "../../../services/item-skus";
import { get } from "lodash";

const WholeSaleList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState<IItemWholeSale | undefined>();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [items, setItems] = useState<IItemWholeSale[]>([]);
  const [warehouses, setWarehouses] = useState<IOption[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | string>();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [productTypeList, setProductTypeList] = useState([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [reload, setReload] = useState<string>("");
  const [dataExport, setDataExport] = useState<any>([
    {
      id: "",
      is_allow_wholesale: "",
      code: "",
      name: "",
      category: "",
      price: "",
      wholesales_count: "",
      updated_at: "",
    },
  ]);
  const debouncedValue = useDebounce<string>(searchPhrase, 1000);
  const optionFilterWholseSale: any[] = [
    {
      label: "Sản phẩm bán sỉ",
      value: true,
    },
    {
      label: "Tất cả",
      value: "",
    },
  ];
  const [selectedOptionFilterWholseSale, setSelectedOptionFilterWholseSale] =
    useState<any[]>([]);

  const onChangStatus = (value: any) => {
    let newItems: any[] = items;
    const index: any = items.findIndex((item) => item.id === value.id);
    if (index !== -1) {
      newItems[index].is_allow_wholesale = !newItems[index].is_allow_wholesale;
    }
    console.log("newItems", newItems);
    setItems((items) => newItems);
  };

  useEffect(() => {
    getAllWarehouse();
    getAllProductTypes();
  }, []);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getAllProducts();
  }, [
    page,
    pageSize,
    warehouseId,
    selectedCategory,
    debouncedValue,
    dateTo,
    reload,
    selectedOptionFilterWholseSale,
  ]);

  const getAllProducts = async () => {
    setLoading(true);
    // const { data, totalPage, totalItems } = await ItemSkuApi.getListWholesale({
    const { data, totalPage, totalItems } = await ItemSkuApi.getListWholesale({
      limit: pageSize,
      page: page,
      item_category_id: selectedCategory,
      name: searchPhrase,
      warehouse_id: warehouseId,
      date_from: dateFrom,
      date_to: dateTo,
      is_allow_wholesale: selectedOptionFilterWholseSale,
    });

    let dataExport: any = [];
    let itemSkus: any = [];
    data?.map((item: any) => {
      dataExport.push({
        id: item?.id,
        is_allow_wholesale: item?.is_allow_wholesale ? "Có" : "Không",
        code: item?.sku_code || "--",
        name: get(item, "item.name") || "--",
        category: get(item, "item.item_category.name") || "--",
        price: get(item, "item_channel_relation.price") || "--",
        wholesales_count: item?.wholesales_count,
        updated_at: item?.updated_at || "--",
        quantity: item.warehouse_items_sum_quantity,
      });

      let name = get(item, "item.name");
      if (get(item, "item.item_category")) {
        name += " - " + get(item, "item.item_category.name");
      }
      isArray(item.item_attribute_values) &&
        item.item_attribute_values.map((v: any) => {
          name = name + " - " + v.value;
        });

      itemSkus.push({
        ...item,
        id: item?.id,
        is_allow_wholesale: item?.is_allow_wholesale,
        code: item.sku_code,
        name: name,
        price: get(item, "item_channel_relation.price"),
        wholesales_count: isArray(item.wholesales) ? item.wholesales.length : 0,
      });
    });
    console.log("item", itemSkus);
    setItems(itemSkus);
    setDataExport(dataExport);
    setTotalItems(totalItems);
    setLoading(false);
  };

  const getAllProductTypes = async () => {
    const { data } = await ItemCategoryApi.getItemCategory();
    setProductTypeList(data);
  };

  const getAllWarehouse = async () => {
    const url = `/api/v2/warehouses/list`;
    const { data } = await Api.get(url);

    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];

    data?.data?.map((item: any) => {
      arr.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setWarehouses(arr);
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
    { label: "ID", key: "id" },
    { label: "Bán sỉ", key: "is_allow_wholesale" },
    { label: "Mã sản phẩm", key: "code" },
    { label: "Tên combo", key: "name" },
    { label: "Danh mục", key: "category" },
    { label: "Giá bán", key: "price" },
    { label: "Tồn kho", key: "quantity" },
    { label: "Số giá sỉ", key: "wholesales_count" },
    { label: "Cập nhật lần cuối", key: "updated_at" },
  ];

  const onToggleIsAllowWholesale = async (
    checked: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
    id: number | string
  ) => {
    e.stopPropagation();
    const { data } = await ItemApi.toggleIsAllowWholesale(id);
    if (data) {
      message.success("Cập nhật thành công");
    }
    setReload(uuid);
  };

  const colData: IItemWholeSale[] = Array(50)
  .fill({
    is_allow_wholesale: true,
    code: "XB88",
    price: "40000",
    name: "Ao quan",
    item: {
      item_category: {
        name: "Thoi trang",
      }
    },
    pice: "20000",
    warehouse_items_sum_quantity: 300,
    wholesales_count: 3,
    updated_at : Date.now(),
  })
  .map((item, index) => ({...item, id: index++}))

  const columns: ColumnsType<IItemWholeSale> = [
    {
      title: "Bán sỉ",
      width: 100,
      key: "isWholeSale",
      align: "center",
      render: (_, record) => {
        return (
          <Switch
            className="button-switch"
            checked={record?.is_allow_wholesale}
            onChange={(checked, event) =>
              onToggleIsAllowWholesale(checked, event, record.id)
            }
          />
        );
      },
    },
    {
      title: "Mã sản phẩm",
      width: 140,
      dataIndex: "id",
      key: "ie",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => onCoppy(e, record?.code)}
        >
          {record?.code}
        </span>
      ),
    },
    {
      title: "Tên sản phẩm",
      width: 200,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3d] font-medium">
          {record?.name || "--"}
        </span>
      ),
    },
    {
      title: "Danh mục",
      width: 100,
      dataIndex: "category_id",
      key: "category_id",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "item.item_category.name") || "--"}
        </span>
      ),
    },
    {
      title: "Giá bán",
      width: 100,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record: any) => (
        <span className="text-medium text-[#4B4B59]">
          {record.price ? parseFloat(record.price).toLocaleString() : "--"} đ
        </span>
      ),
    },
    {
      title: "Tồn kho",
      width: 100,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record: any) => (
        <span className="text-medium text-[#4B4B59]">
          {record.warehouse_items_sum_quantity}
        </span>
      ),
    },
    {
      title: "Số giá sỉ",
      width: 100,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record?.wholesales_count}
        </span>
      ),
    },
    {
      title: "Cập nhật cuối",
      width: 150,
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (_, record) =>
        record.updated_at ? (
          <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
            <span>{format(new Date(record.updated_at), "HH:mm")}</span>
            <span>{format(new Date(record.updated_at), "dd/MM/yyyy")}</span>
          </div>
        ) : (
          <div>{"--"}</div>
        ),
    },
  ];

  const onDateChange: RangePickerProps["onChange"] = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings?.[0]);
      setDateTo(dateStrings?.[1]);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý giá sỉ" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium min-w-[70px]">
              Chọn kho
            </div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
              onChange={(value) => setWarehouseId(value)}
              value={warehouseId}
            />
          </div>
          <CSVLink
            headers={headers}
            data={dataExport}
            filename={"wholesales.csv"}
            onClick={() => {
              message.success("Download thành công");
            }}
          >
            <Button
              variant="outlined"
              width={109}
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
      <div className="grid grid-cols-[1fr_20%_20%_20%] mb-[20px] gap-[10px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <Select
          allowClear
          clearIcon={<Icon icon="cancel" size={16} />}
          prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
          placeholder="Tìm theo danh mục sản phẩm"
          options={productTypeList}
          onChange={(e) => setSelectedCategory(e)}
        />
        <Select
          value={selectedOptionFilterWholseSale}
          placeholder="Lọc sản phẩm bán sỉ"
          options={optionFilterWholseSale}
          onChange={(e) => setSelectedOptionFilterWholseSale(e)}
        />
        <DateRangePickerCustom onChange={onDateChange} />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số khuyến mãi đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Table
        rowKey={(record) => record?.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => setRowSelected(record),
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={[...items]}
        dataSource={colData}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        total={totalItems}
        defaultPageSize={pageSize}
        current={page}
        onChangePage={(page) => setPage(page)}
        onChangePageSize={(pageSize) => setPageSize(pageSize)}
      />

      <ModalEditWholeSale
        onChangeStatus={(value) => onChangStatus(rowSelected)}
        rowSelected={rowSelected}
        isVisible={!!rowSelected}
        onClose={() => setRowSelected(undefined)}
        title="Cài đặt giá sỉ"
        onSuccess={(uuid) => setReload(uuid)}
      />
    </div>
  );
};

export default WholeSaleList