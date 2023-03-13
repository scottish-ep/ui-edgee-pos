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

const ReportExpenses = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});

  const [epenses, setEpenses] = useState<any[]>([]);

  useEffect(() => {
    getReportExpenses();
  }, [filter, pagination.page, pagination.pageSize]);

  const getReportExpenses = async () => {
    setLoading(true);
    const { data } = await ReportExpenseApi.expenseOverview({
      ...filter,
      ...pagination,
    });
    if (data) {
      setEpenses(data);
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên nhân viên",
      width: 230,
      key: "name",
      align: "center",
      render: (_, record) => {
        return (
          <div
            className="text-[#384ADC] font-semibold"
            onClick={() =>
              window.open(
                `/debt-management/list-payment?staff_id=${record?.id}`
              )
            }
          >
            {record.name}
          </div>
        );
      },
    },
    {
      title: "Số lượng phiếu thu",
      width: 230,
      key: "total_receipt",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.total_receipt}</div>;
      },
      sorter: (a, b) => a.total_receipt - b.total_receipt,
    },
    {
      title: "Tổng Tiền Thu",
      width: 230,
      key: "total_receipt_price",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {(parseFloat(record.total_receipt_price) || 0).toLocaleString() +
              "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_receipt_price - b.total_receipt_price,
    },
    {
      title: "Số lượng phiếu chi",
      width: 230,
      key: "total_payment",
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.total_payment}</div>;
      },
      sorter: (a, b) => a.total_payment - b.total_payment,
    },
    {
      title: "Tổng Tiền chi",
      width: 230,
      key: "total_payment_price",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {(parseFloat(record.total_payment_price) || 0).toLocaleString() +
              "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_payment_price - b.total_payment_price,
    },
    {
      title: "Còn Lại",
      width: 230,
      key: "total_surplus",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {(parseFloat(record.total_surplus) || 0).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.total_surplus - b.total_surplus,
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
        <TitlePage title="Báo cáo thu chi" />
        <div className="flex items-center gap-[24px] px-[12px]">
          {/* <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button> */}
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
          dataSource={[...epenses]}
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

ReactDOM.render(<ReportExpenses />, document.getElementById("root"));
