/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox } from "antd";
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
import Select from "../../../components/Select/Select";
import ReportRevenuaApi from "../../../services/report/report-revenue";
import WarehouseApi from "../../../services/warehouses";
import ReportOrderApi from "../../../services/report/report-order";
import ModalConfig from "../ModalConfig/ModalConfig.tsx";

const ReportRevenue = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("ALL");
  const [reportOrder, setReportOrder] = useState<any>([]);
  const [selectdWarehouse, setSelectWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);

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
  ];
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<any>({});

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
    getReportOrder();
  }, [filter, pagination.page, pagination.pageSize, channel]);

  const getReportOrder = async () => {
    setLoading(true);
    const { data } = await ReportOrderApi.reportOrder({
      ...filter,
      ...pagination,
      channel: channel,
    });
    setReportOrder(data);
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
          label: "T???t c???",
          value: "",
        },
      ].concat(listWarehouseManagement)
    );
  };

  const colData = Array(50)
  .fill({
    name: "Tran Huyen",
    assume: {
      total_order_lock: 10,
      total_revenue: 10000,
      total_item_price: 45000,
      total_transfer: 24000,
      total_discount: 23000,
      total_transport_fee: 154000,
      total_items: 200,
    },
    assume_by_status: {
      order_sended: 20,
      order_canceled: 30,
      pickup_received: 50,
      order_return_partial: 35,
      order_return: 46,
      order_pickup_received: 20,
      order_pickup_sent: 60,
    },
  })
  .map((item, index) => ({...item, id: index++}))

  const columns: ColumnsType<any> = [
    {
      title: "T??n nh??n vi??n",
      width: 400,
      key: "name",
      align: "center",
      render: (_, record) => {
        return (
          <div className="text-[#384ADC] font-semibold">{record.name}</div>
        );
      },
    },
    {
      title: "S??? l?????ng",
      align: "center",
      children: [
        {
          title: "????n ch???t",
          dataIndex: "total_order_lock",
          key: "total_order_lock",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume.total_order_lock")}</div>;
          },
          sorter: (a, b) =>
            a.assume?.total_order_lock - b.assume?.total_order_lock,
        },
        {
          title: "????n ???? g???i",
          dataIndex: "order_sended",
          key: "order_sended",
          width: 150,
          render: (_, record: any) => {
            return <div>{get(record, "assume_by_status.order_sended")}</div>;
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_sended - b.assume_by_status?.order_sended,
        },
        {
          title: "????n h???y",
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
        {
          title: "????n nh???n",
          dataIndex: "order_pickup_received",
          key: "order_pickup_received",
          width: 150,
          render: (_, record: any) => {
            return (
              <div>{get(record, "assume_by_status.order_pickup_received")}</div>
            );
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_pickup_received -
            b.assume_by_status?.order_pickup_received,
        },
        {
          title: "????n ho??n",
          dataIndex: "order_return",
          key: "order_return",
          width: 150,
          render: (_, record: any) => {
            return (
              <div>
                {get(record, "assume_by_status.order_return_partial") +
                  get(record, "assume_by_status.order_return")}
              </div>
            );
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_return_partial -
            b.assume_by_status?.order_return_partial,
        },
        {
          title: "????n ??ang giao",
          dataIndex: "order_pickup_sent",
          key: "order_pickup_sent",
          width: 150,
          render: (_, record: any) => {
            return (
              <div>{get(record, "assume_by_status.order_pickup_sent")}</div>
            );
          },
          sorter: (a, b) =>
            a.assume_by_status?.order_pickup_sent -
            b.assume_by_status?.order_pickup_sent,
        },
      ],
    },
    {
      title: "Doanh thu",
      width: 230,
      key: "revenue",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_revenue")) || 0
            ).toLocaleString() + "??"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_revenue - b.assume?.total_revenue,
    },
    {
      title: "Doanh s??? ti???n h??ng",
      width: 150,
      key: "item_price",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_item_price")) || 0
            ).toLocaleString() + "??"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_item_price - b.assume?.total_item_price,
    },
    {
      title: "Ti???n chuy???n kho???n",
      width: 230,
      key: "transfer",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_transfer")) || 0
            ).toLocaleString() + "??"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_transfer - b.assume?.total_transfer,
    },
    {
      title: "Ti???n chi???t kh???u",
      width: 230,
      key: "discount",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_discount")) || 0
            ).toLocaleString() + "??"}
          </div>
        );
      },
      sorter: (a, b) => a.assume?.total_discount - b.assume?.total_discount,
    },
    {
      title: "Ph?? v???n chuy???n",
      width: 230,
      key: "transport_fee",
      align: "center",
      render: (record: any) => {
        return (
          <div>
            {(
              parseFloat(get(record, "assume.total_transport_fee")) || 0
            ).toLocaleString() + "??"}
          </div>
        );
      },
      sorter: (a, b) =>
        a.assume?.total_transport_fee - b.assume?.total_transport_fee,
    },
    {
      title: "SL s???n ph???m",
      width: 230,
      key: "total_items",
      align: "center",
      render: (record: any) => {
        return <div>{parseFloat(get(record, "assume.total_items")) || 0}</div>;
      },
      sorter: (a, b) => a.assume?.total_items - b.assume?.total_items,
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
        <TitlePage title="B??o c??o ????n h??ng" />
        <div className="flex items-center gap-[24px] px-[12px]">
          {/* <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xu???t file
          </Button> */}
          <div className="flex items-center">
            <div className="text-medium font-semibold mr-[8px] min-w-fit">
              Hi???n th??? theo th???i gian
            </div>
            <InputRangePicker
              placeholder={["Ng??y b???t ?????u", "Ng??y k???t th??c"]}
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
              So s??nh v???i
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
        <div className="gap-[12px] flex items-center">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Ch???n kho</div>
            <Select
              placeholder="Ch???n kho"
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
          <Button onClick={() => setShowModal(true)}>C???u h??nh</Button>
        </div>
      </div>
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <Table
          className="table__st1"
          rowKey={(record) => record.id}
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
          loading={loading}
          columns={columns}
          // dataSource={reportOrder}
          dataSource={colData}
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
              page: pagination.page || 1,
              pageSize: pagination.pageSize || 10,
            });
            window.history.replaceState(
              null,
              "",
              `?size=${e.pageSize}&page=${e.current}`
            );
          }}
        />
      </div>
      <ModalConfig onClose={() => setShowModal(false)} isVisible={showModal} />
    </div>
  );
};

export default ReportRevenue;