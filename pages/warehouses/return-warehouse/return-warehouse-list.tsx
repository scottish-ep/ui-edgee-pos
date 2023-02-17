import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";

import {
  statusBalanceReturnWareHouseOptions,
  warehouses,
  returnWareHouseList,
} from "../../../const/constant";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import Tabs from "../../../components/Tabs";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DateRangePicker/DateRangePicker";
import DropdownStatus from "../../../components/DropdownStatus";
import { IReturnWareHouses } from "../warehouse.type";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import { isArray, onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import PaginationCustom from "../../../components/PaginationCustom";

const ReturnWareHouseList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [returnWareHouses, setReturnWareHouses] = useState<IReturnWareHouses[]>(
    [...returnWareHouseList]
  );
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: returnWareHouses.length,
    pageSize: 10,
    page: 1,
  });
  const [isShowModalRemoveExport, setIsShowModalRemoveExport] = useState(false);

  const TabStatus = [
    { name: StatusEnum.NEW, count: 10 },
    { name: StatusEnum.COMPLETED, count: 12 },
  ];

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  // useEffect(() => {
  //   const url = "/api/v1/product/product-list/list";
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((res: any) => {
  //       console.log(res.result);
  //       const response = res.result;
  //       setPagination({
  //         ...pagination,
  //         total: response.totalPage * pagination.pageSize,
  //       });
  //       const customers = formatCustomers(response.customers);
  //       console.log(customers);
  //       setReturnWareHouses(customers);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<IReturnWareHouses> = [
    {
      title: "Mã trả hàng",
      width: 150,
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => onCoppy(e, record.id)}
        >
          {record.id}
        </span>
      ),
    },
    {
      title: "Loại phiếu",
      width: 150,
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#384ADC] font-medium">
          {record.type}
        </span>
      ),
    },
    {
      title: "Lý do trả hàng",
      width: 200,
      dataIndex: "reason",
      key: "reason",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">{record.reason}</span>
      ),
    },
    {
      title: "Kho nhập",
      width: 200,
      dataIndex: "import_name",
      key: "import_name",
      align: "center",
      render: (_, record) => (
        <span className="text-medium ont-medium text-[#2E2D3D]">
          {record.import_name}
        </span>
      ),
    },
    {
      title: "Số SP",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#384ADC]">
          {record.quantity}
        </span>
      ),
    },
    {
      title: "NV xử lý / Thời gian",
      width: 200,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {record.name}
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            {record.createdAt
              ? format(record.createdAt, "HH:mm - dd/MM/yyyy")
              : ""}
          </span>
        </div>
      ),
    },
    {
      title: "Cập nhật cuối",
      width: 185,
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          <span>{format(record.updatedAt, "HH:mm")}</span>
          <span>{format(record.updatedAt, "dd/MM/yyyy")}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: 185,
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Phiếu trả hàng" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="printer" size={24} />}
          >
            In phiếu
          </Button>
          <DropdownStatus
            text="Cập nhật trạng thái"
            options={statusBalanceReturnWareHouseOptions}
            icon="refresh"
            onRemoveSelected={() => setIsShowModalRemoveExport(true)}
          />
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = "/warehouse/return-commands/create")
            }
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã phiếu trả hàng"
        />
        <Input
          width={306}
          prefix={<Icon icon="personalcard" size={24} />}
          placeholder="Nhập tên nhân viên"
        />
        <DatePicker width={306} />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số phiếu đổi soát kho đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs countTotal={999} tabs={TabStatus} />
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={() => {
          return {
            onClick: () => {
              window.location.href = "/warehouse/return-commands/update/1";
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={returnWareHouses.slice(
          pagination.page * pagination.pageSize - pagination.pageSize,
          pagination.page * pagination.pageSize
        )}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        total={pagination.total}
        defaultPageSize={pagination.pageSize}
        current={pagination.page}
        onChangePage={(page) => setPagination({ ...pagination, page })}
        onChangePageSize={(pageSize) =>
          setPagination({ ...pagination, pageSize })
        }
      />

      <ModalRemove
        isVisible={isShowModalRemoveExport}
        onClose={() => setIsShowModalRemoveExport(false)}
        onOpen={() => setIsShowModalRemoveExport(false)}
        titleBody="Xóa phiếu trả hàng?"
        content="Thông tin của phiếu trả hàng sẽ không còn nữa."
      />
    </div>
  );
};

ReactDOM.render(<ReturnWareHouseList />, document.getElementById("root"));
