import React from "react";
import { DatePicker as DatePickerAntd, DatePickerProps } from "antd";
import classNames from "classnames";
import Icon from "../Icon/Icon";
import { FunctionComponent } from "react";

export interface ExtendedDatePickerProps {
  width?: number | string;
  placeholder?: string;
  containerClassName?: string;
}
export type DatePickerLocalisedProps = DatePickerProps &
  ExtendedDatePickerProps;

const DatePicker: FunctionComponent<DatePickerLocalisedProps> = (props) => {
  const { width, placeholder, containerClassName } = props;

  return (
    <div className={classNames("custom__datepicker__antd", containerClassName)}>
      <Icon className="icon__calendar" icon="calendar" size={24} />
      <DatePickerAntd
        placeholder={placeholder}
        style={{ width: width }}
        suffixIcon={<></>}
        {...props}
      />
    </div>
  );
};

export default DatePicker;
