import React from "react";
import classNames from "classnames";

import styles from "../../../../styles/Report.module.css";
import Icon from "../../../../components/Icon/Icon";
import PieChart from "../../../../components/Chart/PieChart";
import TitlePage from "../../../../components/TitlePage/Titlepage";
import Select from "../../../../components/Select/Select";
import LineChart from "../../../../components/Chart/LineChart";
import { randomColor } from "../../../../utils/utils";

interface LineChartProps {
  data: any[];
  dataLineChart: any[];
  title?: string;
  statusOrder?: any[];
  unit?: string;
  warehouses?: any[];
  keys?: any[];
  selectedStatusOrder?: string;
  onChangeWarehouse?: (value: any) => void;
  onChangeStatus?: (value: any) => void;
}

const ReportLineChart = (props: LineChartProps) => {
  const {
    title,
    data,
    dataLineChart,
    statusOrder,
    unit,
    warehouses,
    keys,
    onChangeWarehouse,
    selectedStatusOrder,
    onChangeStatus,
    ...rest
  } = props;

  const renderWareHouse = (data: any[]) => {
    return data.map((item, index) => {
      return (
        <div
          className={classNames(styles.total_wrapper, styles.gray)}
          style={{ width: 205 }}
          key={index}
        >
          <div
            className={styles.line_wrapper}
            style={{ backgroundColor: `#` + randomColor() }}
          />
          <div className="font-semibold">{item.name}</div>
          <div className="flex items-center gap-[12px]">
            <div className="font-semibold">
              {(item?.valueReport && item?.valueReport.toLocaleString()) || 0}{" "}
              {unit === "triệu đồng" && "đ"}
            </div>
            {/* <div className="flex items-center">
              <Icon icon="up" color="#10B981" />
              <div
                className={classNames(
                  styles.percent,
                  styles.increase,
                  "ml-[4px]"
                )}
              >
                13.5%
              </div>
            </div> */}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.div_container}>
      <div className="flex items-center justify-between mb-[24px] flex-wrap">
        <div className="text-[#384ADC] font-semibold text-big">{title}</div>
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center">
            <div className="mr-[12px]">Chọn kho</div>
            <Select
              options={warehouses}
              style={{ width: 248 }}
              onChange={onChangeWarehouse}
            />
          </div>
          {statusOrder && (
            <div className="flex items-center">
              <div className="mr-[12px]">Trạng thái đơn hàng</div>
              <Select
                value={selectedStatusOrder}
                options={statusOrder}
                style={{ width: 248 }}
                onChange={onChangeStatus}
              />
            </div>
          )}
          {/*<span className="cursor-pointer">
            <Icon icon="export" />
          </span>*/}
        </div>
      </div>
      <div className="flex justify-center gap-[20px] mb-[24px]">
        <div className={styles.wrapper_list_warehouse}>
          {renderWareHouse(data)}
        </div>
      </div>
      <LineChart keys={keys} data={dataLineChart} width="100%" />
      <div className="flex justify-end text-medium font-medium">
        Đơn vị: {unit}
      </div>
    </div>
  );
};

export default ReportLineChart;
