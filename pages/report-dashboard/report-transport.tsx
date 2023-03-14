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
import ReportProvinceApi from "../../services/report/report-province";
import PieChart from "../../components/Chart/PieChart";
import ReportTransportApi from "../../services/report/report-transport";
import { over } from "lodash";

const ReportTransport = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 20,
  });
  const [filter, setFilter] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>({});
  const [pieData, setPieData] = useState<any[]>([]);
  const [typeReport, setTypeReport] = useState("transport");
  const [channel, setChannel] = useState("ALL");
  const [selectdWarehouse, setSelectWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<any>([]);

  const optionReport = [
    { label: "Theo đơn vị vận chuyển", value: "transport" },
    { label: "Theo tỉnh thành", value: "province" },
  ];
  const channelOptions: any[] = [
    {
      label: "Tất cả",
      value: "ALL",
    },
    {
      label: "Online",
      value: "ONLINE",
    },
    {
      label: "In app",
      value: "IN_APP",
    },
    {
      label: "Tại quầy",
      value: "OFFLINE",
    },
  ];

  useEffect(() => {
    getListWarehouse();
  }, []);

  useEffect(() => {
    if (typeReport === "province") {
      getReportProvince();
    } else {
      getReportTransport();
    }
  }, [filter, pagination.page, pagination.pageSize, typeReport, channel]);

  const getReportProvince = async () => {
    setLoading(true);
    const { data } = await ReportProvinceApi.reportProvince({
      ...filter,
      ...pagination,
      channels: channel,
    });
    if (data) {
      setData(data.reportProvince);
      setPagination({
        ...pagination,
        total: data.totalProvince,
      });
      setLoading(false);
    }
  };

  const getReportTransport = async () => {
    setLoading(true);
    const { data } = await ReportTransportApi.reportTransport({
      ...filter,
      ...pagination,
      channels: channel,
    });
    if (data) {
      console.log("data", data);
      setData(data.reportTransport);
      setOverview(data.overview);
      setPieData([
        {
          name: "Đơn thành công",
          value: data.overview.pickup_received,
        },
        {
          name: "Đang giao",
          value: data.overview.pickup_sent,
        },
        {
          name: "Đơn hoàn",
          value: data.overview.pickup_return,
        },
        {
          name: "Đang hoàn",
          value: data.overview.pickup_returning,
        },
        {
          name: "Tình trạng khác",
          value: data.overview.another,
        },
      ]);
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

  const columnProvince: ColumnsType<any> = [
    {
      title: "Tỉnh thành phố",
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
      title: "Đơn tạo mới",
      width: 170,
      key: "phone",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.init") || 0}</div>;
      },
      sorter: (a, b) => a.orders?.init - b.orders?.init,
    },
    {
      title: "Đơn đang giao",
      width: 170,
      key: "pickup_sent",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.pickup_sent") || 0}</div>;
      },
      sorter: (a, b) => a.orders?.pickup_sent - b.orders?.pickup_sent,
    },
    {
      title: "Đơn nhận",
      width: 170,
      key: "pickup_received",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.pickup_received") || 0}</div>;
      },
      sorter: (a, b) => a.orders?.pickup_received - b.orders?.pickup_received,
    },
    {
      title: "Đơn hoàn",
      width: 170,
      key: "return",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.return") || 0}</div>;
      },
      sorter: (a, b) => a.orders?.return - b.orders?.return,
    },
    {
      title: "Đơn giao 1 phần",
      width: 170,
      key: "return_partial",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.return_partial") || 0}</div>;
      },
      sorter: (a, b) => a.orders?.return_partial - b.orders?.return_partial,
    },
    {
      title: "Tỉ lệ",
      width: 170,
      key: "percent",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-bold">{get(record, "orders.percent") || 0}%</div>
        );
      },
      sorter: (a, b) => a.orders?.percent - b.orders?.percent,
    },
  ];

  const columnTransport: ColumnsType<IsProduct> = [
    {
      title: "Đơn vị vận chuyển",
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
      title: "Đơn đang giao",
      width: 170,
      key: "pickup_sent",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.pickup_sent") || 0}</div>;
      },
    },
    {
      title: "Đơn nhận",
      width: 170,
      key: "pickup_received",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.pickup_received") || 0}</div>;
      },
    },
    {
      title: "Đơn hoàn",
      width: 170,
      key: "return",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "orders.return") || 0}</div>;
      },
    },
    {
      title: "Tỷ lệ thành công",
      width: 170,
      key: "percent_success",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="text-[#10B981]">
            {get(record, "percent_success") || 0}%
          </div>
        );
      },
    },
    {
      title: "Tỷ lệ hoàn",
      width: 170,
      key: "percent_return",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="text-[#EF4444]">
            {get(record, "percent_return") || 0}%
          </div>
        );
      },
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

  const colors: any[] = ["#10B981", "#0EA5E9", "#EF4444", "#6366F1", "#DADADD"];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo vận chuyển" />
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
                  pageSize: pagination.pageSize || 20,
                });
                handleSearchByDate(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex item-center justify-between mt-[18px]">
        <Select
          placeholder="Chọn loại report"
          style={{ width: 248 }}
          options={optionReport}
          onChange={(e) => {
            setTypeReport(e);
          }}
          value={typeReport}
        />
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kênh</div>
            <Select
              onChange={(e) => {
                setPagination({
                  ...pagination,
                  page: pagination.page || 1,
                  pageSize: pagination.pageSize || 10,
                });
                setChannel(e);
              }}
              options={channelOptions}
              width={248}
              value={channel}
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
          columns={typeReport === "province" ? columnProvince : columnTransport}
          dataSource={[...data]}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100],
          }}
          onChange={(e) => {
            console.log(e);
            setPagination({
              ...pagination,
              page: e.current || 1,
              pageSize: e.pageSize || 20,
            });
          }}
        />
      </div>
      {typeReport !== "province" && (
        <div className="flex flex-row justity-between mt-[24px] gap-[11px]">
          <div className="w-full flex-1 w-full flex bg-[#FFFFFF] p-[16px] flex-col">
            <div className="flex items-center justify-between mb-[12px] w-full">
              <div className="text-[#384ADC] font-semibold">
                Tổng đơn hàng đã tạo
              </div>
              <div>
                <span className="text-2xl font-bold">
                  {overview?.total_orders || 0}
                </span>{" "}
                Đơn hàng
              </div>
            </div>
            <div className="flex gap-[24px] items-center justify-between">
              {isArray(pieData) && (
                <PieChart colors={colors} data={[...pieData]} />
              )}
              <div className="w-full">
                {isArray(pieData) &&
                  pieData.map((item: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between flex-1 mb-[16px]"
                    >
                      <div className="flex items-center gap-[12px]">
                        <div className="font-bold" style={{ width: 51 }}>
                          {(
                            (item.value / overview?.total_orders) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                        <div
                          className={classNames(
                            styles.square,
                            `bg-[${colors[index % 5]}]`
                          )}
                        />
                        <div className="font-medium">{item.name}</div>
                      </div>
                      <div className="font-bold">{item.value}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            style={{ width: 309 }}
            className="flex flex-col bg-[#FFFFFF] p-[16px] items-between"
          >
            <div>
              <div className="text-[#10B981] font-medium text-sm mb-[16px]">
                Đơn giao thành công
              </div>
              <div className="text-[#10B981] font-bold text-2xl	mb-[16px]">
                {overview?.pickup_received || 0}
              </div>
              <div className={styles.percent_success_bar}>
                <div
                  style={{
                    width: `${
                      ((overview?.pickup_received || 0) /
                        overview?.total_orders) *
                      100
                    }%`,
                  }}
                  className={styles.percent_success}
                ></div>
              </div>
              <div className="mb-[16px]">
                <span className="font-semibold">
                  {overview?.total_orders || 0}
                </span>{" "}
                đơn hàng
              </div>
            </div>
            <div>
              {data.map((item, index) => (
                <div
                  className="flex items-center mb-[16px] justify-between w-full"
                  key={index}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="font-bold">
                    {get(item, "orders.pickup_received")}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{ width: 309 }}
            className="flex flex-col bg-[#FFFFFF] p-[16px] items-between"
          >
            <div>
              <div className="text-[#EF4444] font-medium text-sm mb-[16px]">
                Tỷ lệ hoàn
              </div>
              <div className="text-[#EF4444] font-bold text-2xl	mb-[16px]">
                {(
                  ((overview?.pickup_return || 0) /
                    (overview?.total_orders || 1)) *
                  100
                ).toFixed(2) || 0}
                %
              </div>
              <div className={styles.percent_return_bar}>
                <div
                  style={{
                    width: `${
                      ((overview?.pickup_return || 0) /
                        (overview?.total_orders || 1)) *
                      100
                    }%`,
                  }}
                  className={styles.percent_return}
                ></div>
              </div>
              <div className="mb-[16px]">
                <span className="font-semibold">
                  {overview?.total_orders || 0}
                </span>{" "}
                đơn hàng
              </div>
            </div>
            <div>
              {data.map((item, index) => (
                <div
                  className="flex items-center mb-[16px] justify-between w-full"
                  key={index}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="font-bold">{get(item, "orders.return")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<ReportTransport />, document.getElementById("root"));
