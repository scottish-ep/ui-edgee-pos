import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import TableEmpty from "../../../../components/TableEmpty";
import { IProduct } from "../../../products/product.type";

interface ReturnWareHouseFormTableProps {
  product_list?: IProduct[];
}

const ReturnWareHouseFormTable: React.FC<ReturnWareHouseFormTableProps> = ({
  product_list = [],
}) => {
  const [productList, setProductList] = useState([...product_list]);

  const handleDeleteProduct = (id: string) => {
    setProductList((prevProductList) =>
      prevProductList.filter((product) => product.id !== id)
    );
  };

  const handleChangeValue = (id: string, key: string, value: string) => {
    setProductList((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === id) {
          return { ...product, [key]: Number(value) };
        }

        return product;
      })
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, __, index) => (
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
          {record.name}
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
          {record.category_id}
        </span>
      ),
    },
    {
      title: "Số lượng",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <Input
          type="number"
          value={record.quantity}
          onChange={(e) =>
            handleChangeValue(record.id, "quantity", e.target.value)
          }
        />
      ),
    },
    {
      title: "Trọng lượng",
      width: 150,
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => (
        <Input
          type="number"
          value={record.weight}
          suffix={<p className="text-medium text-[#2E2D3D]">kg</p>}
          onChange={(e) =>
            handleChangeValue(record.id, "weight", e.target.value)
          }
        />
      ),
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      align: "center",
      render: (_, record) => (
        <span
          className="cursor-pointer"
          onClick={() => handleDeleteProduct(record.id)}
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
      columns={columns}
      dataSource={productList}
      pagination={false}
      scroll={{ x: 50 }}
    />
  );
};

export default ReturnWareHouseFormTable;
