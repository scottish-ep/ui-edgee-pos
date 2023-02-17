import React from "react";
import classNames from "classnames";

import styles from "../../../../styles/Report.module.css";
import Icon from "../../../../components/Icon/Icon";
import PieChart from "../../../../components/Chart/PieChart";
import { isArray } from "../../../../utils/utils";

interface ReportPieChartProps {
  title: string;
  data: any[];
  unit?: string;
}

const ReportPieChart = (props: ReportPieChartProps) => {
  const { title, data, unit = "", ...rest } = props;

  return (
    <div className={classNames("w-1/2", styles.div_container)}>
      <div className={styles.row}>
        <div className="text-big text-[#384ADC] font-semibold">{title}</div>
        <span className="cursor-pointer">{/*<Icon icon="export" />*/}</span>
      </div>
      <div className={styles.row}>
        <div className="flex-1" style={{ width: 210 }}>
          {isArray(data) && <PieChart data={[...data]} />}
        </div>
        <div className={classNames(styles.div_container)}>
          <div className={styles.row}>
            <div className="flex items-center">
              <div className={classNames(styles.block, "bg-[#404FCC]")} />
              <div className="font-medium ml-[12px]">Tại quầy</div>
            </div>
            <div className="font-semibold ml-[12px]">
              {isArray(data) &&
                parseFloat(
                  data.find((item) => item.name === "Tại quầy").value
                ).toLocaleString()}
              <span>{unit === "đ" && " đ"}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div className="flex items-center">
              <div className={classNames(styles.block, "bg-[#FF6E3A]")} />
              <div className="font-medium ml-[12px]">Onine</div>
            </div>
            <div className="font-semibold ml-[12px]">
              {isArray(data) &&
                parseFloat(
                  data.find((item) => item.name === "Onine").value
                ).toLocaleString()}
              <span>{unit === "đ" && " đ"}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div className="flex items-center">
              <div className={classNames(styles.block, "bg-[#FFCD3E]")} />
              <div className="font-medium ml-[12px]">Trên app</div>
            </div>
            <div className="font-semibold ml-[12px]">
              {isArray(data) &&
                parseFloat(
                  data.find((item) => item.name === "Trên app").value
                ).toLocaleString()}
              <span>{unit === "đ" && " đ"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPieChart;
