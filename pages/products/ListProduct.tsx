/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, notification, Popover, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import get from "lodash/get";
import { format } from "date-fns";
import Image from "next/image";
import Tabs from "../../components/Tabs";
import TitlePage from "../../components/TitlePage/Titlepage";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input/Input";
// import DatePicker from "../../components/DateRangePicker/DateRangePicker";
import DropdownStatus from "../../components/DropdownStatus";
import { StatusColorEnum, StatusEnum, StatusList } from "../../types";
// import defaultAvatar from "../../assets/default-avatar.svg";
import classNames from "classnames";

import styles from "../../styles/ListProduct.module.css";

import { IsProduct, ProductMetricsProps } from "./product.type";
import ItemApi from "../../services/items";
import ItemCategoryApi from "../../services/item-categories";
import WarehouseApi from "../../services/warehouses";
// import { concat } from "lodash";
import DatePicker from "../../components/DatePicker/DatePicker";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";
import { useDebounce } from "usehooks-ts";
// import NoImage from "../../assets/no-image.svg";
import ModalConfirm from "../../components/Modal/ModalConfirm/ModalConfirm";
import { CSVLink } from "react-csv";
import { isArray, onCoppy } from "../../utils/utils";

const ListProduct = (props: any) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [items, setItems] = useState<IsProduct[]>([]);
  const [itemExport, setItemExport] = useState<any[]>([]);

  const [productTypeList, setProductTypeList] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [listDisabledId, setListDisabledId] = useState<number[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchPhrase, 1000);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [createdAtFrom, setCreatedAtFrom] = useState(null);
  const [createdAtTo, setCreatedAtTo] = useState(null);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

  const [optionPrint, setOptionPrint] = useState<any[]>([
    {
      label: "QR Code",
      value: "qr_code",
    },
    {
      label: "BAR Code",
      value: "bar_code",
    },
    {
      label: "Cả hai",
      value: "both",
    },
  ]);
  const [selectedOptionPrint, setSelectedOptionPrint] = useState("both");

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: pageSize,
    defaultCurrent: page,
  });
  const [metrics, getMetrics] = useState<ProductMetricsProps>({
    totalCanSell: 0,
    totalAlreadySell: 0,
    totalRemain: 0,
  });
  const [warehouses, setWarehouses] = useState([
    {
      label: "Tất cả kho",
      value: "",
    },
  ]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getAllProducts();
  }, [
    page,
    pageSize,
    selectedCategory,
    debouncedSearchTerm,
    selectedWarehouse,
    createdAtFrom,
    createdAtTo,
  ]);

  useEffect(() => {
    getAllProductTypes();
    getProductMetrics();
    getAllWarehouses();
  }, []);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getAllProducts = async () => {
    setLoading(true);
    const { data, totalPage, totalItem } = await ItemApi.getItem({
      limit: pageSize,
      page: page,
      item_category_id: selectedCategory,
      search: debouncedSearchTerm,
      warehouse_id: selectedWarehouse,
      created_at_from: createdAtFrom,
      created_at_to: createdAtTo,
    });
    let rawItemExport = data.map((item: any) => {
      return {
        ...item,
        status_show: StatusList.find(
          (status) =>
            status.value === (item?.is_show ? item.status : StatusEnum.HIDDEN)
        )?.name,
      };
    });
    setItems(data);
    setItemExport(rawItemExport);
    setPagination({
      total: totalItem,
      pageSize: pageSize,
      defaultCurrent: page,
    });
    setLoading(false);
  };

  const getAllProductTypes = async () => {
    const { data } = await ItemCategoryApi.getItemCategory();
    const rawProductCategory = [
      {
        label: "Chọn",
        value: "",
        id: "",
      },
    ];
    data.map((item:any) =>
      rawProductCategory.push({
        label: item.label,
        value: item.label,
        id: item.value,
      })
    );

    setProductTypeList(rawProductCategory);
  };

  const getProductMetrics = async () => {
    const { totalCanSell, totalAlreadySell, totalRemain } =
      await ItemApi.getProductMetrics();
    getMetrics({ totalCanSell, totalAlreadySell, totalRemain });
  };

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();

    setWarehouses(
      warehouses.concat(
        data.map((v: any) => ({
          label: v.name,
          value: v.id,
        }))
      )
    );
  };

  const handleShowProduct = (status: any, data: any) => {
    setListDisabledId(listDisabledId.concat(data.id));
    ItemApi.updateShowItem(data.id, {
      is_show: status,
    });
    let newListDisabledId = listDisabledId.filter(
      (item: any) => item.id != data.id
    );
    setListDisabledId(newListDisabledId);
  };

  const headers = [
    { label: "Mã sản phẩm", key: "code" },
    { label: "Tên sản phẩm", key: "name" },
    { label: "Danh mục", key: "category" },
    { label: "Tổng nhập", key: "numberSale" },
    { label: "Mẫu mã", key: "models" },
    { label: "Có thể bán", key: "numberSale" },
    { label: "Ngày tạo", key: "createdAt" },
    { label: "Trạng thái", key: "status_show" },
  ];

  const columns: ColumnsType<IsProduct> = [
    {
      title: "Hiện",
      width: 82,
      key: "id",
      fixed: "left",
      align: "center",
      render: (_, record: any) => {
        return (
          <Switch
            disabled={listDisabledId.includes(record.id)}
            className="button-switch"
            defaultChecked={record.is_show}
            onChange={(e) => {
              record.is_show = e;
              handleShowProduct(e, record);
            }}
          />
        );
      },
    },
    {
      title: "Mã sản phẩm",
      width: 150,
      dataIndex: "code",
      key: "name",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          className="text-[#384ADC] font-semibold"
          onClick={(e) => {
            record.code && onCoppy(e, record.code);
          }}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên sản phẩm",
      width: 260,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, record) => (
        <div
          className="flex justify-start items-center"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          <div className="mr-[8px] max-w-[40px] max-h-[40px] relative">
            {record.image ? (
              <Image className="min-w-[40px] min-h-[40px]" src={record.image} fill alt=""/>
            ) : (
              // <NoImage className="w-[40px] h-[40px]" />
              <div></div>
            )}
          </div>
          <span className="font-medium">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      width: 132,
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (_, record) => (
        <span
          className="font-medium text-[#1D1C2D]"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.category}
        </span>
      ),
    },
    {
      title: "Tổng nhập",
      width: 200,
      dataIndex: "numberSale",
      key: "numberSale",
      align: "center",
      render: (_, record) => (
        <span
          className="font-medium text-[#1D1C2D]"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.numberSale}
        </span>
      ),
    },
    {
      title: "Mẫu mã",
      width: 100,
      dataIndex: "models",
      key: "models",
      align: "center",
      render: (_, record) => (
        <span
          className="font-medium text-[#1D1C2D]"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.models}
        </span>
      ),
    },
    {
      title: "Có thể bán",
      width: 132,
      dataIndex: "numberSale",
      key: "numberSale",
      align: "center",
      render: (_, record) => (
        <span
          className="font-medium text-[#1D1C2D]"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.numberSale}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      width: 132,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (_, record) => (
        <div
          className="font-medium text-[#1D1C2D]"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.createdAt}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: 185,
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (_, record) =>
        record?.status && (
          <span
            className={`font-semibold text-[${
              record?.is_show
                ? StatusColorEnum[record.status]
                : StatusColorEnum[StatusEnum.HIDDEN]
            }]`}
            onClick={(e) => {
              window.location.href = `/product/items/edit/${record.id}`;
            }}
          >
            {
              StatusList.find(
                (status) =>
                  status.value ===
                  (record?.is_show ? record.status : StatusEnum.HIDDEN)
              )?.name
            }
          </span>
        ),
    },
  ];

  const handlePrintCode = () => {
    const arrStr = encodeURIComponent(JSON.stringify(selectedRowKeys));
    window.open(
      `/order-management/list/print-code?arrayId=` +
        arrStr +
        `&option_print=${selectedOptionPrint}`
    );
  };

  const handleConfirmDelete = async () => {
    setIsShowModalConfirm(false);
    const { data } = await ItemApi.deleteManyItems(
      selectedRowKeys,
      // window.loggedInUser
    );
    if (data) {
      notification.success({
        message: "Xóa sản phẩm thành công",
      });
      getAllProducts();
    }
  };

  const handleChangeDates = (dates: any) => {
    if (dates) {
      setCreatedAtFrom(dates[0].format("YYYY-MM-DD"));
      setCreatedAtTo(dates[1].format("YYYY-MM-DD"));
    } else {
      setCreatedAtFrom(null);
      setCreatedAtTo(null);
    }
  };

  const handleChooseCodePrint = (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>Chọn mã code in đơn</div>
      <div className="flex flex-row justify-between">
        <Select
          width={150}
          options={optionPrint}
          value={selectedOptionPrint}
          onChange={(e) => setSelectedOptionPrint(e)}
        />
        <Button
          variant="outlined"
          width={130}
          icon={<Icon icon="printer" size={24} />}
          onClick={() => handlePrintCode()}
        >
          In
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý sản phẩm" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center"></div>
          <Popover
            placement="bottomLeft"
            content={handleChooseCodePrint}
            className="detail-customer"
            trigger="click"
            overlayStyle={{
              padding: "16px",
            }}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="printer" size={24} />}
            >
              In mã code
            </Button>
          </Popover>
          <CSVLink
            headers={headers}
            data={itemExport}
            filename={"san-pham.csv"}
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
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = "/product/items/create")}
          >
            Thêm mới
          </Button>
          <Button
            variant="danger-outlined"
            width={153}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => setIsShowModalConfirm(true)}
          >
            Xóa
          </Button>
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
          className="flex flex-col flex-1 w-[306px]"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã sản phẩm/ Tên sản phẩm"
          value={searchPhrase}
          onChange={(e) => {
            setSearchPhrase(e.target.value);
            setPage(1);
          }}
        />
        {/*<Button variant="outlined" width={148}>
          Ghim tìm kiếm
        </Button>*/}

        <InputRangePicker
          placeholder={["Ngày tạo bắt đầu", "Ngày tạo kết thúc"]}
          width={356}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(dates: any) => handleChangeDates(dates)}
        />
        <div style={{ width: 306 }}>
          <Select
            allowClear
            showSearch
            filterOption={(iv, op: any) =>
              op.value
                .toLocaleLowerCase()
                .includes((iv || "").toLocaleLowerCase())
            }
            clearIcon={<Icon icon="cancel" size={16} />}
            prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
            placeholder="Tìm theo danh mục sản phẩm"
            options={productTypeList}
            onChange={(e, option: any) => {
              console.log("e", e);
              console.log("option", option);
              setSelectedCategory(option.id);
            }}
          />
        </div>

        {/*<DatePicker width={306} />*/}
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số sản phẩm đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <div className="relative">
        <Table
          rowKey={(record: any) => record.id}
          loading={loading}
          onChange={(e) => {
            console.log("e", e);
            setPageSize(e.pageSize || 10);
            setPage(e.current || 1);
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          scroll={{ x: 50 }}
        />
        <div className={classNames("flex items-center", styles.total_wrapper)}>
          <div className={styles.row}>
            Có thể bán:
            <span className="font-medium text-[#384ADC]">
              {" "}
              {metrics?.totalCanSell ?? 0}
            </span>
          </div>
          <div className={styles.row}>
            Tổng tiền đã bán:
            <span className="font-medium text-[#384ADC]">
              {" "}
              {metrics?.totalAlreadySell ?? 0} đ
            </span>
          </div>
          <div className={styles.row}>
            Tiền hàng còn lại:
            <span className="font-medium text-[#384ADC]">
              {" "}
              {metrics?.totalRemain ?? 0} đ
            </span>
          </div>
        </div>
      </div>
      <ModalConfirm
        titleBody="Xóa thông tin sản phẩm?"
        content={
          <div className="text-center">
            Mọi dữ liệu của sản phẩm này <br />
            sẽ bị xoá khỏi hệ thống
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
    </div>
  );
};

export default ListProduct;
