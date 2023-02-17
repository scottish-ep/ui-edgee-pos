import React from "react";
import {
  DatePicker as DatePickerAntd,
  Space,
  TimeRangePickerProps as RangePickerAntdProps,
} from "antd";
import moment from "moment";

const { RangePicker } = DatePickerAntd;

interface RangePickerProps extends RangePickerAntdProps {
  width?: number | string;
  isFutureDate?: boolean;
}

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today
  return current && current < moment().startOf("day");
};

const DatePicker = (props: RangePickerProps) => {
  const { width, isFutureDate = false } = props;

  if (isFutureDate)
    return (
      <RangePicker
        showTime
        style={{ width: width, minWidth: "fit-content" }}
        // ranges={{
        //   Today: [moment(), moment()],
        //   "This Month": [moment().startOf("month"), moment().endOf("month")],
        // }}
        {...props}
        disabledDate={disabledDate}
      />
    );
  else
    return (
      <RangePicker
        showTime
        style={{ width: width, minWidth: "fit-content" }}
        // ranges={{
        //   Today: [moment(), moment()],
        //   "This Month": [moment().startOf("month"), moment().endOf("month")],
        // }}
        {...props}
      />
    );
};

export default DatePicker;
