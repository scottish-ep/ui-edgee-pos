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
import ReportDebtApi from "../../services/report/report-debt";

const ReportExpenses = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});

  const [debts, setDebts] = useState<any[]>([]);

  useEffect(() => {
    getReportDebts();
  }, [filter, pagination.page, pagination.pageSize]);

  const getReportDebts = async () => {
    setLoading(true);
    const { data } = await ReportDebtApi.reportDebt({
      ...filter,
      page: pagination,
    });
    console.log("data", data);
    let rawData: any[] = [];
    if (data) {
      setDebts(rawData.concat(data));
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Số lượng khách hàng",
      width: 230,
      key: "total_customer",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">
            {record.total_customer}
          </div>
        );
      },
    },
    {
      title: "Tổng tiền ghi nợ",
      width: 230,
      key: "total_debt",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">
            {parseFloat(record.total_debt || 0).toLocaleString()}
          </div>
        );
      },
      sorter: (a, b) => a.total_debt - b.total_debt,
    },
    {
      title: "Tổng tiền đã trả",
      width: 230,
      key: "total_paid",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">
            {parseFloat(record.total_paid || 0).toLocaleString()}
          </div>
        );
      },
      sorter: (a, b) => a.total_paid - b.total_paid,
    },
    {
      title: "Tổng còn",
      width: 230,
      key: "total_debt",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">
            {(
              parseFloat(record.total_debt || 0) -
              parseFloat(record.total_paid || 0)
            ).toLocaleString()}
            đ
          </div>
        );
      },
      sorter: (a, b) =>
        a.total_debt - a.total_paid - (b.total_debt - b.total_paid),
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
        <TitlePage title="Báo cáo công nợ khách hàng" />
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
          dataSource={[...debts]}
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
          onRow={(record) => {
            return {
              onClick: (event) => {
                window.open(
                  `/debt-management/list-debt?from=${filter.from}&to=${filter.to}`
                );
              },
            };
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<ReportExpenses />, document.getElementById("root"));
