import { Switch } from "antd";
import React from "react";
import Input from "../../../../components/Input/Input";

interface WareHouseItemProps {
  name: string;
  quantity: number;
  enable: boolean;
  isClose?: boolean;
  close?: number;
  isTotal?: boolean;
  total?: number;
  onChangeSwitch?: (checked: boolean) => void;
  onChangeValue?: (vlu: number) => void;
}

const WareHouseItem: React.FC<WareHouseItemProps> = ({
  name,
  quantity,
  enable,
  isClose,
  close,
  total,
  isTotal,
  onChangeSwitch,
  onChangeValue,
}) => (
  <div className="flex flex-col gap-y-3">
    <div className="flex items-center gap-x-6 gap-y-2 flex-wrap min-h-[45px]">
      <span className="text-medium font-medium text-[#2E2D3D] w-[183px]">
        Tên kho
      </span>
      <div className="flex-1 flex justify-between">
        <span className="text-medium font-semibold text-[#2E2D3D]">{name}</span>
        <Switch
          className="button-switch"
          defaultChecked={enable}
          onChange={(checked) => onChangeSwitch?.(checked)}
        />
      </div>
    </div>
    <div className="flex items-center gap-x-6 gap-y-2 flex-wrap min-h-[45px]">
      <span className="text-medium font-medium text-[#2E2D3D] w-[183px]">
        Số lượng nhập
      </span>
      <Input
        type="number"
        className="flex-1"
        placeholder="Nhập số lượng"
        disabled={!enable}
        value={quantity}
        suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
        onChange={(e) => onChangeValue?.(Number(e.target.value))}
      />
    </div>
    {isClose && (
      <div className="flex items-center gap-x-6 gap-y-2 flex-wrap min-h-[45px]">
        <span className="text-medium font-medium text-[#2E2D3D] w-[183px]">
          Đã đóng đi
        </span>
        <span className="text-medium font-semibold text-[#2E2D3D]">
          {close}
        </span>
      </div>
    )}
    {isTotal && (
      <div className="flex items-center gap-x-6 gap-y-2 flex-wrap min-h-[45px]">
        <span className="text-medium font-medium text-[#2E2D3D] w-[183px]">
          Còn lại
        </span>
        <span className="text-medium font-semibold text-[#2E2D3D]">
          {total}
        </span>
      </div>
    )}
  </div>
);

export default WareHouseItem;
