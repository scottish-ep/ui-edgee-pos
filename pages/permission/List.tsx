import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import moment from "moment";

import { notification, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import TitlePage from "../../components/TitlePage/Titlepage";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import NoData from "../../assets/no-data.svg";
import PaginationCustom from "../../components/PaginationCustom";
import { IPermission } from "../../types/permission";
import PermissionModal from "./components/PermissionModal";
import PermissionApi from "../../services/permission";
import ModalRemove from "../../components/ModalRemove/ModalRemove";

const ListPermission = () => {
  const [permission, setPermission] = useState<IPermission[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isShowModalRemove, setIsShowModalRemove] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number>(0);

  const handleDelete = async () => {
    setIsShowModalRemove(false);
    const { data, success, message } = await PermissionApi.deleteId(selectedId);
    if (data) {
      notification.success({
        message: "Xóa phân quyền thành công!",
      });
      window.location.reload();
    } else if (!success && message) {
      notification.error({
        message: message,
      });
    }
  };

  const columns: ColumnsType<IPermission> = [
    {
      title: "Tên chức vụ",
      width: "20%",
      key: "name",
      align: "left",
      render: (_, record) => <div className="font-medium">{record?.name}</div>,
    },
    {
      title: "Số thành viên",
      width: 200,
      dataIndex: "number_of_member",
      key: "number_of_member",
      align: "center",
      render: (_, record) => (
        <div className="font-semibold">{record?.number_of_member || 0}</div>
      ),
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updated_at",
      width: 300,
      key: "updated_at",
      align: "center",
      render: (_, record) => (
        <div className="font-medium">
          {moment(record?.updated_at).format("YYYY-MM-DD")}
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "left",
      render: (_, record) => (
        <div className="font-medium">{record?.note || "--"}</div>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-[16px]">
          <div
            className="pointer"
            onClick={() =>
              (window.location.href = `/permission/detail/${record.id}`)
            }
          >
            <Icon icon="edit-1" size={24} color="#4B4B59" />
          </div>
          <div
            className="pointer"
            onClick={() => {
              setSelectedId(record.id);
              setIsShowModalRemove(true);
            }}
          >
            <Icon icon="delete-1" size={24} color="#EF4444" />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, [page, pageSize]);

  const getList = async () => {
    setLoading(true);
    const data = await PermissionApi.list();
    setPermission(data);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Danh sách phân quyền hệ thống" />
        <div className="flex gap-[8px] flex-wrap">
          {/*<Button
            variant="outlined"
            icon={<Icon icon="data" size={24} />}
            onClick={() => setOpenModal(true)}
          >
            Phân quyền đặc biệt
          </Button>*/}

          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = "/permission/create")}
          >
            Thêm mới
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
      <Table
        loading={loading}
        columns={columns}
        dataSource={permission}
        pagination={false}
        scroll={{ x: 50 }}
        rowKey={(record) => record.id}
        locale={{
          emptyText: (
            <div className="text-center flex items-center justify-center py-[20px]">
              <NoData />
            </div>
          ),
        }}
      />

      {/* <PaginationCustom
        total={totalItems}
        defaultPageSize={pageSize}
        current={page}
        onChangePage={(page) => setPage(page)}
        onChangePageSize={(pageSize) => setPageSize(pageSize)}
      /> */}

      <PermissionModal
        onClose={() => setOpenModal(false)}
        isVisible={openModal}
      />

      <ModalRemove
        isVisible={isShowModalRemove}
        onClose={() => setIsShowModalRemove(false)}
        onOpen={() => setIsShowModalRemove(false)}
        titleBody="Xóa phân quyền này?"
        content="Thông tin của phân quyền sẽ không còn nữa."
        onOk={handleDelete}
      />
    </div>
  );
};

ReactDOM.render(<ListPermission />, document.getElementById("root"));
