import { Select as AntdSelect, SelectProps } from "antd";
import { BaseOptionType } from "antd/es/select";
import { valueType } from "antd/es/statistic/utils";
import classNames from "classnames";

interface selectProps extends SelectProps<valueType, BaseOptionType> {
  label: string;
  className?: string;
}

const Select = (props: selectProps) => {
  const { label, className, ...rest } = props;
  return (
    <div
      className={classNames("form-item-vertical w-full relative", className)}
    >
      <div className="text-sm font-bold">{label}</div>
      <AntdSelect mode="multiple" optionFilterProp="label" {...rest} />
    </div>
  );
};

export default Select;
