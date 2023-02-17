/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import ReactDOM from "react-dom";
import TransportCompanyUserApi from "../../services/transport-company-user";
import type { ColumnsType } from "antd/es/table";
import { Table, Switch, notification, Tag } from "antd";
import TitlePage from "../../components/TitlePage/Titlepage";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import { isArray, onCoppy } from "../../utils/utils";

const ListUserCompany = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(defaultPagination);
  const [users, setUsers] = useState<any[]>([]);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getDataListUser();
  }, [pagination.total, pagination.pageSize]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getDataListUser = async () => {
    setLoading(true);
    const { data, totalPage, totalUsers } =
      await TransportCompanyUserApi.getListUser({
        ...pagination,
      });
    setUsers(data);
    setPagination({
      ...pagination,
      total: totalUsers,
    });
    setLoading(false);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          className="text-[#384ADC] font-semibold"
          onClick={(e) => {
            window.location.href = `/product/items/edit/${record.id}`;
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      width: 150,
      dataIndex: "phone_number",
      key: "phone_number",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          onClick={(e) => {
            record?.phone_number && onCoppy(e, record?.phone_number);
          }}
        >
          {record.phone_number}
        </span>
      ),
    },
  ];

  const handleConfirmDelete = async () => {};

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Danh sách tài khoản" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = "/product/items/create")}
          >
            Thêm mới
          </Button>
          <Button
            variant="danger-outlined"
            width={153}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => setIsShowModalConfirm(true)}
          >
            Xóa
          </Button>
          <Button
            variant="no-outlined"
            width={62}
            color="white"
            icon={<Icon icon="question" size={16} />}
          >
            <a
              href="https://docs.google.com/document/d/1wXPHowLeFIU6q-iXi-ryM56m7GuLahu4FFxsNPzJXYw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hỗ trợ
            </a>
          </Button>
        </div>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số người dùng đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <div className="relative">
        <Table
          rowKey={(record: any) => record.id}
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={[...users]}
          pagination={{
            current: pagination.current,
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(e) => {
            setPagination({
              ...pagination,
              current: e.current || 1,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
          }}
          scroll={{ x: 50 }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<ListUserCompany />, document.getElementById("root"));
