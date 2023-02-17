import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import {
  LineChart as LineReChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { randomColor } from "../../utils/utils";

interface LineChartProps {
  width?: number | string;
  height?: number;
  data: any[];
  keys?: string[];
}

const LineChart = (props: LineChartProps) => {
  const { width = 243, height = 400, data, keys, ...rest } = props;

  const renderLine = () => {
    return keys?.map((item, index) => {
      return (
        <Line
          key={index}
          type="monotone"
          dataKey={item}
          stroke={`#` + randomColor()}
          activeDot={{ r: 8 }}
        />
      );
    });
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width={width} height={height}>
        <LineReChart
          data={[...data]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderLine()}
        </LineReChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
