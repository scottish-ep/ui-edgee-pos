import React from "react";
import { Input } from "antd";
import { TextAreaProps as TextAreaPropsAntd } from "antd/lib/input/TextArea";
import classNames from "classnames";

const { TextArea: TextAreaAntd } = Input;

interface TextAreaProps extends TextAreaPropsAntd {
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { label, className, ...rest } = props;
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-medium font-medium text-[#2E2D3D] mb-2">
          {label}
        </label>
      )}
      <TextAreaAntd
        className={classNames(
          "rounded border border-[#DADADD] bg-[#F5F5F6] text-medium",
          className
        )}
        {...rest}
      />
    </div>
  );
};

export default TextArea;
