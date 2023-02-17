import React from "react";
import {
  DatePicker as DatePickerAntd,
  Space,
  TimeRangePickerProps as RangePickerAntdProps,
} from "antd";
import moment from "moment";
import classNames from "classnames";
import Icon from "../Icon/Icon";

const { RangePicker } = DatePickerAntd;

interface RangePickerProps extends RangePickerAntdProps {
  width?: number | string;
  containerClassName?: string;
}

const DateRangePickerCustom = (props: RangePickerProps) => {
  const { width, containerClassName, ...rest } = props;

  return (
    <div
      className={classNames(
        "custom__daterangepicker__antd",
        containerClassName
      )}
    >
      <Icon className="icon__calendar" icon="calendar" size={24} />
      <RangePicker
        showTime
        separator="-"
        placeholder={["Ngày/tháng/năm", "Ngày/tháng/năm"]}
        style={{ width: width, minWidth: "fit-content" }}
        format={"DD/MM/YYYY"}
        suffixIcon={<></>}
        {...rest}
      />
    </div>
  );
};

export default DateRangePickerCustom;
