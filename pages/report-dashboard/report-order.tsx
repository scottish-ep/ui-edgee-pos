/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Table } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../components/Button/Button";
import DatePicker from "../../components/DatePicker/DatePicker";
import ModalConfig from "./Modal/ModalConfig";
import Icon from "../../components/Icon/Icon";
import Select from "../../components/Select/Select";
import TitlePage from "../../components/TitlePage/Titlepage";
import { listDayCompare } from "../../const/constant";
import classNames from "classnames";
import type { ColumnsType } from "antd/es/table";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";

import styles from "../../styles/Report.module.css";
import ReportPieChart from "./ReportChart/PieChart/ReportPieChart";
import LineChart from "./ReportChart/LineChart/ReportLineChart";
import { IOrder, IStaff } from "./report.type";
import WarehouseApi from "../../services/warehouses";
import ReportOrderApi from "../../services/report/report-order";
import { OrderStatusEnum } from "../../enums/enums";
import { isArray } from "lodash";
import ReportStaffApi from "../../services/report/report-staff";

const ReportOrder = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [isCompare, setIsCompare] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [revenueOverview, setRevenueOverview] = useState<any>({});
  const [isShowModalConfig, setIsShowModalConfig] = useState(true)
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
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
  const [orderInfor, setOrderInfor] = useState<any>({
    totalOrderCreated: 0,
    totalOrderReturn: 0,
    totalOrderCanceled: 0,
    totalOrderSuccess: 0,
    revenueOrderSuccess: 0,
  });
  const [orderByChannels, setOrderByChannels] = useState<any>([
    { name: "Tại quầy", value: 0 },
    { name: "Onine", value: 0 },
    { name: "Trên app", value: 0 },
  ]);
  const [orderPercentage, setorderPercentage] = useState<any>({
    success: 100,
    return: 0,
  });

  // Staff report
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [paginationStaff, setPaginationStaff] = useState(defaultPagination);
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

  // Order report
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [paginationOrder, setPaginationOrder] = useState(defaultPagination);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderChannelOptions, setOrderChannelOptions] = useState<any[]>([
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Online",
      value: 1,
    },
    {
      label: "Tại quầy",
      value: 2,
    },
    {
      label: "In app",
      value: 3,
    },
  ]);
  const [selectedOrderChannel, setSelectedOrderChannel] = useState("");

  useEffect(() => {
    getReportOrderOverview();
  }, [filter]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getTotalOrderByWarehouse();
  }, [selectedStatusOrder]);

  useEffect(() => {
    setLoadingStaff(true);
    getDataStaffSaleOrder();
  }, [selectedOrderType]);

  useEffect(() => {
    setLoadingOrder(true);
    getDataOrderByChannels();
  }, [selectedOrderChannel, filter.to, filter.from]);

  const getReportOrderOverview = async () => {
    const data = await ReportOrderApi.orderOverview(filter);
    if (data) {
      setOrderInfor(data.orderInfor);
      setorderPercentage(data.orderPercentage);
      setOrderByChannels([
        { name: "Tại quầy", value: parseFloat(data.orderByChannels.offline) },
        { name: "Onine", value: parseFloat(data.orderByChannels.online) },
        { name: "Trên app", value: parseFloat(data.orderByChannels.in_app) },
      ]);
    }
    setRevenueOverview(data);
  };

  const getTotalOrderByWarehouse = async () => {
    const data = await ReportOrderApi.totalOrderByWarehouse({
      status: selectedStatusOrder,
    });
    if (data) {
      setReportProductSalgeByWarehouse(data.reportTotalOrderByWarehouse);
      const listWarehouse =
        isArray(data.warehouseTotalOrder) &&
        data.warehouseTotalOrder.map((item: any) => ({
          ...item,
          value: item.id,
          valueReport: item.totalOrder,
          label: item.name,
        }));
      setWarehouse(listWarehouse);
      setSelectWarehouses(listWarehouse);
    }
  };

  const getDataStaffSaleOrder = async () => {
    const { data, totalOrders, totalPage } =
      await ReportStaffApi.getStaffSaleOrder({
        order_type: selectedOrderType,
      });
    setStaffs(data);
    setPaginationStaff({
      ...paginationStaff,
      total: totalOrders,
    });
    setLoadingStaff(false);
  };

  const getDataOrderByChannels = async () => {
    const { data, totalOrders, totalPage } =
      await ReportOrderApi.getOrderByChannel({
        order_type: selectedOrderChannel,
        from: filter.from,
        to: filter.to,
      });
    setOrders(data);
    setPaginationOrder({
      ...paginationOrder,
      total: totalOrders,
    });
    setLoadingOrder(false);
  };

  const handleOnChangeWarehouse = (e: any) => {
    const newSelectedWarehouses = warehouses.filter((item: any) => item.id == e);
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

  const staffColumns: ColumnsType<IStaff> = [
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
      sorter: (a: any, b: any) =>
        a.orders_sum_item_skus - b.orders_sum_item_skus,
      align: "center",
      render: (_, record: any) => {
        return <div className="font-medium">{record.orders_sum_item_skus}</div>;
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

  const orderColumns: ColumnsType<any> = [
    {
      title: "Phí vận chuyển",
      width: 133,
      key: "transfer_fee",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {parseFloat(record.transfer_fee || 0).toLocaleString()}
          </div>
        );
      },
    },
    {
      title: "Tiền mặt",
      width: 133,
      key: "cod",
      align: "center",
      render: (_, record: any) => {
        let totalCOD = 0;
        if (record.order_type == 2) {
          totalCOD += parseFloat(record.total_pay || 0);
        } else {
          totalCOD =
            parseFloat(record.total_order_value || 0) -
            parseFloat(record.total_transfer || 0);
        }
        return <div className="font-medium">{totalCOD.toLocaleString()}</div>;
      },
    },
    {
      title: "Chiết khấu",
      width: 133,
      key: "discounrPrice",
      align: "center",
      render: (_, record: any) => {
        let discounrPrice = 0;
        if (parseFloat(record.total_prepaid) > 0) {
          discounrPrice = parseFloat(record.total_prepaid);
        } else if (parseFloat(record.total_prepaid_percent)) {
          discounrPrice =
            (parseFloat(record.total_product_cost) / 100) *
            parseFloat(record.total_prepaid_percent);
        }
        return (
          <div className="font-medium">{discounrPrice.toLocaleString()}</div>
        );
      },
    },
    {
      title: "Doanh thu",
      width: 133,
      key: "discounrPrice",
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="font-medium">
            {parseFloat(record.total_order_value || 0).toLocaleString()}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo doanh thu" />
        <div className="flex items-center gap-[24px]">
          {/* <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button> */}
          <div className="flex items-center">
            <div className="text-medium font-semibold mr-[8px]">
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
          <div className={classNames(styles.div_container, "flex-1")}>
            <div className={styles.row}>
              <div className="text-big text-[#384ADC] font-semibold">
                Tổng đơn hàng đã tạo
              </div>
              <div className="text-2xl font-bold">
                {orderInfor.totalOrderCreated}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Lợi nhuận</div>
              <div className="text-[#10B981] text-2xl font-bold">
                {(orderInfor.revenueOrderSuccess &&
                  orderInfor.revenueOrderSuccess.toLocaleString()) ||
                  0}
                đ
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Chuyển hoàn</div>
              <div className="text-[#F97316] text-big font-bold">
                {orderInfor.totalOrderReturn}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Đơn huỷ</div>
              <div className="text-[#EF4444] text-big font-bold">
                {orderInfor.totalOrderCanceled}
              </div>
            </div>
          </div>
          <div className={classNames(styles.div_container, "flex-1")}>
            <div className={styles.row}>
              <div className="text-big text-[#384ADC] font-semibold">
                Tỉ lệ đơn hàng
              </div>
              <div className="flex gap-[34px]">
                <div className="flex gap-[12px]">
                  <div className="text-[#10B981] font-semibold">Chốt đơn</div>
                  <div>{orderPercentage.success}%</div>
                </div>
                <div className="flex gap-[12px]">
                  <div className="text-[#8B5CF6] font-semibold">Đơn hoàn</div>
                  <div>{orderPercentage.return}%</div>
                </div>
              </div>
            </div>
            <div className={styles.column_percent}>
              <div
                style={{
                  width: `${orderPercentage.success}%`,
                  backgroundColor: "#10B981",
                  height: "100%",
                }}
              />
              <div
                style={{
                  width: `${orderPercentage.return}%`,
                  backgroundColor: "#8B5CF6",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
        <ReportPieChart title="Đơn hàng theo kênh bán" data={orderByChannels} />
      </div>
      <LineChart
        warehouses={warehouses}
        onChangeWarehouse={(e) => handleOnChangeWarehouse(e)}
        onChangeStatus={(e) => setSelectedStatusOrder(e)}
        selectedStatusOrder={selectedStatusOrder}
        keys={selectedWarehouses.map((item: any) => item.name)}
        statusOrder={statusOrder}
        dataLineChart={reportProductSalgeByWarehouse}
        data={warehouses}
        unit="đơn hàng"
      />
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
          loading={loadingStaff}
          className="table-layout2 table-has-total"
          columns={staffColumns}
          dataSource={[...staffs]}
          pagination={{
            position: ["bottomCenter"],
            total: paginationStaff.total,
            defaultPageSize: paginationStaff.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(e) => {
            setPaginationStaff({
              ...paginationStaff,
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
              const {
                orders_count,
                orders_sum_item_skus,
                orders_sum_total_cost,
              } = data;
              totalOrder = totalOrder + parseFloat(orders_count || 0);
              totalSaleOrder =
                totalSaleOrder + parseFloat(orders_sum_item_skus || 0);
              totalMoneyEarn =
                totalMoneyEarn + parseFloat(orders_sum_total_cost || 0);
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
      <div className={classNames(styles.div_container, "mt-[12px]")}>
        <div className="flex items-center justify-between mb-[24px] flex-wrap">
          <div className="text-[#384ADC] font-semibold text-big">
            Đơn hàng theo kênh bán
          </div>
          <div className="flex gap-[24px]">
            <div className="flex items-center">
              <div className="mr-[12px]">Chọn kênh</div>
              <Select
                options={orderChannelOptions}
                style={{ width: 248 }}
                value={selectedOrderChannel}
                onChange={(e) => {
                  setSelectedOrderChannel(e);
                }}
              />
            </div>
            <div className="flex items-center">
              <div className="text-medium font-semibold mr-[8px]">
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
          </div>
        </div>
        <Table
          loading={loadingOrder}
          className="table-layout2 table-has-total"
          columns={orderColumns}
          dataSource={[...orders]}
          pagination={{
            total: paginationOrder.total,
            defaultPageSize: paginationOrder.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(e) => {
            setPaginationOrder({
              ...paginationOrder,
              current: e.current || 1,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
          }}
        />
      </div>
      <ModalConfig
        title="Cấu hình"
        onClose={() => setIsShowModalConfig(false)}
        isVisible={isShowModalConfig}
        />
    </div>
  );
};

export default ReportOrder;
