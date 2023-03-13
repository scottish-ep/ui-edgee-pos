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
import ReportRevenuaApi from "../../services/report/report-revenue";
import WarehouseApi from "../../services/warehouses";

const ReportRevenue = () => {
  const defaultTotal: any = {
    order_create: 0,
    order_confirmed: 0,
    order_stock_ok: 0,
    order_canceled: 0,
    order_print_waiting: 0,
    total_items: 0,
    total_revenue: 0,
    total_item_price: 0,
    total_debt_money: 0,
    total_transport_fee: 0,
    total_transfer: 0,
    total_discount: 0,
  };
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("ALL");
  const [reportOnline, setReportOnline] = useState<any>([]);
  const [reportOffline, setReportOffline] = useState<any>([]);
  const [selectdWarehouse, setSelectWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<any>([]);
  const [total, setTotal]: any = useState(defaultTotal);

  const channelOptions: any[] = [
    {
      label: "Online + In_app",
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
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});

  const [epenses, setEpenses] = useState<any[]>([]);

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
    if (channel === "OFFLINE") {
      getReportOffline();
    } else {
      getReportOnline();
    }
  }, [filter, pagination.page, pagination.pageSize, channel]);

  const getReportOffline = async () => {
    setLoading(true);
    const { data } = await ReportRevenuaApi.revenueOverviewOffline({
      ...filter,
      ...pagination,
      channel: channel,
    });
    setReportOffline(data);
    setLoading(false);
  };

  const getReportOnline = async () => {
    setLoading(true);
    const { data } = await ReportRevenuaApi.revenueOverviewOnline({
      ...filter,
      ...pagination,
      channel: channel,
    });
    if (data) {
      let rawTotal: any = defaultTotal;
      isArray(data) &&
        data.map((item) => {
          rawTotal.order_create += item.assume_by_status.order_create || 0;
          rawTotal.order_confirmed +=
            item.assume_by_status.order_confirmed || 0;
          rawTotal.order_stock_ok += item.assume_by_status.order_stock_ok || 0;
          rawTotal.order_canceled += item.assume_by_status.order_canceled || 0;
          rawTotal.order_print_waiting +=
            item.assume_by_status.order_print_waiting || 0;
          rawTotal.total_items +=
            get(item, "assume_by_status.item_order_confirmed") ||
            0 + get(item, "assume_by_status.item_order_stock_ok") ||
            0 + get(item, "assume_by_status.item_order_print_waiting") ||
            0;
          rawTotal.total_revenue +=
            parseFloat(get(item, "assume.total_revenue")) || 0;
          rawTotal.total_item_price +=
            parseFloat(get(item, "assume.total_item_price")) || 0;
          rawTotal.total_debt_money +=
            parseFloat(get(item, "assume.total_debt")) || 0;
          rawTotal.total_transport_fee =
            parseFloat(get(item, "assume.total_transport_fee")) || 0;
          rawTotal.total_transfer +=
            parseFloat(get(item, "assume.total_transfer")) || 0;
          rawTotal.total_discount +=
            parseFloat(get(item, "assume.total_discount")) || 0;
        });
      setTotal(rawTotal);
    }
    setReportOnline(data);
    setLoading(false);
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

  const columnsOnline: ColumnsType<any> = [
    {
      title: "Tên nhân viên",
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
      title: "Đơn",
      align: "center",
      children: [
        {
          title: "Tạo",
          dataIndex: "order_create",
          key: "order_create",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_create")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_create - b.assume_by_status?.order_create,
        },
        {
          title: "Xác nhận",
          dataIndex: "order_confirmed",
          key: "order_confirmed",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_confirmed")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_confirmed -
            b.assume_by_status?.order_confirmed,
        },
        {
          title: "Đã đủ hàng",
          dataIndex: "order_confirmed",
          key: "order_confirmed",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_stock_ok")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_stock_ok -
            b.assume_by_status?.order_stock_ok,
        },
        {
          title: "Đã xử lý",
          dataIndex: "order_confirmed",
          key: "order_confirmed",
          width: 150,
          render: (_, record: any) => {
            return (
              <div>{get(record, "assume_by_status.order_print_waiting")}</div>
            );
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_print_waiting -
            b.assume_by_status?.order_print_waiting,
        },
        {
          title: "Hủy",
          dataIndex: "order_canceled",
          key: "order_canceled",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_canceled")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_canceled -
            b.assume_by_status?.order_canceled,
        },
      ],
    },
    {
      title: "Số lượng sản phẩm",
      align: "center",
      dataIndex: "item_order_confirmed",
      key: "item_order_confirmed",
      width: 150,
      render: (_, record: any) => {
        const quantity =
          parseFloat(
            get(record, "assume_by_status.item_order_confirmed") || 0
          ) +
          parseFloat(get(record, "assume_by_status.item_order_stock_ok") || 0) +
          parseFloat(
            get(record, "assume_by_status.item_order_print_waiting") || 0
          ) +
          parseFloat(
            get(record, "assume_by_status.item_order_pickup_received") || 0
          ) +
          parseFloat(
            get(record, "assume_by_status.item_order_pickup_returning") || 0
          ) +
          parseFloat(
            get(record, "assume_by_status.item_order_pickup_sent") || 0
          ) +
          parseFloat(get(record, "assume_by_status.item_order_print_ok") || 0) +
          parseFloat(
            get(record, "assume_by_status.item_order_return_partial") || 0
          );
        return <div>{quantity}</div>;
      },
    },
    {
      title: "Doanh số",
      width: 230,
      key: "revenue",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_revenue")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_revenue - b.assume?.total_revenue,
    },
    {
      title: "Tiền hàng",
      width: 150,
      key: "item_price",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_item_price")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_item_price - b.assume?.total_item_price,
    },
    {
      title: "Tiền nợ khách",
      width: 150,
      key: "debt",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_debt")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_debt - b.assume?.total_debt,
    },
    {
      title: "Tiền chuyển khoản",
      width: 230,
      key: "transfer",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_transfer")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_transfer - b.assume?.total_transfer,
    },
    {
      title: "Phí vận chuyển thu khách",
      width: 230,
      key: "transport_fee",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_transport_fee")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) =>
        a.assume?.total_transport_fee - b.assume?.total_transport_fee,
    },
    {
      title: "Tiền chiết khấu",
      width: 230,
      key: "discount",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_discount")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_discount - b.assume?.total_discount,
    },
  ];

  const columnsOffline: ColumnsType<any> = [
    {
      title: "Tên nhân viên",
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
      title: "Đơn",
      align: "center",
      children: [
        {
          title: "Tạo",
          dataIndex: "order_init",
          key: "order_init",
          width: 95,
          render: (_, record: any) => {
            return <div>{get(record, "assume.total_order")}</div>;
          },
          sorter: (a, b) => a.assume?.total_order - b.assume?.total_order,
        },
        {
          title: "Hủy",
          dataIndex: "order_canceled",
          key: "order_canceled",
          width: 95,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_canceled")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_canceled -
            b.assume_by_status?.order_canceled,
        },
      ],
    },
    {
      title: "Doanh Thu bán ra",
      width: 220,
      key: "revenue",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_revenue")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_revenue - b.assume?.total_revenue,
    },
    {
      title: "Tiền Khách Đưa",
      width: 160,
      key: "cod",
      align: "center",
      render: (_, record: any) => {
        return <div>{get(record, "assume.total_cod")}</div>;
      },
      sorter: (a, b) => a.assume?.total_cod - b.assume?.total_cod,
    },
    {
      title: "Doanh Thu Tiền mặt",
      width: 220,
      key: "revenue_cod",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_revenue_cod")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) =>
        a.assume?.total_revenue_cod - b.assume?.total_revenue_cod,
    },
    {
      title: "Chiết Khấu",
      width: 160,
      key: "discount",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_discount")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_discount - b.assume?.total_discount,
    },
    {
      title: "Tiền nợ khách",
      width: 160,
      key: "debt",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_debt")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_debt - b.assume?.total_debt,
    },
    {
      title: "Tiền Chuyển Khoản",
      width: 160,
      key: "transfer",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_transfer")) || 0
            ).toLocaleString() + "đ"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_transfer - b.assume?.total_transfer,
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
        <TitlePage title="Báo cáo doanh số" />
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
      <div className="flex item-center justify-between mt-[18px]">
        <div>
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
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <Table
          className="table__st1"
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
          loading={loading}
          columns={
            channel === "OFFLINE" ? [...columnsOffline] : [...columnsOnline]
          }
          dataSource={
            channel === "OFFLINE" ? [...reportOffline] : [...reportOnline]
          }
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
        {channel != "OFFLINE" && (
          <div
            className={classNames("flex items-center", styles.total_wrapper)}
          >
            <div className={styles.row_total}>
              Đơn tạo:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.order_create ? total.order_create : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Đơn xác nhận:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.order_confirmed ? total.order_confirmed : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Đơn đã đủ hàng:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.order_stock_ok ? total.order_stock_ok : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Đơn đã xử lý:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.order_print_waiting ? total.order_print_waiting : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Đơn huỷ:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.order_canceled ? total.order_canceled : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Số lượng sản phẩm:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_items ? total.total_items : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Doanh số:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_revenue
                  ? parseFloat(total.total_revenue || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Tiền hàng:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_item_price
                  ? parseFloat(total.total_item_price || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Tiền nợ khách:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_debt_money
                  ? parseFloat(total.total_debt_money || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Tiền chuyển khoản:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_transfer
                  ? parseFloat(total.total_transfer || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Phí vận chuyển:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_transport_fee
                  ? parseFloat(total.total_transport_fee || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
            <div className={styles.row_total}>
              Tiền chiết khấu:
              <span className="font-medium text-[#384ADC]">
                {" "}
                {total.total_discount
                  ? parseFloat(total.total_discount || 0).toLocaleString()
                  : "--"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<ReportRevenue />, document.getElementById("root"));
