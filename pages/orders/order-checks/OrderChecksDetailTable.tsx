import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import TableEmpty from "../../../components/TableEmpty";
import { StatusColorEnum, StatusList } from "../../../types";
import { onCoppy } from "../../../utils/utils";
import { IOrderOfOrderChecks } from "../orders.type";

import PaginationCustom from "../../../components/PaginationCustom";

interface OrderChecksDetailTableProps {
  order_list?: IOrderOfOrderChecks[];
  rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  };
}

const OrderChecksDetailTable: React.FC<OrderChecksDetailTableProps> = ({
  order_list = [],
  rowSelection,
}) => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: order_list.length,
    pageSize: 10,
    page: 1,
  });

  // useEffect(() => {
  //   console.log("🚀 ~ file: OrderChecksDetailTable.tsx ~ line 32 ~ useEffect ~ command_id", commandId)
  // }, [commandId]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  const columns: ColumnsType<IOrderOfOrderChecks> = [
    {
      title: "Mã vận đơn",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
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
      title: "Mã đơn hàng",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
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
      title: "Trạng thái đơn hàng",
      width: 100,
      dataIndex: "statusOrder",
      key: "statusOrder",
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.statusOrder}
        </span>
      ),
    },
    {
      title: "COD (Hệ thống)",
      width: 100,
      dataIndex: "codSystem",
      key: "codSystem",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#6366F1]">
          {record.codSystem.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "COD (NVC)",
      width: 100,
      dataIndex: "codNVC",
      key: "codNVC",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.codNVC.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Phí GH (Hệ thống)",
      width: 100,
      dataIndex: "priceSystem",
      key: "priceSystem",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#6366F1]">
          {record.priceSystem.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Phí GH (NVC)",
      width: 100,
      dataIndex: "priceNVC",
      key: "priceNVC",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.priceNVC.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Cân nặng (Hệ thống)",
      width: 100,
      dataIndex: "weightSystem",
      key: "weightSystem",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#6366F1]">
          {record.weightSystem} kg
        </span>
      ),
    },
    {
      title: "Cân nặng (NVC)",
      width: 100,
      dataIndex: "weightNVC",
      key: "weightNVC",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.weightNVC} kg
        </span>
      ),
    },
    {
      title: "Kết quả đối soát",
      width: 150,
      dataIndex: "result",
      key: "result",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#4B4B59]">
          {record.result}
        </span>
      ),
    },
    {
      title: "Tiền chênh lệch",
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
      title: "Trạng thái",
      width: 150,
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <span
          className={`text-medium font-semibold text-[${
            StatusColorEnum[record.status]
          }]`}
        >
          {StatusList.find((status) => status.value === record.status)?.name}
        </span>
      ),
    },
  ];

  return (
    <div className="relative">
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        rowSelection={rowSelection}
        columns={columns}
        loading={loading}
        dataSource={order_list.slice(
          pagination.page * pagination.pageSize - pagination.pageSize,
          pagination.page * pagination.pageSize
        )}
        pagination={false}
        scroll={{ x: 50 }}
      />
      <div className="flex items-center justify-between flex-wrap-reverse gap-2">
        <div className="flex items-center h-max">
          <div className="flex gap-x-1">
            <span className="text-medium text-[#4B4B59]">
              Tổng COD (Hệ thống):
            </span>
            <span className="text-medium font-semibold text-[#384ADC]">
              1.500.000 đ
            </span>
          </div>
          <div className="flex gap-x-1 border-l border-l-[#4B4B59] border-r border-r-[#4B4B59] px-3 mx-3">
            <span className="text-medium text-[#4B4B59]">Tổng COD (NVC):</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              1.500.000 đ
            </span>
          </div>
          <div className="flex gap-x-1">
            <span className="text-medium text-[#4B4B59]">Tổng chênh lệch:</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              {" "}
              0 đ
            </span>
          </div>
        </div>

        <PaginationCustom
          total={pagination.total}
          defaultPageSize={pagination.pageSize}
          current={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
          onChangePageSize={(pageSize) =>
            setPagination({ ...pagination, pageSize })
          }
        />
      </div>
    </div>
  );
};

export default OrderChecksDetailTable;
