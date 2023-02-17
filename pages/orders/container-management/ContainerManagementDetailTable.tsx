import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import TableEmpty from "../../../components/TableEmpty";
import { StatusColorEnum, StatusList } from "../../../types";
import { onCoppy } from "../../../utils/utils";
import { IOrderOfContainerManagement } from "../orders.type";

import PaginationCustom from "../../../components/PaginationCustom";
import { format } from "date-fns";

interface ContainerManagementDetailTableProps {
  order_list?: IOrderOfContainerManagement[];
}

const ContainerManagementDetailTable: React.FC<
  ContainerManagementDetailTableProps
> = ({ order_list = [] }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  const columns: ColumnsType<IOrderOfContainerManagement> = [
    {
      title: "Mã đơn hàng",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium font-semibold text-[#384ADC]"
          onClick={(e) => onCoppy(e, record.id)}
        >
          {record.id}
        </span>
      ),
    },
    {
      title: "Thời gian tạo",
      width: 100,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 justify-center">
          <span className="text-medium text-[#1D1C2D]">
            {format(record.createdAt, "HH:mm")}
          </span>
          <span className="text-medium text-[#1D1C2D]">
            {format(record.createdAt, "dd/MM/yyyy")}
          </span>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      width: 200,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.name}
        </span>
      ),
    },
    {
      title: "Giá trị đơn hàng",
      width: 150,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.price.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Khối lượng",
      width: 150,
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.weight} kg
        </span>
      ),
    },
    {
      title: "Trạng thái",
      width: 150,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <span
          className={`text-medium font-medium text-[${
            StatusColorEnum[record.status]
          }]`}
        >
          {StatusList.find((status) => status.value === record.status)?.name}
        </span>
      ),
    },
  ];

  return (
    <div className="relative flex-1">
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        columns={columns}
        loading={loading}
        dataSource={order_list}
        pagination={false}
      />
    </div>
  );
};

export default ContainerManagementDetailTable;
