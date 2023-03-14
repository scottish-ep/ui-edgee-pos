/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Icon from "../../components/Icon/Icon";
import TitlePage from "../../components/TitlePage/Titlepage";
import classNames from "classnames";
import { Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import get from "lodash/get";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";

import styles from "../../styles/Report.module.css";
import { IsProduct } from "../products/product.type";
import { isArray } from "../../utils/utils";
import TableEmpty from "../../components/TableEmpty";
import ReportExpenseApi from "../../services/report/report-expenses";
import Select from "../../components/Select/Select";
import WarehouseApi from "../../services/warehouses";
import ReportCustomerApi from "../../services/report/report-customer";

const ReportExpenses = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectdWarehouse, setSelectWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<any>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const size = urlParams.get("size");
    const currentPage = urlParams.get("page");
    setPagination({
      ...pagination,
      pageSize: size ? parseInt(size) : 10,
      page: currentPage ? parseInt(currentPage) : 1,
    });
    getListWarehouse();
  }, []);

  useEffect(() => {
    getReportCustomer();
  }, [filter, pagination.page, pagination.pageSize]);

  const getReportCustomer = async () => {
    setLoading(true);
    const { data } = await ReportCustomerApi.reportCustomer({
      ...filter,
      ...pagination,
    });
    if (data) {
      setCustomers(data.reportCustomer);
      setPagination({
        ...pagination,
        total: data.totalCustomer,
      });
      setLoading(false);
    }
  };

  const getListWarehouse = async () => {
    const data = await WarehouseApi.getWarehouse();
    const listWarehouseManagement =
      isArray(data) &&
      data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    setWarehouses(
      [
        {
          label: "Tất cả",
          value: "",
        },
      ].concat(listWarehouseManagement)
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên khách hàng",
      width: 200,
      key: "name",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">{record.name}</div>
        );
      },
    },
    {
      title: "Số điện thoại",
      width: 190,
      key: "phone",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.phone}</div>;
      },
    },
    {
      title: "Địa chỉ",
      width: 350,
      key: "address",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.address}</div>;
      },
    },
    {
      title: "Số lượng",
      align: "center",
      children: [
        {
          title: "Đơn tạo",
          dataIndex: "order_create",
          key: "order_create",
          width: 100,
          align: "center",
          render: (_, record: any) => {
            return <div>{get(record, "order_create")}</div>;
          },
          sorter: (a, b) => a.order_create - b.order_create,
        },
        {
          title: "Đơn giao",
          dataIndex: "order_send",
          key: "order_send",
          width: 100,
          align: "center",
          render: (_, record: any) => {
            return <div>{get(record, "order_send")}</div>;
          },
          sorter: (a, b) => a.order_send - b.order_send,
        },
        {
          title: "Đơn nhận",
          dataIndex: "order_received",
          key: "order_received",
          width: 100,
          align: "center",
          render: (_, record: any) => {
            return <div>{get(record, "order_received")}</div>;
          },
          sorter: (a, b) => a.order_received - b.order_received,
        },
        {
          title: "Đơn hoàn",
          dataIndex: "order_return",
          key: "order_return",
          width: 100,
          align: "center",
          render: (_, record: any) => {
            return <div>{get(record, "order_return")}</div>;
          },
          sorter: (a, b) =>
            a.assume?.order_return_partial +
            a.assume?.order_return -
            b.assume?.order_return_partial +
            b.assume?.order_return,
        },
      ],
    },
    {
      title: "Tiền chuyển khoản",
      width: 230,
      key: "total_transfer",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {(parseFloat(record.total_transfer) || 0).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_transfer - b.total_transfer,
    },
    {
      title: "Doanh thu khách hàng",
      width: 230,
      key: "total_revenue",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {(parseFloat(record.total_revenue) || 0).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_revenue - b.total_revenue,
    },
  ];

  const handleSearchByDate = (value) => {
    if (value) {
      const from = value[0].format("YYYY-MM-DD HH:mm:ss");
      const to = value[1].format("YYYY-MM-DD HH:mm:ss");
      setFilter({
        ...filter,
        from,
        to,
      });
    } else {
      setFilter({
        ...filter,
        from: "",
        to: "",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo khách hàng" />
        <div className="flex items-center gap-[24px] px-[12px]">
          <div className="flex items-center">
            <div className="text-medium font-semibold mr-[8px] min-w-fit">
              Hiển thị theo thời gian
            </div>
            <InputRangePicker
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              prevIcon={<Icon size={24} icon="calendar" />}
              onChange={(value: any) => {
                setPagination({
                  page: 1,
                  total: 0,
                  pageSize: pagination.pageSize || 10,
                });
                handleSearchByDate(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex item-center justify-end mt-[18px]">
        <div className="flex items-center">
          <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
          <Select
            placeholder="Chọn kho"
            style={{ width: 248 }}
            options={warehouses}
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
      </div>
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <Table
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
          loading={loading}
          columns={columns}
          dataSource={[...customers]}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          scroll={{ x: 50 }}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
            window.history.replaceState(
              null,
              "",
              `?size=${e.pageSize}&page=${e.current}`
            );
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<ReportExpenses />, document.getElementById("root"));
