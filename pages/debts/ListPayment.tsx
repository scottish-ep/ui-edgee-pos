/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import TitlePage from "../../components/TitlePage/Titlepage";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input/Input";
import DatePicker from "../../components/DatePicker/DatePicker";
import Select from "../../components/Select/Select";
import { productTypeList } from "../../const/constant";
import Tabs from "../../components/Tabs";
import type { ColumnsType } from "antd/es/table";
import { message, Table } from "antd";
import { StatusColorEnum, StatusEnum, StatusList } from "../../types";
import {
  IDebt,
  IRevenueExpenditure,
  ListDebtProps,
  ListPaymentProps,
} from "./listdebt.type";
import classNames from "classnames";
import DropdownStatus from "../../components/DropdownStatus";
import { warehouses, statusOptions, paymentList } from "../../const/constant";
import styles from "../../styles/ListPayment.module.css";
import ModalPayDetail from "./Modal/ModalPayDetail";
import { useDebounce } from "usehooks-ts";
import DebtApi from "../../services/debt";
import { RangePickerProps } from "antd/lib/date-picker";
import { IOption } from "../../types/permission";
import Api from "../../services";
import PaginationCustom from "../../components/PaginationCustom";
import TableEmpty from "../../components/TableEmpty";
import RevenueExpenditureApi from "../../services/revenue-expenditure";
import moment from "moment";
import { CSVLink } from "react-csv";
import DateRangePickerCustom from "../../components/DateRangePicker/DateRangePickerCustom";
import ModalRemove from "../../components/ModalRemove/ModalRemove";
import { uuid } from "uuidv4";
import { isArray, onCoppy } from "../../utils/utils";

export const colorStatus = [
  {
    key: "Chờ duyệt",
    value: "#909098",
  },
  {
    key: "Đã chi",
    value: "#10B981",
  },
  {
    key: "Đã nhận",
    value: "#6366F1",
  },
];

declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
    loggedInUser: string;
  }
}

