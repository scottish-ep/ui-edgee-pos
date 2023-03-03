/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Table } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import DatePicker from "../../../components/DatePicker/DatePicker";
import Icon from "../../../components/Icon/Icon";
import Select from "../../../components/Select/Select";
import TitlePage from "../../../components/TitlePage/Titlepage";
import { listDayCompare } from "../../../const/constant";
import classNames from "classnames";
import type { ColumnsType } from "antd/es/table";
import InputRangePicker from "../../../components/DateRangePicker/DateRangePicker";

import styles from "../../../styles/Report.module.css";
import ReportPieChart from "../ReportChart/PieChart/ReportPieChart";
import LineChart from "../ReportChart/LineChart/ReportLineChart";
import { IOrder } from "../report.type";
import WarehouseApi from "../../../services/warehouses";
import ReportOrderApi from "../../../services/report/report-order";
import { OrderStatusEnum } from "../../../enums/enums";
import { get, isArray } from "lodash";
import TableEmpty from "../../../components/TableEmpty";
import { IsProduct } from "../../products/product.type";
import ReportProductApi from "../../../services/report/report-product";

const ReportOrderOffline = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [warehouses, setWarehouses] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [topProduct, setTopProduct] = useState<any[]>([]);

  useEffect(() => {
    getAllWarehouses();
  }, []);

  useEffect(() => {
    getTopProductSale();
  }, [filter, pagination.page, pagination.pageSize]);

  const getTopProductSale = async (warehouseId?: number | string) => {
    setLoadingProduct(true);
    const { data, totalItemSkus, totalPage } =
      await ReportProductApi.getTopProductSale({
        ...filter,
        ...pagination,
        orderType: 2,
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

  const colsData: IsProduct[] = Array(50) 
  .fill({
    code: "MH1929",
    name: "Test",
    quantity: 110,
    revenue: 1000,
  })
  .map((item, index) => ({...item, id: index++}))

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
        <TitlePage title="Báo cáo đơn hàng tại quầy" />
      </div>
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
          loading={loadingProduct}
          className="table-layout1"
          columns={columns}
          // dataSource={[...topProduct]}
          dataSource={colsData}
          pagination={{
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

export default ReportOrderOffline;
