import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import TableEmpty from "../../../../components/TableEmpty";
import { isArray } from "../../../../utils/utils";
import { IProduct } from "../../../products/product.type";

interface TransferWareHouseFormTableProps {
  itemSkus?: IProduct[];
  handleDeleteProduct?: (id: string | number) => void;
  handleChangeValue: (id: string | number, key: string, value: string) => void;
  loading: boolean;
}

const TransferWareHouseFormTable: React.FC<TransferWareHouseFormTableProps> = ({
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
      dataIndex: "sku_code",
      key: "sku_code",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "item.name")}
          {isArray(get(record, "item_attribute_values")) &&
            get(record, "item_attribute_values").map((item) => {
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
      width: 150,
      dataIndex: "category_id",
      key: "category_id",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, "item.item_category.name")}
        </span>
      ),
    },
    {
      title: "Số lượng có thể chuyển",
      width: 150,
      dataIndex: "quantity_can_transfer",
      key: "quantity_can_transfer",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <span className="text-medium font-medium text-[#1D1C2D]">
            {get(record, "warehouse_item.quantity")}
          </span>
        ) : (
          <span className="font-semibold text-medium">Tổng chuyển:</span>
        ),
    },
    // {
    //   title: "Trọng lượng có thể chuyển",
    //   width: 150,
    //   dataIndex: "weight",
    //   key: "weight",
    //   align: "center",
    //   render: (_, record) =>
    //     record.id !== "total" ? (
    //       <span className="text-medium font-medium text-[#1D1C2D]">
    //         {get(record, "warehouse_item.quantity") * record.weight} kg
    //       </span>
    //     ) : (
    //       <span className="text-[#1D1C2D] font-semibold text-medium text-right">
    //         Tổng chuyển
    //       </span>
    //     ),
    // },
    {
      title: "Số lượng chuyển",
      width: 150,
      dataIndex: "quantity_transfer",
      key: "quantity_transfer",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            status={
              Number(record.quantity_transfer) >
              Number(record.quantity_can_transfer)
                ? "error"
                : ""
            }
            value={record.quantity_transfer}
            onChange={(e) =>
              handleChangeValue(record.id, "quantity_transfer", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {Number(record.quantity_transfer) || 0}
          </span>
        ),
    },
    {
      title: "Trọng lượng chuyển",
      width: 150,
      dataIndex: "weight_transfer",
      key: "weight_transfer",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            status={
              Number(record.weight_transfer) > Number(record.weight)
                ? "error"
                : ""
            }
            value={record.weight_transfer}
            suffix={<p className="text-medium text-[#2E2D3D]">kg</p>}
            onChange={(e) =>
              handleChangeValue(record.id, "weight_transfer", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {Number(record.weight_transfer) || 0} kg
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
              {
                id: "total",
                name: "",
                category_id: "",
                export_price: 0,
                quantity_transfer: itemSkus.reduce(
                  (init, item) => init + item.quantity_transfer,
                  0
                ),
                weight_transfer: itemSkus.reduce(
                  (init, item) => init + item.weight_transfer,
                  0
                ),
              },
            ]
          : []
      }
      // dataSource={[...itemSkus]}
      pagination={false}
      scroll={{ x: 50 }}
    />
  );
};

export default TransferWareHouseFormTable;
