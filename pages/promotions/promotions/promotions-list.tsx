/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";

import { comboList } from "../../../const/constant";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DateRangePicker/DateRangePicker";
import { ICombo } from "../promotion.type";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import { isArray, onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import PaginationCustom from "../../../components/PaginationCustom";
import PromotionProgramApi from "../../../services/promotion-programs";
import WarehouseApi from "../../../services/warehouses";
import { CSVLink } from "react-csv";
import { uuid } from "uuidv4";
import DateRangePickerCustom from "../../../components/DateRangePicker/DateRangePickerCustom";
import { useDebounce } from "usehooks-ts";
import moment from "moment";

const PromotionsList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [promotions, setPromotions] = useState<ICombo[]>([...comboList]);
  const [promotions, setPromotions] = useState<ICombo[]>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: pageSize,
    defaultCurrent: page,
  });
  const debouncedValue = useDebounce<string>(searchPhrase, 500);
  const [dataExport, setDataExport] = useState<Array<ICombo>>([]);
  const [warehouses, setWarehouses] = useState([
    {
      label: "Tất cả kho",
      value: "",
    },
  ]);
  const [isShowModalRemovePromotion, setIsShowModalRemovePromotion] =
    useState(false);
  const [listDisabledId, setListDisabledId] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  useEffect(() => {
    getAllWarehouses();
  }, []);

  useEffect(() => {
    getAllPrograms();
  }, [
    page,
    pageSize,
    debouncedValue,
    selectedWarehouse,
    startDate,
    endDate,
    reload,
  ]);

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();
    setWarehouses(
      warehouses.concat(
        data.map((v: any) => ({
          label: v.name,
          value: v.id,
        }))
      )
    );
  };

  const getAllPrograms = async () => {
    setLoading(true);
    const { data, totalItems } = await PromotionProgramApi.getPromotionProgram({
      limit: pageSize,
      page: page,
      name: searchPhrase,
      warehouse_id: selectedWarehouse,
      start_date: startDate,
      end_date: endDate,
    });
    setPromotions(data);
    setTotalItems(totalItems);
    setLoading(false);
  };

  const handleSelectDateRange = (value) => {
    if (value) {
      setStartDate(value[0].format("YYYY-MM-DD"));
      setEndDate(value[1].format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleConfirmDelete = async () => {
    setIsShowModalRemovePromotion(false);
    const { data } = await PromotionProgramApi.deleteManyPromotionPrograms(
      selectedRowKeys
    );
    if (data) {
      window.location.reload();
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleShowPromotion = async (status, dt: any) => {
    setListDisabledId(listDisabledId.concat(dt.id));
    await PromotionProgramApi.updatePromotionProgram(dt.id, {
      is_active: status,
    });
    setReload(uuid());
    let newListDisabledId = listDisabledId.filter(
      (item: any) => item.id != dt.id
    );
    setListDisabledId(newListDisabledId);
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Mã", key: "code" },
    { label: "Áp dụng", key: "apply" },
    { label: "Tên", key: "name" },
    { label: "Kênh KM", key: "channel" },
    { label: "Áp dụng từ ngày", key: "start_date" },
    { label: "Áp dụng đến ngày", key: "end_date" },
    { label: "Người tạo", key: "user" },
    { label: "Ngày tạo", key: "createdAt" },
  ];

  useEffect(() => {
    let arr: Array<any> = [];

    if (rowSelection?.selectedRowKeys) {
      promotions?.map((item) => {
        if (rowSelection.selectedRowKeys.indexOf(item?.id) != -1) {
          arr.push({
            id: item?.id,
            code: item?.code,
            apply: item?.apply,
            name: item?.name,
            channel: item?.channel,
            start_date: item?.start_date,
            end_date: item?.end_date,
            user: item?.created_user?.name,
            createdAt: item?.createdAt,
          });
        }
      });
    }
    setDataExport(arr);
  }, [rowSelection?.selectedRowKeys]);

  const columns: ColumnsType<ICombo> = [
    {
      title: "Áp dụng",
      width: 100,
      key: "apply",
      align: "center",
      sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
      render: (_, record) => {
        return (
          <Switch
            disabled={listDisabledId.includes(record.id)}
            className="button-switch"
            onChange={(e) => handleShowPromotion(e, record)}
            checked={record.is_active}
          />
        );
      },
      onCell: (record, rowIndex) => {
        return {
          onClick: (e) => e.stopPropagation(),
        };
      },
    },
    {
      title: "Mã",
      width: 300,
      dataIndex: "code",
      key: "code",
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-medium"
          onClick={(e) => {
            record?.code && onCoppy(e, record?.code);
          }}
        >
          {record?.code || "--"}
        </span>
      ),
    },
    {
      title: "Tên chương trình khuyến mãi",
      width: 300,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3d] font-medium">
          {record.name || "--"}
        </span>
      ),
    },
    {
      title: "Kênh KM",
      width: 100,
      dataIndex: "channel",
      key: "channel",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.channel || "--"}
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
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">{`${record.start_date} - ${record.end_date}`}</span>
      ),
    },
    {
      title: "Người tạo / Ngày tạo",
      width: 150,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {record.created_user?.name}
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            {moment(new Date(record?.created_at || null)).format("DD/MM/YYYY")}
          </span>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    const { data } = await PromotionProgramApi.deleteManyPromotionPrograms(
      rowSelection?.selectedRowKeys
    );
    if (data) {
      message.success("Xóa thành công");
      setReload(uuid());
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Chương trình khuyến mãi" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
              onChange={(e) => setSelectedWarehouse(e)}
            />
          </div>
          <CSVLink
            headers={headers}
            data={dataExport}
            filename={"khuyen-mai.csv"}
            onClick={() => {
              message.success("Download thành công");
            }}
          >
            <Button
              variant="outlined"
              width={109}
              icon={<Icon icon="export" size={24} />}
            >
              Xuất file
            </Button>
          </CSVLink>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            href="/promotion-programs/create"
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
          placeholder="Nhập tên chương trình khuyến mãi"
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <DateRangePickerCustom width={306} onChange={handleSelectDateRange} />
        <Button
          variant="danger-outlined"
          width={137}
          icon={<Icon icon="trash" size={24} />}
          onClick={() => setIsShowModalRemovePromotion(true)}
          disabled={selectedRowKeys.length === 0}
        >
          Xóa CTKM
        </Button>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số khuyến mãi đang chọn:{" "}
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
        onRow={(record, rowIndex) => {
          return {
            onClick: () =>
              (window.location.href =
                "/promotion-programs/detail/" + record.id),
          };
        }}
        onChange={(e) => {
          setPageSize(e.pageSize || 10);
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={promotions}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        total={totalItems}
        defaultPageSize={pageSize}
        current={page}
        onChangePage={(page) => setPage(page)}
        onChangePageSize={(pageSize) => setPageSize(pageSize)}
      />

      <ModalRemove
        isVisible={isShowModalRemovePromotion}
        onClose={() => setIsShowModalRemovePromotion(false)}
        onOpen={handleConfirmDelete}
        titleBody="Xóa chương trình khuyến mãi này?"
        content="Thông tin của chương trình khuyến mãi sẽ không còn nữa."
        onOk={handleDelete}
      />
    </div>
  );
};

ReactDOM.render(<PromotionsList />, document.getElementById("root"));
