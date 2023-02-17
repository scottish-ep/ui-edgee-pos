import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import React, { useState } from "react";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import TableEmpty from "../../../components/TableEmpty";
import { onCoppy } from "../../../utils/utils";
import { IProductOfCombo } from "../promotion.type";

interface ProductTableProps {
  searchType: string;
  productList: IProductOfCombo[];
  setProductList: React.Dispatch<React.SetStateAction<IProductOfCombo[]>>;
}

const ProductTable: React.FC<ProductTableProps> = ({
  searchType,
  productList,
  setProductList,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteProduct = (id: string) => {
    setProductList((prevProductList) =>
      prevProductList.filter((product) => product.id !== id)
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record, index) =>
        record.id !== "total" && (
          <span className="text-medium text-[#1D1C2D] font-medium">
            {index + 1}
          </span>
        ),
    },
    {
      title: "Mã SP",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <span
            className="text-medium text-[#1D1C2D] font-medium"
            onClick={(e) => onCoppy(e, record.item_relation_id)}
          >
            {record.item_relation_id}
          </span>
        ),
    },
    {
      title: "Mã SKU",
      width: 100,
      dataIndex: "sku",
      key: "sku",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <span
            className="text-medium text-[#1D1C2D] font-medium"
            onClick={(e) => onCoppy(e, record.code)}
          >
            {record.code}
          </span>
        ),
    },
    {
      title: "Tên sản phẩm",
      width: 200,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) =>
        record.id !== "total" && (
          <span className="text-medium text-[#1D1C2D] font-medium">
            {record.name || "--"}
          </span>
        ),
    },
    {
      title: "Danh mục",
      width: 125,
      dataIndex: "category_id",
      key: "category_id",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <span className="text-medium text-[#1D1C2D] font-medium">
            {record.category_name || "--"}
          </span>
        ) : (
          <span className="text-medium font-semibold text-[#1D1C2D]">Tổng</span>
        ),
    },
    {
      title: "Đơn giá",
      width: 125,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span
          className={classNames("text-medium text-[#1D1C2D] font-medium", {
            "font-semibold !text-[#384ADC]": record.id === "total",
          })}
        >
          {record.price ? `${record.price.toLocaleString()} đ` : "--"}
        </span>
      ),
    },
    {
      title: "Số lượng trong combo",
      width: 250,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            value={record.quantity}
            className="w-full"
            placeholder="Nhập số lượng"
            onChange={(e) =>
              setProductList((prevProductList) =>
                prevProductList.map((product) => {
                  if (product.item_sku_id === record.item_sku_id) {
                    return { ...product, quantity: Number(e.target.value) };
                  }

                  return product;
                })
              )
            }
            type="number"
            defaultValue="1"
          />
        ) : (
          <span className="text-medium font-semibold text-[#384ADC]">
            {record.quantity}
          </span>
        ),
    },

    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      render: (_, record) =>
        record.id !== "total" && (
          <span
            className="cursor-pointer flex justify-center"
            onClick={() => handleDeleteProduct(record.id)}
          >
            <Icon icon="cancel" size={20} />
          </span>
        ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record.item_relation_id}
      locale={{
        emptyText: <TableEmpty />,
      }}
      loading={loading}
      columns={columns}
      dataSource={
        productList.length
          ? [
              ...productList,
              {
                id: "total",
                price: productList.reduce(
                  (init, item) => init + item.price * (item.quantity || 1),
                  0
                ),
                quantity: productList.reduce(
                  (init, item) => init + (item.quantity || 1),
                  0
                ),
              },
            ]
          : []
      }
      pagination={false}
      scroll={{ x: 50 }}
    />
  );
};

export default ProductTable;
