import { InputNumber } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { PriceUnitEnum } from "../../pages/promotions/promotion.type";

interface InputPriceProps {
  value?: number;
  unit?: PriceUnitEnum;
  placeholder?: string;
  onChange?: (value: number, unit: PriceUnitEnum) => void;
  className?: string;
  width?: string | number;
  disabledInput?: boolean;
}

const InputPrice: React.FC<InputPriceProps> = (props) => {
  const {
    value: valueInput,
    unit,
    placeholder = "Nhập",
    onChange,
    className,
    width = 180,
    disabledInput = false
  } = props;

  const [value, setValue] = useState({
    quantity: 0,
    unit: PriceUnitEnum.VND,
  });

  useEffect(() => {
    onChange?.(value.quantity, value.unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={classNames(
        `flex items-center gap-x-2 px-3 border border-[#DADADD] rounded bg-white hover:!border-[#40a9ff]`,
        className
      )}
      style={{ width }}
    >
      <InputNumber
        className="flex-1"
        value={valueInput || value.quantity || undefined}
        bordered={false}
        placeholder={placeholder}
        disabled={disabledInput}
        onChange={(vlu) => setValue({ ...value, quantity: vlu || 0 })}
      />
      <div className="flex gap-x-3">
        <div
          className={classNames(
            "flex justify-center items-center w-[30px] h-[30px] bg-[#F5F5F6] rounded border !border-[#F0F0F1] text-medium font-semibold text-[#909098] cursor-pointer",
            {
              "!border-[#6A7Bff] bg-[#CFE2FF] text-[#384ADC]":
                (value.unit || unit) === PriceUnitEnum.Percentage,
            }
          )}
          onClick={() =>
            setValue({ quantity: 0, unit: PriceUnitEnum.Percentage })
          }
        >
          {PriceUnitEnum.Percentage}
        </div>
        <div
          className={classNames(
            "flex justify-center items-center w-[30px] h-[30px] bg-[#F5F5F6] rounded border !border-[#F0F0F1] text-medium font-semibold text-[#909098] cursor-pointer",
            {
              "!border-[#6A7Bff] bg-[#CFE2FF] text-[#384ADC]":
                (value.unit || unit) === PriceUnitEnum.VND,
            }
          )}
          onClick={() => setValue({ quantity: 0, unit: PriceUnitEnum.VND })}
        >
          {PriceUnitEnum.VND}
        </div>
      </div>
    </div>
  );
};

export default InputPrice;
