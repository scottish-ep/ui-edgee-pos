import React from "react";
import { Input as InputAntd, InputProps as InputAntdProps } from "antd";
import classNames from "classnames";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import styles from "./styles.module.css";

interface InputCurrencyProps extends CurrencyInputProps {
  width?: number | string;
  label?: string;
  className?: string;
  inputClassName?: string;
  suffixInput?: string;
}

const InputCurrency = (props: InputCurrencyProps) => {
  const { width, label, className, inputClassName, suffixInput, ...rest } =
    props;

  return (
    <div
      className={classNames(
        "flex flex-col items-center",
        className,
        styles.input
      )}
      style={{ width: width }}
    >
      {label && (
        <div className="font-medium text-medium mb-[12px]">{label}</div>
      )}
      <CurrencyInput className={inputClassName} {...rest} />
      <div className={styles.suffix}>{suffixInput}</div>
    </div>
  );
};

export default InputCurrency;
