/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Icon from "../../../components/Icon/Icon";
import TitlePage from "../../../components/TitlePage/Titlepage";
import classNames from "classnames";
import { Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import get from "lodash/get";
import InputRangePicker from "../../../components/DateRangePicker/DateRangePicker";

import styles from "../../../styles/Report.module.css";
import { IsProduct } from "../../products/product.type";
import { isArray } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import ReportExpenseApi from "../../../services/report/report-expenses";
import ReportItemApi from "../../../services/report/report-item";
import Select from "../../../components/Select/Select";
import WarehouseApi from "../../../services/warehouses";

const ReportExpenses = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({
    order_status_id: 2,
  });

  const [items, setItems] = useState<any[]>([]);
  const [selectdWarehouse, setSelectWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<any>([]);

  useEffect(() => {
    getListWarehouse();
  }, []);

  useEffect(() => {
    getReportItem();
  }, [filter, pagination.page, pagination.pageSize]);

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

  const getReportItem = async () => {
    setLoading(true);
    const { data } = await ReportItemApi.reportItem({
      ...filter,
      ...pagination,
    });
    if (data) {
      setItems(data.reportItems);
      setPagination({
        ...pagination,
        total: data.totalPage,
      });
      setLoading(false);
    }
  };

  const reportItemStatus = [
    {
      label: "Xác nhận",
      value: 2,
      is_show_order_list: true,
      index: 3,
      id: 2,
    },
    {
      label: "Đã gửi",
      value: "sended",
    },
    {
      label: "Đã nhận",
      value: 9,
      is_show_order_list: true,
      index: 6,
      id: 9,
    },
    {
      label: "Hoàn 1 phần",
      value: 11,
      is_show_order_list: true,
      index: 8,
      id: 11,
    },
  ];

  const colData = Array(50)
  .fill({
    name: "Gel rua tay",
    code: "XM120023",
    quantity: 200,
    price_percent: "40000",
    total_payment_price: 30,
    import_command_id: "1023",
    import_price: "40000",
  })
  .map((item, index) => ({...item, id: index++}))

  const columns: ColumnsType<any> = [
    {
      title: "Tên sản phẩm",
      width: 230,
      key: "name",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">{record.name}</div>
        );
      },
    },
    {
      title: "Mã sản phẩm",
      width: 230,
      key: "code",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.code}</div>;
      },
    },
    {
      title: "Số lượng sản phẩm",
      width: 230,
      key: "total_receipt_price",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.quantity}</div>;
      },
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Doanh thu / giá nhập",
      width: 230,
      key: "total_payment_price",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {record.import_price == 0
              ? "Lỗi tính toán"
              : (parseFloat(record.price_percent) || 0).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_payment_price - b.total_payment_price,
    },
    {
      title: "Giá nhâp",
      width: 230,
      key: "total_surplus",
      align: "center",
      render: (_, record: any) => {
        return (
          <div
            className="font-medium text-[#384ADC]"
            onClick={() =>
              (window.location.href = `/warehouse/import-commands/update/${parseInt(
                record.import_command_id
              )}`)
            }
          >
            {(parseFloat(record.import_price) || 0).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.import_price - b.import_price,
    },
  ];

  const handleSearchByDate = (value: any) => {
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
        <TitlePage title="Báo cáo thu chi" />
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
      <div className="flex item-center justify-between mt-[18px]">
        <div>
          <Select
            onChange={(e) => {
              setPagination({
                ...pagination,
                page: pagination.page || 1,
                pageSize: pagination.pageSize || 10,
              });
              setFilter({
                ...filter,
                order_status_id: e,
              });
            }}
            options={reportItemStatus}
            width={248}
            value={filter.order_status_id}
          />
        </div>
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
          // dataSource={[...items]}
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

export default ReportExpenses;
