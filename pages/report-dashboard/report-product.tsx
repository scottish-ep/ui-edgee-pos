/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../components/Button/Button";
import DatePicker from "../../components/DatePicker/DatePicker";
import { wareHouseList } from "../../const/constant";
import Icon from "../../components/Icon/Icon";
import Select from "../../components/Select/Select";
import TitlePage from "../../components/TitlePage/Titlepage";
import Break from "../../components/Break/Break";
import { listDayCompare } from "../../const/constant";
import classNames from "classnames";
import { Switch, Table } from "antd";
import { productTypeList } from "../../const/constant";
import type { ColumnsType } from "antd/es/table";
import get from "lodash/get";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";

import styles from "../../styles/Report.module.css";
import ReportPieChart from "./ReportChart/PieChart/ReportPieChart";
import LineChart from "./ReportChart/LineChart/ReportLineChart";
import { IsProduct } from "../products/product.type";
import ReportRevenuaApi from "../../services/report/report-revenua";
import ReportProductApi from "../../services/report/report-product";
import WarehouseApi from "../../services/warehouses";
import { CommandStatusEnum, OrderStatusEnum } from "../../enums/enums";
import { isArray } from "../../utils/utils";
import TableEmpty from "../../components/TableEmpty";

const ReportProduct = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});
  const [productSaleByChannel, setProductSaleByChannel] = useState<any[]>([
    {
      name: "Tại quầy",
      value: 100,
    },
    { name: "Onine", value: 20 },
    { name: "Trên app", value: 30 },
  ]);
  const [orderTypeOptions, setOrderTypeOptions] = useState<any[]>([
    {
      label: "Tất cả",
      value: "100",
    },
    {
      label: "Online",
      value: 13,
    },
    {
      label: "Tại quầy",
      value: 25,
    },
    {
      label: "In app",
      value: 31,
    },
  ]);
  const [selectedOrderTypeOptions, setSelectedOrderTypeOptions] = useState("");

  const [productOverview, setProductOverview] = useState<any>({
    totalProductSale: 20,
    totalProdudctSaleOffline: 10,
    totalProdudctSaleOnline: 30,
    totalProdudctSaleInApp: 50,
    totalImportPrice: 20,
    totalItemImport: 10,
    totalCostSale: 20,
  });
  const [warehouses, setWarehouse] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [selectedWarehouses, setSelectWarehouses] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [reportProductSalgeByWarehouse, setReportProductSalgeByWarehouse] =
    useState<any[]>([]);
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(
    OrderStatusEnum.PICKUP_RECEIVED
  );
  const [topProduct, setTopProduct] = useState<any[]>([]);

  useEffect(() => {
    getProductOverview();
  }, [filter, pagination.page, pagination.pageSize]);

  useEffect(() => {
    getTopProductSale();
  }, [filter, pagination.page, pagination.pageSize, selectedOrderTypeOptions]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getTotalProductSaleByWarehouse();
  }, [selectedStatusOrder]);

  const getProductOverview = async () => {
    const data = await ReportProductApi.productOverview(filter);
    setProductOverview(data);
    setProductSaleByChannel([
      {
        name: "Tại quầy",
        value: data?.totalProdudctSaleOffline || 0,
      },
      { name: "Onine", value: data?.totalProdudctSaleOnline || 0 },
      { name: "Trên app", value: data?.totalProdudctSaleInApp || 0 },
    ]);
  };

  const getTotalProductSaleByWarehouse = async () => {
    const data = await ReportProductApi.getTotalProductSaleByWarehouse({
      status: selectedStatusOrder,
    });
    if (data) {
      setReportProductSalgeByWarehouse(data.reportProductSalgeByWarehouse);
      const listWarehouse =
        isArray(data.warehouseTotalProductSale) &&
        data.warehouseTotalProductSale.map((item: any) => ({
          ...item,
          value: item.id,
          valueReport: item.totalProductSale,
          label: item.name,
        }));
      setWarehouse(listWarehouse);
      setSelectWarehouses(listWarehouse);
    }
  };

  const getTopProductSale = async (warehouseId?: number | string) => {
    setLoadingProduct(true);
    const { data, totalItemSkus, totalPage } =
      await ReportProductApi.getTopProductSale({
        ...filter,
        ...pagination,
        order_type: selectedOrderTypeOptions,
      });
    let rawData: any[] = [];
    isArray(data) &&
      data.map((itemSku: any) => {
        let name = get(itemSku, "item.name");
        if (get(itemSku, "item.item_category")) {
          name += " - " + get(itemSku, "item.item_category.name");
        }
        isArray(itemSku.item_attribute_values) &&
          itemSku.item_attribute_values.map((v: any) => {
            if (v.value) {
              name = name + " - " + v.value;
            }
          });
        let revenue = 0;
        isArray(itemSku.order_item_skus) &&
          itemSku.order_item_skus.map((v: any) => {
            revenue += v.quantity * parseFloat(v.actual_price);
          });
        rawData.push({
          id: itemSku.id,
          name: name,
          code: itemSku.sku_code,
          quantity: itemSku.order_item_skus_sum_quantity,
          revenue: revenue,
        });
      });
    setTopProduct(rawData);
    setPagination({
      ...pagination,
      total: totalItemSkus,
    });
    setLoadingProduct(false);
  };

  const handleOnChangeWarehouse = (e: any) => {
    const newSelectedWarehouses = warehouses.filter((item) => item.id == e);
    newSelectedWarehouses && setSelectWarehouses(newSelectedWarehouses);
  };

  const statusOrder = [
    {
      label: "Đã nhận",
      value: OrderStatusEnum.PICKUP_RECEIVED,
    },
    {
      label: "Đã huỷ",
      value: OrderStatusEnum.PICKUP_RETURNED,
    },
    {
      label: "Đã hoàn",
      value: OrderStatusEnum.CANCELLED,
    },
  ];
  const colData: IsProduct[] = Array(10)
  .fill({
    code: "123SDNAN",
    name: "Test",
    quantity: 12,
    revenue: 1234,
  })

  const columns: ColumnsType<IsProduct> = [
    {
      title: "#",
      width: 50,
      key: "id",
      align: "center",
      render: (_, record, index) => {
        return <div className="font-medium w-full h-full">{index + 1}</div>;
      },
    },
    {
      title: "Mã sản phẩm",
      width: 160,
      key: "id",
      align: "center",
      render: (_, record) => {
        return <div className="font-medium">{record.code}</div>;
      },
    },
    {
      title: "Tên sản phẩm",
      width: 434,
      key: "name",
      align: "left",
      render: (_, record) => {
        return <div className="font-medium">{record.name}</div>;
      },
    },
    {
      title: "Số lượng bán ra",
      width: 260,
      key: "total",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {record.quantity ? record.quantity.toLocaleString() : 0}
          </div>
        );
      },
    },
    {
      title: "Doanh thu",
      width: 434,
      key: "totalPrice",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {!isNaN(record.revenue)
              ? record.revenue.toLocaleString() + " đ"
              : "--"}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo sản phẩm" />
        <div className="flex items-center gap-[24px]">
          {/* <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button> */}
          <div className="justify-end flex items-center">
            <div className="min-w-max text-medium font-semibold mr-[8px]">
              Hiển thị theo thời gian
            </div>
            <InputRangePicker
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              width={306}
              prevIcon={<Icon size={24} icon="calendar" />}
              onChange={(e: any) =>
                setFilter({
                  ...filter,
                  from: e[0].format("YYYY-MM-DD"),
                  to: e[1].format("YYYY-MM-DD"),
                })
              }
            />
          </div>
          {/* <div className="flex items-center gap-[8px]">
            <Checkbox onChange={() => setIsCompare(!isCompare)}>
              So sánh với
            </Checkbox>
            <Select
              defaultValue={listDayCompare[0]}
              style={{ width: 235 }}
              options={listDayCompare}
              disabled={!isCompare}
            />
          </div> */}
        </div>
      </div>
      <div className="flex gap-[12px] mb-[12px]">
        <div className="w-1/2 gap-[12px] flex flex-col">
          <div className={classNames(styles.div_container)}>
            <div className={styles.row}>
              <div className="text-big text-[#384ADC] font-semibold">
                Tổng số lượng sản phẩm đã bán
              </div>
              <div className="text-2xl font-bold text-[#384ADC]">
                {(productOverview?.totalProductSale &&
                  productOverview.totalProductSale) ||
                  0}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Lợi nhuận</div>
              <div className="text-[#10B981] text-2xl font-bold">
                {(productOverview?.totalImportPrice &&
                  productOverview?.totalCostSale &&
                  (
                    productOverview?.totalCostSale -
                    productOverview.totalImportPrice
                  ).toLocaleString()) ||
                  0}
                đ
              </div>
            </div>
            <Break />
            <div className={classNames(styles.row, "mt-[16px]")}>
              <div className="font-semibold">Tổng sản phẩm nhập</div>
              <div className="text-big font-bold">
                {(productOverview?.totalItemImport &&
                  productOverview.totalItemImport) ||
                  0}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Giá nhập</div>
              <div className="text-big font-bold">
                {(productOverview?.totalImportPrice &&
                  productOverview.totalImportPrice.toLocaleString()) ||
                  0}
                đ
              </div>
            </div>
          </div>
        </div>
        <ReportPieChart
          title="Số lượng sản phẩm đã bán theo kênh bán"
          data={productSaleByChannel}
        />
      </div>
      <LineChart
        // warehouses={warehouses}
        warehouses={wareHouseList}
        onChangeWarehouse={(e) => handleOnChangeWarehouse(e)}
        onChangeStatus={(e) => setSelectedStatusOrder(e)}
        selectedStatusOrder={selectedStatusOrder}
        keys={selectedWarehouses.map((item: any) => item.name)}
        statusOrder={statusOrder}
        title="Số lượng sản phẩm bán ra theo kho"
        dataLineChart={reportProductSalgeByWarehouse}
        data={warehouses}
        unit="sản phẩm"
      />
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <div className="flex items-center justify-between mb-[24px] flex-wrap">
          <div className="text-[#384ADC] font-semibold text-big">
            Top sản phẩm bán chạy
          </div>
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center">
              <div className="mr-[12px]">Chọn kho</div>
              <Select
                options={[
                  {
                    label: "Tất cả kho",
                    value: "",
                  },
                  ...warehouses,
                ]}
                style={{ width: 248 }}
                defaultValue=""
                onChange={(e) => {
                  console.log("e", e);
                  setFilter({
                    ...filter,
                    warehouse_id: e,
                  });
                }}
              />
            </div>
            <div className="flex items-center">
              <div className="mr-[12px]">Chọn kênh</div>
              <Select
                options={orderTypeOptions}
                style={{ width: 248 }}
                value={selectedOrderTypeOptions}
                onChange={(e) => {
                  setSelectedOrderTypeOptions(e);
                }}
              />
            </div>
            {/* <span className="cursor-pointer">
              <Icon icon="export" />
            </span> */}
          </div>
        </div>
        <Table
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
          // loading={loadingProduct}
          className="table-layout1"
          columns={columns}
          // dataSource={[...topProduct]}
          dataSource={colData}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: pagination.page || 1,
              pageSize: pagination.pageSize || 10,
            });
          }}
        />
      </div>
    </div>
  );
};

export default ReportProduct;
