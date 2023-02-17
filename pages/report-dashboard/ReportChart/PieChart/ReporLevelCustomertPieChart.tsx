/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import classNames from "classnames";

import styles from "../../../../styles/Report.module.css";
import Icon from "../../../../components/Icon/Icon";
import PieChart from "../../../../components/Chart/PieChart";
import { isArray } from "../../../../utils/utils";

interface ReporLevelCustomertPieChartProps {
  title: string;
  data: any[];
  unit?: string;
}

const ReporLevelCustomertPieChart = (
  props: ReporLevelCustomertPieChartProps
) => {
  const { title, data, unit, ...rest } = props;
  const [colors, setColors] = useState<any[]>([]);

  useEffect(() => {
    let rawColors: any[] = [];
    isArray(data) &&
      data.map((item) => {
        if (item?.color) {
          rawColors.push(item.color);
        }
      });
    setColors(rawColors);
  }, [data]);

  return (
    <div className={classNames("w-1/2", styles.div_container)}>
      <div className={styles.row}>
        <div className="text-big text-[#384ADC] font-semibold">{title}</div>
        <span className="cursor-pointer">{/*<Icon icon="export" />*/}</span>
      </div>
      <div className={styles.row}>
        <div className="flex-1" style={{ width: 210 }}>
          {isArray(data) && <PieChart colors={colors} data={[...data]} />}
        </div>
        <div className={classNames(styles.div_container)}>
          {isArray(data) &&
            data.map((item: any, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className="flex items-center">
                    <div
                      className={classNames(styles.block, `bg-[${item.color}]`)}
                    />
                    <div className="font-medium ml-[12px]">{item.name}</div>
                  </div>
                  <div className="font-semibold ml-[12px]">
                    {parseFloat(item.value).toLocaleString()}{" "}
                    <span>{unit === "đ" && "đ"}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReporLevelCustomertPieChart;
