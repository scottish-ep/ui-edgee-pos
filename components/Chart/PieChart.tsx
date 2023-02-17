import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { PieChart as PieReChart, Pie, Cell } from "recharts";
import { isArray } from "../../utils/utils";

interface PieChartProps {
  width?: number;
  height?: number;
  data: any[];
  colors?: any[];
}

const PieChart = (props: PieChartProps) => {
  const { width = 243, height = 243, data, colors, ...rest } = props;

  const COLORS = ["#404FCC", "#FF6E3A", "#FFCD3E"];

  return (
    <div>
      <PieReChart width={width} height={height}>
        <Pie
          data={[...data]}
          cx={121.5}
          cy={121.5}
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => {
            return colors && isArray(colors) ? (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ) : (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            );
          })}
        </Pie>
      </PieReChart>
    </div>
  );
};

export default PieChart;
