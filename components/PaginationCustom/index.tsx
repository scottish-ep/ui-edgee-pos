import React, { FC, useEffect, useState } from "react";
import { Pagination } from "antd";
import Icon from "../Icon/Icon";
import Select from "../Select/Select";

interface PaginationCustomProps {
  current?: number;
  defaultPageSize: number;
  total: number;
  onChangePage?: (page: number) => void;
  onChangePageSize?: (pageSize: number) => void;
}

const PaginationCustom: FC<PaginationCustomProps> = (props) => {
  const { defaultPageSize, onChangePage, onChangePageSize, ...rest } = props;

  const [size, setSize] = useState<number>(defaultPageSize);

  const itemRender = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <Icon icon="carret-left" size={24} color="#2E2D3D" className="mt-1" />
      );
    } else if (type === "next") {
      return (
        <Icon icon="carret-right" size={24} color="#2E2D3D" className="mt-1" />
      );
    }
    return originalElement;
  };

  useEffect(() => {
    setSize(defaultPageSize);
  }, [defaultPageSize]);

  return (
    <div className="flex items-center mt-5 justify-end gap-x-4">
      <Pagination
        pageSize={size}
        showSizeChanger={false}
        itemRender={itemRender}
        onChange={(page) => onChangePage?.(page)}
        {...rest}
      />
      <div className="flex items-center gap-x-2">
        <span className="text-medium text-[#4B4B59] min-w-[62px]">Hiển thị</span>
        <Select
          defaultValue={defaultPageSize}
          width={76}
          height={32}
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
          onChange={(value) => {
            setSize(value);
            onChangePageSize?.(value);
          }}
        />
        <span className="text-medium text-[#4B4B59] min-w-[62px]">kết quả</span>
      </div>
    </div>
  );
};

export default PaginationCustom;
