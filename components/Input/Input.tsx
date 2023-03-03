import React from "react";
import { Input as InputAntd, InputProps as InputAntdProps } from "antd";
import classNames from "classnames";

interface InputProps extends InputAntdProps {
  width?: number | string;
  label?: string;
  className?: string;
  inputClassName?: string;
  ref?: any;
}

const Input = (props: InputProps) => {
  const { width, label, className, ref, inputClassName, ...rest } = props;

  return (
    <div className={classNames("flex flex-col", className)}>
      {label && (
        <div className="font-medium text-medium mb-[12px]">{label}</div>
      )}
      <InputAntd
        style={{
          width: width,
        }}
        className={inputClassName}
        {...rest}
      />
    </div>
  );
};

export default Input;
