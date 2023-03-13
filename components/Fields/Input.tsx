import { Input as AntdInput, InputProps } from "antd";

import classNames from "classnames";

interface selectProps extends InputProps {
  label?: string;
  className?: string;
}

const Input = (props: selectProps) => {
  const { label, className, ...rest } = props;
  return (
    <div
      className={classNames("form-item-vertical w-full relative", className)}
    >
      <div className="text-sm font-bold">{label}</div>
      <AntdInput {...rest} />
    </div>
  );
};

export default Input;
