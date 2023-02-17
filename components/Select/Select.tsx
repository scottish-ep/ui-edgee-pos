import React, { CSSProperties } from "react";
import { ReactNode } from "react";
import { Select as SelectAntd, SelectProps as SelectAntdProps } from "antd";
import Icon from "../Icon/Icon";

import styles from "./Select.module.css";
import classNames from "classnames";

interface SelectProps extends SelectAntdProps {
  width?: number | string;
  height?: number | string;
  label?: string;
  prefix?: ReactNode;
  containerClassName?: string;
  disabled?: boolean;
  style?: CSSProperties;
  loading?: boolean;
}

const Select = (props: SelectProps) => {
  const {
    width,
    label,
    prefix,
    className,
    height = 45,
    containerClassName,
    disabled,
    style,
    loading,
    ...rest
  } = props;
  return (
    <div
      className={classNames(
        "flex flex-col w-full relative custom__select__antd",
        prefix && "has-prefix-icon",
        containerClassName
      )}
    >
      {label && (
        <div
          className={classNames(
            "font-medium text-medium mb-[12px] min-w-min",
            styles.label
          )}
        >
          {label}
        </div>
      )}
      {prefix && <div className={styles.icon_prefix}>{prefix}</div>}
      <SelectAntd
        suffixIcon={
          <Icon
            icon="arrow-down-1"
            size={16}
            color={disabled ? "rgb(195 195 202)" : "#909098"}
          />
        }
        style={{
          width,
          height,
          ...style,
        }}
        loading={loading}
        disabled={disabled || loading}
        popupClassName="custom__popup__select__antd"
        {...rest}
      />
    </div>
  );
};

export default Select;
