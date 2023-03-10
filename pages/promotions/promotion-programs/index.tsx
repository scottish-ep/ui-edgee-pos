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
  console.log('promotion', promotions)
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
      label: "T???t c??? kho",
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

  const handleSelectDateRange = (value: any) => {
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

  const handleShowPromotion = async (status: any, dt: any) => {
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
    { label: "M??", key: "code" },
    { label: "??p d???ng", key: "apply" },
    { label: "T??n", key: "name" },
    { label: "K??nh KM", key: "channel" },
    { label: "??p d???ng t??? ng??y", key: "start_date" },
    { label: "??p d???ng ?????n ng??y", key: "end_date" },
    { label: "Ng?????i t???o", key: "user" },
    { label: "Ng??y t???o", key: "createdAt" },
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


  const colData: ICombo[] = Array(50)
  .fill({
   channel: "Tai quay",
   code: "KM0083",
   createdAt: Date.now(),
   created_at: Date.now(),
   created_user: {
    createdAt: Date.now(),
    created_at: Date.now(),
    id: 102,
    name: "Test"
   },
   created_user_id: 102,
   end_date: Date.now(),
   is_active: false,
   item_channel: {
    code: "OFFLINE",
    created_at: null,
    id: 3,
    label: "Tai quay",
    updated_at: null,
   },
   item_channel_id: 3,
   name: "Test",
   start_date: Date.now(),
   type: "item",
   updated_at: Date.now(),
  })
  .map((item, index) => ({...item, id: index++}))


  const columns: ColumnsType<ICombo> = [
    {
      title: "??p d???ng",
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
      title: "M??",
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
      title: "T??n ch????ng tr??nh khuy???n m??i",
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
      title: "K??nh KM",
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
      title: "Th???i gian ??p d???ng",
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
      title: "Ng?????i t???o / Ng??y t???o",
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
      message.success("X??a th??nh c??ng");
      setReload(uuid());
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Ch????ng tr??nh khuy???n m??i" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Ch???n kho</div>
            <Select
              placeholder="Ch???n kho"
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
              message.success("Download th??nh c??ng");
            }}
          >
            <Button
              variant="outlined"
              width={109}
              icon={<Icon icon="export" size={24} />}
            >
              Xu???t file
            </Button>
          </CSVLink>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            href="/promotion-programs/create"
          >
            Th??m m???i
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
              H??? tr???
            </a>
          </Button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nh???p t??n ch????ng tr??nh khuy???n m??i"
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
          X??a CTKM
        </Button>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          S??? khuy???n m??i ??ang ch???n:{" "}
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
                `/promotions/promotion-programs/${record.id}`),
          };
        }}
        onChange={(e) => {
          setPageSize(e.pageSize || 10);
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={promotions}
        dataSource={colData}
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
        titleBody="X??a ch????ng tr??nh khuy???n m??i n??y?"
        content="Th??ng tin c???a ch????ng tr??nh khuy???n m??i s??? kh??ng c??n n???a."
        onOk={handleDelete}
      />
    </div>
  );
};

export default PromotionsList;
  