const ListPayment = () => {
  const [listPayment, setListPayment] = useState<IRevenueExpenditure[]>([]);
  const [isShowModalPayDetail, setIsShowModalPayDetail] = useState(false);
  const [isShowModalAddPay, setIsShowModalAddPay] = useState(false);
  const [isShowModalAddPayDetail, setIsShowModalAddPayDetail] = useState(false);
  const [isShowModalRemoveExport, setIsShowModalRemoveExport] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | string>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [reload, setReload] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const debouncedValue = useDebounce<string>(searchPhrase, 1000);
  const debouncedUserName = useDebounce<string>(userName, 1000);
  const [status, setStatus] = useState<string>("Tất cả");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalExpenditure, setTotalExpenditure] = useState<number>(0);
  const [itemSelected, setItemSelected] = useState<IRevenueExpenditure | null>(
    null
  );
  const [isShowModalRemove, setIsShowModalRemove] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string>("");

  const [tabStatus, setTabStatus] = useState([
    { name: "Tất cả", count: 0 },
    { name: "Chờ duyệt", count: 0 },
    { name: "Đã chi", count: 0 },
    { name: "Đã thu", count: 0 },
  ]);
  const [warehouses, setWarehouses] = useState<IOption[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [dataExport, setDataExport] = useState<Array<any>>([]);
  const [users, setUsers] = useState<any>();
  const [userIdSelected, setUserIdSelected] = useState<string>("");
  const userSelected = window.loggedInUser;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const url = `/api/v2/debt/get-users`;
    const { data } = await Api.get(url);
    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];
    data?.data?.data?.map((item) => {
      arr.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setUsers(arr);
  };

  useEffect(() => {
    getAllItems();
  }, [
    page,
    pageSize,
    debouncedValue,
    reload,
    status,
    dateTo,
    debouncedUserName,
    warehouseId,
    userIdSelected,
  ]);

  const getAllItems = async () => {
    setLoading(true);
    const {
      data,
      totalRevenueMoney,
      totalExpenditureMoney,
      totalItems,
      countAll,
      countPending,
      countApproved,
      countCompleted,
    } = await RevenueExpenditureApi.list({
      limit: pageSize,
      page: page,
      name: searchPhrase,
      user_name: userName,
      status,
      date_to: dateTo,
      date_from: dateFrom,
      warehouse_id: warehouseId,
      userIdSelected,
    });

    setListPayment(data);
    setTotalItems(totalItems);
    setTabStatus([
      { name: "Tất cả", count: countAll },
      { name: "Chờ duyệt", count: countPending },
      { name: "Đã chi", count: countApproved },
      { name: "Đã thu", count: countCompleted },
    ]);
    setTotalRevenue(totalRevenueMoney);
    setTotalExpenditure(totalExpenditureMoney);
    setLoading(false);
  };

  useEffect(() => {
    getAllWarehouse();
  }, []);

  const getAllWarehouse = async () => {
    const url = `/api/v2/warehouses/list`;
    const { data } = await Api.get(url);

    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];

    data?.data?.map((item) => {
      arr.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setWarehouses(arr);
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Mã giao dịch", key: "code" },
    { label: "Tên giao dịch", key: "name" },
    { label: "Nhân viên giao dịch / thời gian", key: "user_info" },
    { label: "Số tiền", key: "money" },
    { label: "Phương thức", key: "payment_type" },
    { label: "Người nhận / Số đt", key: "customer_info" },
    { label: "Trạng thái", key: "status" },
    { label: "Ghi chú", key: "note" },
  ];

  useEffect(() => {
    let arr: Array<any> = [];

    if (rowSelection?.selectedRowKeys) {
      listPayment?.map((item) => {
        if (rowSelection.selectedRowKeys.indexOf(item?.id) != -1) {
          arr.push({
            id: item.id,
            code: item.code,
            name: item?.name,
            user_info: `${item?.created_user?.name || "--"} / ${moment(
              new Date(item?.created_at)
            ).format("H:mm DD/MM/YYYY")}`,
            money: item?.money,
            payment_type: item?.payment_type,
            customer_info: `${item?.customer_name || "--"} / ${
              item?.customer_phone || "--"
            }`,
            status: item?.status,
            note: item?.note,
          });
        }
      });
    }

    setDataExport(arr);
  }, [rowSelection?.selectedRowKeys]);

  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
  });

  const columns: ColumnsType<IRevenueExpenditure> = [
    {
      title: "Mã giao dịch",
      width: 110,
      dataIndex: "id",
      key: "ie",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span
          className="text-[#384ADC] font-medium pd-[9px]"
          onClick={(e) => {
            record?.code && onCoppy(e, record?.code);
          }}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên giao dịch",
      width: 156,
      dataIndex: "export_name",
      key: "export_name",
      align: "left",
      render: (_, record) => (
        <span className="font-medium text-[#2E2D3D]">{record.name}</span>
      ),
    },
    {
      title: "NV giao dịch / Thời gian",
      width: 210,
      dataIndex: "note",
      key: "note",
      align: "left",
      render: (_, record) => (
        <div className="flex flex-col justify-left items-left">
          <span className="font-medium text-[#384ADC]">
            {record?.created_user?.name}
          </span>
          <span className="font-medium text-[#1D1C2D] mt-[5px]">
            {moment(new Date(record?.created_at)).format("H:mm DD/MM/YYYY")}
          </span>
        </div>
      ),
    },
    {
      title: "Số tiền",
      width: 115,
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      render: (_, record) => (
        <span
          className={`font-medium ${
            record?.type === "revenue" ? "text-[#384ADC]" : "text-[#EF4444]"
          }`}
        >
          {new Intl.NumberFormat().format(record?.money || 0)} đ
        </span>
      ),
    },
    {
      title: "Phương thức",
      width: 100,
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">
          {record.payment_type}
        </span>
      ),
    },
    {
      title: "Người nhận / SĐT",
      width: 180,
      dataIndex: "totalMoney",
      key: "totalMoney",
      align: "left",
      render: (_, record) => (
        <div className="flex flex-col justify-center">
          <span className="font-medium text-[#384ADC]">
            {record?.customer_name}
          </span>
          <span className="font-medium text-[#1D1C2D] mt-[5px]">
            {record?.customer_phone}
          </span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: 96,
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <span
          className={`cursor-pointer font-semibold text-[${
            colorStatus.find((status) => status.key === record.status)?.value
          }]`}
        >
          {record?.status}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      width: 220,
      dataIndex: "note",
      key: "weight",
      align: "left",
      render: (_, record) => (
        <span className="font-medium pd-[9px] text-[#1D1C2D]">
          {record.note}
        </span>
      ),
    },
  ];

  const onDateChange: RangePickerProps["onChange"] = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings?.[0]);
      setDateTo(dateStrings?.[1]);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  };

  const onDeleteMany = async () => {
    console.log("delete: ", selectedRowKeys);
    let checkStatus = true;
    listPayment?.map((item) => {
      if (selectedRowKeys?.includes(item?.id)) {
        if (item?.status === "Đã chi" || item?.status === "Đã nhận") {
          checkStatus = false;
        }
      }
    });

    if (!checkStatus) {
      message?.error(
        "Bạn không thể xoá những phiếu đang ở trạng thái Đã nhận hoặc Đã chi"
      );
      return;
    }

    const { data } = await RevenueExpenditureApi.deleteMany(selectedRowKeys);
    if (data) {
      message.success("Xóa thành công");
    }
    setReload(uuid());
  };

  const handleUpdateStatus = async (val: string | number) => {
    let stt = "";
    if (val === "PENDING") {
      stt = "Chờ duyệt";
    }
    if (val === "PAY") {
      stt = "Đã chi";
    }
    if (val === "RECEIVE") {
      stt = "Đã nhận";
    }

    const { data } = await RevenueExpenditureApi.updateStatus({
      ids: selectedRowKeys,
      status: stt,
    });

    if (data) {
      message.success("Cập nhật thành công");
    }
    setReload(uuid());
  };

  const handlePrint = () => {
    selectedRowKeys?.map((item) => {
      window.open(`/debt-management/revenue-expenditure-print/${item}`);
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý thu chi" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium pd-[9px] mr-[12px] text-sm">
              Chọn kho
            </div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
              onChange={(value) => setWarehouseId(value)}
              value={warehouseId}
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="printer" size={24} />}
            onClick={handlePrint}
          >
            In phiếu
          </Button>
          <DropdownStatus
            text="Cập nhật trạng thái"
            options={statusOptions}
            icon="refresh"
            onRemoveSelected={() => setIsShowModalRemove(true)}
            onChange={(val) => handleUpdateStatus(val)}
          />
          <CSVLink
            headers={headers}
            data={dataExport}
            filename={"thu-chi.csv"}
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
            onClick={() => {
              setIsShowModalAddPay(true);
              setItemSelected(null);
            }}
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
          placeholder="Nhập tên giao dịch/ mã giao dịch / người nhận / số điện thoại"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        {/* <Input
          width={306}
          prefix={<Icon icon="personalcard" size={24} />}
          placeholder="Nhập tên nhân viên"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        /> */}
        <div className="w-[306px]">
          <Select
            placeholder="Chọn nhân viên"
            options={users}
            onChange={(value) => setUserIdSelected(value)}
            value={userIdSelected}
          />
        </div>
        <DateRangePickerCustom width={306} onChange={onDateChange} />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số thu chi đang chọn:{" "}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs
        defaultTab="Tất cả"
        showTabAll={false}
        tabs={tabStatus}
        onChange={(val) => setStatus(val)}
      />
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setItemSelected(record);
              setIsShowModalAddPay(true);
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listPayment}
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

      <div className={classNames("flex items-center", styles.total_wrapper)}>
        <div className={styles.row}>
          Tổng thu:{" "}
          <span className="font-medium pd-[9px] text-[#384ADC]">
            {new Intl.NumberFormat().format(totalRevenue || 0)} đ
          </span>
        </div>
        <div className={styles.row}>
          Tổng chi:{" "}
          <span className="font-medium pd-[9px] text-[#EF4444]">
            {new Intl.NumberFormat().format(totalExpenditure || 0)} đ
          </span>
        </div>
        <div className={styles.row}>
          Còn lại:{" "}
          <span
            className={classNames(
              "font-medium pd-[9px]",
              totalRevenue - totalExpenditure > 0
                ? "text-[#384ADC]"
                : "text-[#EF4444]"
            )}
          >
            {new Intl.NumberFormat().format(
              totalRevenue - totalExpenditure || 0
            )}{" "}
            đ
          </span>
        </div>
      </div>

      <ModalPayDetail
        userSelected={userSelected}
        title={
          itemSelected ? "Chi tiết hoá đơn thu chi" : "Thêm hoá đơn thu chi"
        }
        isVisible={isShowModalAddPay}
        onClose={() => {
          setIsShowModalAddPay(false);
          setItemSelected(null);
        }}
        onOpen={() => setIsShowModalAddPay(false)}
        onReload={(uuid) => setReload(uuid)}
        warehouses={warehouses}
        itemSelected={itemSelected}
      />

      <ModalRemove
        isVisible={isShowModalRemove}
        onClose={() => setIsShowModalRemove(false)}
        onOpen={() => setIsShowModalRemove(false)}
        titleBody="Xóa các phiếu này?"
        content="Thông tin của phiếu sẽ xoá khỏi hệ thống"
        onOk={onDeleteMany}
        loading={loading}
      />
    </div>
  );
};

ReactDOM.render(<ListPayment />, document.getElementById("root"));
