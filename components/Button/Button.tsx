import React, { ReactNode } from "react";
import { Button as ButtonAntd, ButtonProps as ButtonAntdProps } from "antd";

interface ButtonProps extends ButtonAntdProps {
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  variant?:
    | "primary"
    | "outlined"
    | "no-outlined"
    | "danger-outlined"
    | "blue-outlined"
    | "danger"
    | "secondary"
    | "purple-filled"
    | "neural_200"
    | "disabled";
  text?: string;
  className?: string;
}

const Button = (props: ButtonProps) => {
  const {
    width,
    height,
    children,
    suffixIcon,
    variant,
    text,
    style,
    prefixIcon,
    className,
    ...rest
  } = props;

  return (
    <ButtonAntd
      className={`${variant} ${className}`}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...rest}
    >
      {prefixIcon && prefixIcon}
      {children || text}
      {suffixIcon && suffixIcon}
    </ButtonAntd>
  );
};

export default Button;
