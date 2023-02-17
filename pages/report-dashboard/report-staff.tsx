/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../components/Button/Button";
import DatePicker from "../../components/DatePicker/DatePicker";
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

import styles from "../../styles/Report.module.css";
import { IsProduct } from "../products/product.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IStaff } from "./report.type";
import ReportStaffApi from "../../services/report/report-staff";
import { faBedPulse } from "@fortawesome/free-solid-svg-icons";
import { setDate } from "date-fns";

const ReportStaff = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(defaultPagination);
  const [orderTypeOptions, setOrderTypeOptions] = useState<any[]>([
    {
      label: "Nhân viên bán hàng tại quầy",
      value: 2,
    },
    {
      label: "Nhân viên bán hàng online",
      value: 1,
    },
  ]);
  const [selectedOrderType, setSelectedOrderType] = useState(1);
  const [staffs, setStaffs] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    getDataStaffSaleOrder();
  }, [selectedOrderType]);

  const getDataStaffSaleOrder = async () => {
    const { data, totalOrders, totalPage } =
      await ReportStaffApi.getStaffSaleOrder({
        order_type: selectedOrderType,
      });
    console.log("data", data);
    setStaffs(data);
    setPagination({
      ...pagination,
      total: totalOrders,
    });
    setLoading(false);
  };

  const columns: ColumnsType<IStaff> = [
    {
      title: "Mã nhân viên",
      width: 133,
      key: "id",
      align: "center",
      render: (_, record) => {
        return <div className="font-medium">{record.id}</div>;
      },
    },
    {
      title: "Tên nhân viên",
      width: 339,
      key: "name",
      align: "left",
      render: (_, record) => {
        return (
          <div className="font-semibold text-[#384ADC]">{record.name}</div>
        );
      },
    },
    {
      title: "Số lượng đơn hàng",
      width: 240,
      key: "orders_count",
      align: "center",
      sorter: (a: any, b: any) => a?.orders_count - b?.orders_count,
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {parseFloat(record.orders_count).toLocaleString() || 0}
          </div>
        );
      },
    },
    {
      title: "Số lượng SP bán ra",
      width: 240,
      key: "orderSales",
      sorter: (a: any, b: any) => a.orderSales - b.orderSales,
      align: "center",
      render: (_, record) => {
        return <div className="font-medium">{0}</div>;
      },
    },
    {
      title: "Doanh thu",
      width: 240,
      key: "orders_sum_total_cost",
      sorter: (a: any, b: any) =>
        a.orders_sum_total_cost - b.orders_sum_total_cost,
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {parseFloat(record.orders_sum_total_cost).toLocaleString() || 0}đ
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo nhân viên" />
      </div>
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <div className="flex items-center justify-between mb-[24px] flex-wrap">
          <div className="text-[#384ADC] font-semibold text-big">
            Doanh thu theo nhân viên
          </div>
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center">
              <div className="mr-[12px]">Chọn loại nhân viên</div>
              <Select
                options={orderTypeOptions}
                style={{ width: 248 }}
                value={selectedOrderType}
                onChange={(value) => setSelectedOrderType(value)}
              />
            </div>
            {/* <span className="cursor-pointer">
              <Icon icon="export" />
            </span> */}
          </div>
        </div>
        <Table
          loading={loading}
          className="table-layout2 table-has-total"
          columns={columns}
          dataSource={[...staffs]}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(e) => {
            setPagination({
              ...pagination,
              current: e.current || 1,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
          }}
          summary={(pageData) => {
            let totalOrder: any = 0;
            let totalSaleOrder: any = 0;
            let totalMoneyEarn: any = 0;

            pageData.forEach((data: any) => {
              const { orders_count, orser_sale, orders_sum_total_cost } = data;
              totalOrder = totalOrder + parseFloat(orders_count);
              totalSaleOrder = totalSaleOrder + 0;
              totalMoneyEarn =
                totalMoneyEarn + parseFloat(orders_sum_total_cost);
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <div className="text-[#1D1C2D] text-center font-bold">
                      Tổng
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <div className="text-[#FF970D] font-semibold text-center">
                      {parseFloat(totalOrder).toLocaleString()}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <div className="text-[#FF970D] font-semibold text-center">
                      {parseFloat(totalSaleOrder).toLocaleString()}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <div className="text-[#FF970D] font-semibold text-center">
                      {parseFloat(totalMoneyEarn).toLocaleString()}đ
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<ReportStaff />, document.getElementById("root"));
