/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../components/Button/Button";
import DatePicker from "../../components/DatePicker/DatePicker";
import Icon from "../../components/Icon/Icon";
import Select from "../../components/Select/Select";
import TitlePage from "../../components/TitlePage/Titlepage";
import { listDayCompare } from "../../const/constant";
import classNames from "classnames";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";

import styles from "../../styles/Report.module.css";
import ReportPieChart from "./ReportChart/PieChart/ReportPieChart";
import LineChart from "./ReportChart/LineChart/ReportLineChart";
import ReportRevenuaApi from "../../services/report/report-revenua";
import WarehouseApi from "../../services/warehouses";
import { isArray } from "../../utils/utils";
import ReporLevelCustomertPieChart from "./ReportChart/PieChart/ReporLevelCustomertPieChart";

const ReportIncome = () => {
  const [isCompare, setIsCompare] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [revenueOverview, setRevenueOverview] = useState<any>({
    totalRevenue: 0,
    totalProfit: 0,
    totalDiscount: 0,
  });
  const [revenueByPaymentMethod, setRevenueByPaymentMethod] = useState<any>({
    total_transfer: 0,
    total_pay: 0,
  });
  const [revenueByOrderStatus, setRevenueByOrderStatus] = useState<any>({
    revenueOrderSuccess: 0,
    revenueOrderReturn: 0,
    revenueOrderCanceled: 0,
  });
  const [revenueByOrderByChannel, setRevenueByOrderByChannel] = useState<any[]>(
    [
      { name: "Tại quầy", value: 0 },
      { name: "Onine", value: 0 },
      { name: "Trên app", value: 0 },
    ]
  );

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
  const [transactionByWarehouse, setTransactionByWarehouse] = useState<any[]>(
    []
  );
  const [customerLevel, setCustomerLevel] = useState<any[]>([]);
  const [debtOverview, setDebtOverview] = useState<any[]>([]);

  useEffect(() => {
    getRevenueOverview();
    getRevenueByPaymentMethod();
    getRevenueByOrderStatus();
    getRevenueByChannel();
    getCustomerByLevel();
    getDataDebtOverview();
  }, [filter]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getTransactionByWarehouse();
  }, []);

  const getCustomerByLevel = async () => {
    const data = await ReportRevenuaApi.getCustomerByLevel(filter);
    let rawData: any[] = [];
    isArray(data) &&
      data.map((item: any) => {
        rawData.push({
          name: item.name,
          value: item.customer_count ? item.customer_count : 0,
          id: item.id,
          color: item.color,
        });
      });
    setCustomerLevel(rawData);
  };

  const getRevenueOverview = async () => {
    const data = await ReportRevenuaApi.getRevenueOverview(filter);
    setRevenueOverview(data);
  };
  const getRevenueByPaymentMethod = async () => {
    const data = await ReportRevenuaApi.getRevenueByPaymentMethod(filter);
    setRevenueByPaymentMethod(data);
  };
  const getRevenueByOrderStatus = async () => {
    const data = await ReportRevenuaApi.getRevenueByOrderStatus(filter);
    setRevenueByOrderStatus(data);
  };
  const getRevenueByChannel = async () => {
    const data = await ReportRevenuaApi.getRevenueByChannel(filter);
    let newRevenueByOrderByChannel = [
      { name: "Tại quầy", value: parseFloat(data.offline) },
      { name: "Onine", value: parseFloat(data.online) },
      { name: "Trên app", value: parseFloat(data.in_app) },
    ];
    setRevenueByOrderByChannel(newRevenueByOrderByChannel);
  };

  const getDataDebtOverview = async () => {
    const data = await ReportRevenuaApi.getDebtOverview(filter);
    if (data) {
      let newDebtOverview = [
        {
          name: "Tổng số tiền",
          value: parseFloat(data.totalMoney),
          id: 1,
          color: "#404FCC",
        },
        {
          name: "Tổng số tiền đã xử lý",
          value: parseFloat(data.totalMoneyReduce),
          id: 2,
          color: "#FF6E3A",
        },
        {
          name: "Tổng số tiền cần xử lý",
          value: parseFloat(data.totalMoneyNeedReduce),
          id: 3,
          color: "#FFCD3E",
        },
      ];
      console.log("newDebtOverview", newDebtOverview);
      setDebtOverview(newDebtOverview);
    }
  };

  const getTransactionByWarehouse = async () => {
    const data = await ReportRevenuaApi.getTransactionByWarehouse();
    if (data) {
      setTransactionByWarehouse(data.reportRevenueByWarehouse);
      const listWarehouse =
        isArray(data.warehouseTotalRevenue) &&
        data.warehouseTotalRevenue.map((item) => ({
          ...item,
          value: item.id,
          label: item.name,
          valueReport: item.totalRevenue,
        }));
      setWarehouse(listWarehouse);
      setSelectWarehouses(listWarehouse);
    }
  };

  const handleOnChangeWarehouse = (e) => {
    const newSelectedWarehouses = warehouses.filter((item) => item.id == e);
    newSelectedWarehouses && setSelectWarehouses(newSelectedWarehouses);
  };

  return (
    <div className="w-full">
      {/* <iframe
        src={
          "https://redash-staging.eastplayers.io/public/dashboards/yqu93LxCGrMcYzoy77sSPMfnyTDcTIMF5lUttFMu?org_slug=default&p_from_date=2022-10-31&p_to_date=2022-12-05&p_w6_status=%C4%90%C3%A3%20in&p_w6_warehouse_name=Kho%20ch%C3%ADnh&p_w8_warehouse_name=Kho%20ch%C3%ADnh"
        }
        width={"100%"}
        height={"100%"}
      /> */}
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Báo cáo tổng quan" />
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
          <div className={classNames(styles.div_container, "h-1/2")}>
            <div className={styles.row}>
              <div className="text-big text-[#384ADC] font-semibold">
                Tổng doanh thu
              </div>
              <div className={classNames(styles.row, "w-1/2 gap-[24px]")}>
                <div className="text-[#384ADC] text-2xl font-bold">
                  {(revenueOverview?.totalRevenue &&
                    parseFloat(
                      revenueOverview.totalRevenue || 0
                    ).toLocaleString()) ||
                    0}
                  đ
                </div>
                {/* <div className="flex items-center">
                  <Icon icon="up" color="#10B981" />
                  <div className={classNames(styles.percent, styles.increase)}>
                    13.5%
                  </div>
                </div> */}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Lợi nhuận</div>
              <div className={classNames(styles.row, "w-1/2 gap-[24px]")}>
                <div className="text-[#10B981] text-2xl font-bold">
                  {(revenueOverview?.totalProfit &&
                    parseFloat(
                      revenueOverview.totalProfit || 0
                    ).toLocaleString()) ||
                    0}
                  đ
                </div>
                {isCompare && (
                  <div className="flex items-center">
                    <Icon icon="down" color="#EF4444" />
                    <div className={classNames(styles.percent, styles.reduce)}>
                      13.5%
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Tiền khuyến mãi</div>
              <div className={classNames(styles.row, "w-1/2 gap-[24px]")}>
                <div className="text-[#F97316] text-big font-bold">
                  {(revenueOverview?.totalDiscount &&
                    parseFloat(
                      revenueOverview.totalDiscount || 0
                    ).toLocaleString()) ||
                    0}
                  đ
                </div>
                {/* <div className="flex items-center">
                  <Icon icon="down" color="#EF4444" />
                  <div className={classNames(styles.percent, styles.reduce)}>
                    13.5%
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className={classNames(styles.div_container, "h-1/2")}>
            <div className={styles.row}>
              <div className="text-big text-[#384ADC] font-semibold">
                Phương thức thanh toán
              </div>
              <Icon icon="export" />
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Chuyển khoản</div>
              <div className={classNames(styles.row, "w-1/2 gap-[24px]")}>
                <div className="font-semibold">
                  {(revenueByPaymentMethod?.total_transfer &&
                    parseFloat(
                      revenueByPaymentMethod.total_transfer
                    ).toLocaleString()) ||
                    0}
                  đ
                </div>
                {/* <div className="flex items-center">
                  <span className="cursor-pointer">
                    <Icon icon="down" color="#EF4444" />
                  </span>
                  <div className={classNames(styles.percent, styles.reduce)}>
                    13.5%
                  </div>
                </div> */}
              </div>
            </div>
            <div className={styles.row}>
              <div className="font-semibold">Tiền mặt</div>
              <div className={classNames(styles.row, "w-1/2 gap-[24px]")}>
                <div className="font-semibold">
                  {(revenueByPaymentMethod?.total_pay &&
                    parseFloat(
                      revenueByPaymentMethod.total_pay || 0
                    ).toLocaleString()) ||
                    0}
                  đ
                </div>
                {/* <div className="flex items-center">
                  <Icon icon="down" color="#EF4444" />
                  <div className={classNames(styles.percent, styles.reduce)}>
                    13.5%
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <ReportPieChart
          unit="đ"
          title="Doanh thu theo kênh bán"
          data={revenueByOrderByChannel}
        />
      </div>
      <div className="flex gap-[12px] mb-[12px]">
        <ReporLevelCustomertPieChart
          title="Khách hàng theo cấp bậc"
          data={customerLevel}
        />
        <ReporLevelCustomertPieChart
          unit="đ"
          title="Tổng quan công nợ"
          data={debtOverview}
        />
      </div>
      <div className={classNames(styles.div_container, "mb-[12px]")}>
        <div className={styles.row}>
          <div className="text-big text-[#384ADC] font-semibold">
            Doanh thu theo đơn hàng
          </div>
          <span className="cursor-pointer">
            <Icon icon="export" />
          </span>
        </div>
        <div className="flex gap-[16px] justify-between">
          <div
            className={classNames(styles.total_wrapper, styles.green, "w-1/3")}
          >
            <Icon icon="checked-approved" size={36} />
            <div className="text-big font-semibold text-[#10B981] text-center">
              TỔNG GIÁ TRỊ CÁC ĐƠN HÀNG <br />
              THÀNH CÔNG
            </div>
            <div className="font-bold text-big">
              {(revenueByOrderStatus?.revenueOrderSuccess &&
                parseFloat(
                  revenueByOrderStatus.revenueOrderSuccess
                ).toLocaleString()) ||
                0}
              đ
            </div>
          </div>
          <div
            className={classNames(styles.total_wrapper, styles.orange, "w-1/3")}
          >
            <Icon icon="back-square" size={36} />
            <div className="text-big font-semibold text-[#F97316] text-center">
              TỔNG GIÁ TRỊ CỦA CÁC ĐƠN <br />
              ĐÃ HOÀN
            </div>
            <div className="font-bold text-big">
              {(revenueByOrderStatus?.revenueOrderReturn &&
                parseFloat(
                  revenueByOrderStatus.revenueOrderReturn
                ).toLocaleString()) ||
                0}
              đ
            </div>
          </div>
          <div
            className={classNames(styles.total_wrapper, styles.red, "w-1/3")}
          >
            <Icon icon="close-circle-1" size={36} />
            <div className="text-big font-semibold text-[#EF4444] text-center">
              TỔNG GIÁ TRỊ CỦA CÁC ĐƠN <br />
              ĐÃ HUỶ
            </div>
            <div className="font-bold text-big">
              {(revenueByOrderStatus?.revenueOrderCanceled &&
                parseFloat(
                  revenueByOrderStatus.revenueOrderCanceled
                ).toLocaleString()) ||
                0}
              đ
            </div>
          </div>
        </div>
      </div>
      <LineChart
        onChangeWarehouse={(e) => handleOnChangeWarehouse(e)}
        keys={selectedWarehouses.map((item: any) => item.name)}
        warehouses={warehouses}
        title="Doanh thu theo kho"
        dataLineChart={transactionByWarehouse}
        data={warehouses}
        unit="triệu đồng"
      />
    </div>
  );
};

ReactDOM.render(<ReportIncome />, document.getElementById("root"));
