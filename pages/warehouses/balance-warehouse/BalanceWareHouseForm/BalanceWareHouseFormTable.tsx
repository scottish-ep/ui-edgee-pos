import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import TableEmpty from "../../../../components/TableEmpty";
import { isArray } from "../../../../utils/utils";
import { IProduct } from "../../../products/product.type";

interface BalanceWareHouseFormTableProps {
  itemSkus?: IProduct[];
  handleDeleteProduct?: (id: string | number) => void;
  handleChangeValue: (id: string | number, key: string, value: string) => void;
  loading: boolean;
}

const BalanceWareHouseFormTable: React.FC<BalanceWareHouseFormTableProps> = ({
  itemSkus = [],
  handleChangeValue,
  handleDeleteProduct,
  loading,
}) => {
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record, index) =>
        record.id !== "total" && (
          <span className="text-medium font-medium text-[#1D1C2D]">
            {index + 1}
          </span>
        ),
    },
    {
      title: "Tên sản phẩm",
      width: 250,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "item_sku.item.name")}
          {isArray(get(record, "item_sku.item_attribute_values")) &&
            get(record, "item_sku.item_attribute_values").map((item) => {
              return (
                <span
                  className="text-medium font-medium text-[#1D1C2D]"
                  key={item.id}
                >
                  {" "}
                  - {item.value}
                </span>
              );
            })}
        </span>
      ),
    },
    {
      title: "Danh mục",
      width: 200,
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "item_sku.item.item_category.name")}
        </span>
      ),
    },
    {
      title: "Tồn kho",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "quantity")}
        </span>
      ),
    },
    {
      title: "Thực kiểm",
      width: 150,
      dataIndex: "actual_remain",
      key: "actual_remain",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            // status={
            //   Number(record.actual_remain) > Number(record.weight)
            //     ? "error"
            //     : ""
            // }
            value={record.actual_remain}
            onChange={(e) =>
              handleChangeValue(record.id, "actual_remain", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {record.actual_remain}
          </span>
        ),
    },
    {
      title: "Chênh lệch",
      width: 150,
      dataIndex: "difference",
      key: "difference",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "quantity") - get(record, "actual_remain") || 0}
        </span>
      ),
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <span
            className="cursor-pointer"
            onClick={() =>
              handleDeleteProduct && handleDeleteProduct(record.id)
            }
          >
            <Icon icon="cancel" size={20} />
          </span>
        ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record.id}
      locale={{
        emptyText: <TableEmpty />,
      }}
      loading={loading}
      columns={columns}
      dataSource={
        itemSkus.length
          ? [
              ...itemSkus,
              // {
              //   id: "total",
              //   name: "",
              //   category: "",
              //   quantity: itemSkus.reduce(
              //     (init, item: any) => init + get(item, "quantity") || 0
              //   ),
              //   actual_remain: itemSkus.reduce(
              //     (init, item: any) => init + get(item, "actual_remain") || 0,
              //     0
              //   ),
              //   difference: itemSkus.reduce(
              //     (init, item: any) =>
              //       init + get(item, "quantity") - get(item, "actual_remain") ||
              //       0,
              //     0
              //   ),
              // },
            ]
          : []
      }
      // dataSource={[...itemSkus]}
      pagination={false}
      scroll={{ x: 50 }}
    />
  );
};

export default BalanceWareHouseFormTable;
