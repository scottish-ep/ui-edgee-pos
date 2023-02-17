import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Switch, Table, notification } from "antd";
import type { ColumnsType } from "antd/es/table";

import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DateRangePicker/DateRangePicker";
import { ICombo } from "../promotion.type";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import ModalAddCombo from "./ModalAddCombo";
import { isArray, onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import PaginationCustom from "../../../components/PaginationCustom";
import PromotionComboApi from "../../../services/promotion-combos";
import moment from "moment";
import { IOption } from "../../../types/permission";
import WarehouseApi from "../../../services/warehouses";

const ComboList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [selectWarehouseOptions, setSelectWarehouseOptions] = useState<
    IOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: combos.length,
    pageSize: 10,
    page: 1,
  });
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [warehouseId, setWarehouseId] = useState<number | string>();

  const [isShowModalRemoveCombo, setIsShowModalRemoveCombo] = useState(false);
  const [isShowModalAddEditCombo, setIsShowModalAddEditCombo] = useState(false);
  const [rowSelected, setRowSelected] = useState<ICombo>();

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.pageSize,
    searchPhrase,
    startDate,
    endDate,
    warehouseId,
  ]);

  const getList = async () => {
    setLoading(true);
    const { data, totalPage } = await PromotionComboApi.getPromotionCombo({
      limit: pagination.pageSize,
      page: pagination.page,
      name: searchPhrase,
      start_date: startDate,
      end_date: endDate,
      warehouse_id: warehouseId,
    });
    setCombos(data);
    setPagination({
      ...pagination,
      total: totalPage * pagination.pageSize,
    });
    setLoading(false);
  };

  const getSelectWarehouseOptions = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setSelectWarehouseOptions(listWarehouse);
  };
  useEffect(() => {
    getSelectWarehouseOptions();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSelectDateRange = (value) => {
    setStartDate(value[0].format("YYYY-MM-DD"));
    setEndDate(value[1].format("YYYY-MM-DD"));
  };

  const handleSuccess = () => {
    setIsShowModalAddEditCombo(false);
    getList();
  };

  const handleDeleteCombo = async () => {
    let arrayId: any = [];
    if (selectedRowKeys.length > 0) {
      arrayId = selectedRowKeys;
    } else if (rowSelected) {
      arrayId = [rowSelected?.id];
    } else {
      notification.error({
        message: "Không có combo nào được xoá!",
      });
    }

    const { data } = await PromotionComboApi.deleteManyPromotionCombos(arrayId);
    if (data) {
      notification.success({
        message: "Xóa combo thành công!",
      });
      setIsShowModalRemoveCombo(false);
      setIsShowModalAddEditCombo(false);
      getList();
    }
  };

  const handleExportExcel = async () => {
    let url = "/api/v2/combos/export-excel";
    if (warehouseId) {
      url +=
        "?" +
        new URLSearchParams({
          warehouse_id: warehouseId.toString(),
        });
    }
    window.location.href = url;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSwitchStatus = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    record: ICombo,
    value: boolean
  ) => {
    event.stopPropagation();
    const dataSend = {
      status: value,
    };
    const { data, success, message } =
      await PromotionComboApi.updatePromotionComboStatus(record.id, dataSend);
    if (success) {
      notification.success({
        message: "Cập nhật combo status thành công!",
      });
      handleSuccess();
    } else {
      record.status = !value;
      notification.error({
        message,
      });
    }
  };

  const columns: ColumnsType<ICombo> = [
    {
      title: "Áp dụng",
      width: 100,
      key: "apply",
      align: "center",
      sorter: (a, b) => Number(a.status) - Number(b.status),
      render: (_, record) => {
        return (
          <Switch
            className="button-switch"
            defaultChecked={record.status}
            checked={record.status}
            onChange={(value, event) => onSwitchStatus(event, record, value)}
          />
        );
      },
    },
    {
      title: "Mã combo",
      width: 150,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => onCoppy(e, record.code)}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên combo",
      width: 200,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3d] font-medium">
          {record.name || "--"}
        </span>
      ),
    },
    {
      title: "Kênh bán",
      width: 100,
      dataIndex: "channel",
      key: "channel",
      align: "center",
      sorter: (a, b) => a.channel.localeCompare(b.channel),
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.channel_lang || "--"}
        </span>
      ),
    },
    {
      title: "Giá combo",
      width: 100,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">
          {record.price ? record.price.toLocaleString() : "--"} đ
        </span>
      ),
    },
    {
      title: "Số sản phẩm",
      width: 100,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.combo_items_count}
        </span>
      ),
    },
    {
      title: "Thời gian áp dụng",
      width: 150,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      sorter: (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {moment(record?.start_date).format("DD/MM/YYYY")} -
          {moment(record?.end_date).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Cập nhật cuối",
      width: 150,
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D]">
          {moment(record?.updated_at).format("DD/MM/YYYY - HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý combo" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              allowClear={true}
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={selectWarehouseOptions}
              onChange={(value) => setWarehouseId(value)}
              value={warehouseId}
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
            onClick={handleExportExcel}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => setIsShowModalAddEditCombo(true)}
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
          placeholder="Tìm mã combo / tên combo"
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <DatePicker
          width={306}
          onChange={handleSelectDateRange}
          isFutureDate={false}
        />
        <Button
          variant="danger-outlined"
          width={137}
          icon={<Icon icon="trash" size={24} />}
          onClick={() => setIsShowModalRemoveCombo(true)}
          disabled={selectedRowKeys.length === 0}
        >
          Xóa combo
        </Button>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số combo đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setRowSelected(record);
              setIsShowModalAddEditCombo(true);
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={combos}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        defaultPageSize={pagination.pageSize}
        total={pagination.total}
        current={pagination.page}
        onChangePage={(page) =>
          setPagination({
            ...pagination,
            page,
          })
        }
        onChangePageSize={(pageSize) => {
          setPagination({
            ...pagination,
            page: 1,
            pageSize,
          });
        }}
      />

      <ModalRemove
        isVisible={isShowModalRemoveCombo}
        onClose={() => setIsShowModalRemoveCombo(false)}
        onOpen={() => {
          setIsShowModalRemoveCombo(false);
          setIsShowModalAddEditCombo(false);
        }}
        titleBody="Xóa combo này?"
        content="Thông tin của combo sẽ không còn nữa."
        onOk={handleDeleteCombo}
      />

      <ModalAddCombo
        selectWarehouseOptions={selectWarehouseOptions}
        rowSelected={rowSelected}
        isVisible={isShowModalAddEditCombo}
        onClose={() => {
          setRowSelected(undefined);
          setIsShowModalAddEditCombo(false);
        }}
        title={`${rowSelected ? "Chi tiết" : "Tạo mới"} combo`}
        onRemove={() => setIsShowModalRemoveCombo(true)}
        handleSuccess={handleSuccess}
      />
    </div>
  );
};

ReactDOM.render(<ComboList />, document.getElementById("root"));
