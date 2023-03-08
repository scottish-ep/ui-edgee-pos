/* eslint-disable react-hooks/exhaustive-deps */
import { format, parseISO } from "date-fns";
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import TextArea from "../../../components/TextArea";
import TitlePage from "../../../components/TitlePage/Titlepage";
import DropdownStatus from "../../../components/DropdownStatus";
import { statusOrderChecksOptions } from "../../../const/constant";
import OrderChecksDetailTable from "./OrderChecksDetailTable";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import { StatusEnum } from "../../../types";
import OrderCheckCommandApi from "../../../services/order-check-command";
import { IOrderCheckCommandItems, IOrderChecksDetail } from "../orders.type";
import { message, notification } from "antd";
// import PaginationCustom from "../../../components/PaginationCustom";
import Table, { ColumnsType } from "antd/lib/table";
import { onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import { useDebounce } from "usehooks-ts";
import Tabs from "../../../components/Tabs";
import { uuid } from "uuidv4";
import { CSVLink } from "react-csv";

const OrderChecksDetail: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detail, setDetail] = useState<IOrderChecksDetail>(
    {
      id: "1",
      created_at: "2020-11-20T10:36:01.516Z.",
      updated_at: "2020-11-20T10:36:01.516Z.",
      code: "102",
      user_name: "tester",
      transport_company_name: "Cong ty Test",
      warehoure_name: "Kho test",
      status: "Hoan Thanh",
      note: "khong co",
      warehouse_name: "Kho Mai Linh"
    }
  );
  const [orderCheckCommandItems, setOrderCheckCommandItems] =
    useState<Array<IOrderCheckCommandItems>>();
  const [dataExport, setDataExport] = useState<Array<IOrderCheckCommandItems>>(
    []
  );
  const [isShowModalRemoveOrderChecks, setIsShowModalRemoveOrderChecks] =
    useState(false);
  const [id, setId] = useState<string | number | undefined>();
  const [status, setStatus] = useState<string>();
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [reload, setReload] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const debouncedValue = useDebounce<string>(searchPhrase, 500);
  const [statusQuery, setStatusQuery] = useState<string>("Tất cả");
  const [totalCodSystem, setTotalCodSystem] = useState<number>(300000);
  const [totalCodNVC, setTotalCodNVC] = useState<number>(20000);
  const [totalDifferenceMoney, setTotalDifferenceMoney] = useState<number>(20000);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>({
    total: 1,
    pageSize: 10,
    page: 1,
  });
  const refname = useRef<any>(null);
  const handleClick = () => {
    refname.current.focus();
  };

  const [tabStatus, setTabStatus] = useState([
    { name: "Tất cả", count: 10 },
    { name: "Khớp", count: 20 },
    { name: "Lệch", count: 30 },
  ]);

  const colsData: IOrderCheckCommandItems[] = Array(20)
  .fill({
    order_tracking_code: "MX123sa",
    order_status: "Deliveried",
    system_cod_fee_vendor: 10000,
    code_fee_vendor: 10002,
    system_transport_fee_vendor: 102201,
    transport_fee_vendor: 12000,
    system_weight_vendor: 40,
    weight_vendor: 20,
    order_check_result: "Done",
    item_status: "Chưa đối soát",
  })
  .map((item, index) => ({...item, order_id: index++}))

  // useEffect(() => {
  //   const search = window.location.search;
  //   const params = new URLSearchParams(search);
  //   const idParam = String(params.get("id"));
  //   setId(idParam);
  // }, []);

  // useEffect(() => {
  //   if (id) {
  //     getOrderCheckCommandDetail();
  //   }
  // }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     getOrderCheckCommandItems();
  //   }
  // }, [
  //   id,
  //   pagination.page,
  //   pagination.pageSize,
  //   debouncedValue,
  //   reload,
  //   statusQuery,
  // ]);

  // const getOrderCheckCommandDetail = async () => {
  //   const { data } = await OrderCheckCommandApi.detail(id);
  //   setDetail(data);
  // };

  // const getOrderCheckCommandItems = async () => {
  //   setLoading(true);
  //   const {
  //     data,
  //     countAll,
  //     countTrue,
  //     countFalse,
  //     totalCodSystem,
  //     totalCodNVC,
  //     totalDifferenceMoney,
  //     totalItems,
  //     totalPage,
  //   } = await OrderCheckCommandApi.getOrderCheckCommandItems(id, {
  //     limit: pagination.pageSize,
  //     page: pagination.page,
  //     code: searchPhrase,
  //     status: statusQuery,
  //   });
  //   setPagination({
  //     ...pagination,
  //     total: totalPage * pagination.pageSize,
  //   });
  //   setOrderCheckCommandItems(data);
  //   setTabStatus([
  //     { name: "Tất cả", count: countAll || 0 },
  //     { name: "Khớp", count: countTrue || 0 },
  //     { name: "Lệch", count: countFalse || 0 },
  //   ]);
  //   setLoading(false);
  //   setTotalCodSystem(totalCodSystem);
  //   setTotalCodNVC(totalCodNVC);
  //   setTotalDifferenceMoney(totalDifferenceMoney);
  // };

  const InfoItem = ({
    title = "--",
    description = "--",
  }: {
    title?: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-medium font-medium text-[#2E2D3D]">{title}</span>
      <span className="text-medium font-medium text-[#2E2D3D]">
        {description}
      </span>
    </div>
  );

  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   console.log("selectedRowKeys changed: ", selectedRowKeys);
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  // const onSubmit = async () => {
  //   const { data } = await OrderCheckCommandApi.update({
  //     id,
  //     status,
  //     note,
  //   });

  //   if (data) {
  //     notification.success({
  //       message: "Cập nhật thành công",
  //     });
  //     window.location.href = "/order-management/check-orders";
  //   }
  // };

  // const handleDelete = async () => {
  //   const { data } = await OrderCheckCommandApi.deleteMany([id]);
  //   if (data) {
  //     notification.success({
  //       message: "Xóa thành công",
  //     });
  //     window.location.href = "/order-management/check-orders";
  //   }
  // };

  const columns: ColumnsType<IOrderCheckCommandItems> = [
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
          onClick={(e) => onCoppy(e, record?.order_tracking_code || "")}
        >
          {record?.order_tracking_code}
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
          onClick={(e) => onCoppy(e, record?.order_id || "")}
        >
          {record?.order_id}
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
          {record?.order_status}
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
          {record?.system_cod_fee_vendor || 0} đ
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
          {record?.cod_fee_vendor || 0} đ
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
          {record?.system_transport_fee_vendor || 0} đ
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
          {record?.transport_fee_vendor || 0} đ
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
          {record?.system_weight_vendor || 0} kg
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
          {record?.weight_vendor} kg
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
          {record?.order_check_result}
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
          {record.cod_fee_vendor - record.system_cod_fee_vendor} đ
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
          className={`text-medium font-semibold ${
            record?.item_status === "Chưa đối soát"
              ? "text-[#F97316]"
              : "text-[#10B981]"
          }`}
        >
          {record?.item_status}
        </span>
      ),
    },
  ];

  // const handleUpdateStatus = async (stt: string | number) => {
  //   handleClick();
  //   let hasError = false;
  //   let hasUpdate = false;
  //   rowSelection?.selectedRowKeys.map((rowId) => {
  //     const exist = orderCheckCommandItems?.find((item) => item.id == rowId);
  //     if (exist && exist.item_status == "Đã đối soát") {
  //       hasError = true;
  //     } else {
  //       hasUpdate = true;
  //     }
  //   });
  //   if (hasError) {
  //     notification.error({
  //       message: "Không thể chuyển trạng thái của đơn hàng đã đối soát!",
  //     });
  //   }

  //   const { data } = await OrderCheckCommandApi.updateCommandItemsStatus({
  //     ids: rowSelection?.selectedRowKeys || [],
  //     status: stt,
  //   });
  //   if (data) {
  //     if (hasUpdate) {
  //       notification.success({
  //         message: "Cập nhật thành công",
  //       });
  //     }
  //     setReload(uuid());
  //   }
  // };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Mã vận đơn", key: "order_tracking_code" },
    { label: "Mã đơn hàng", key: "order_id" },
    { label: "Trạng thái đơn hàng", key: "order_status" },
    { label: "COD (Hệ thống)", key: "system_cod_fee_vendor" },
    { label: "COD (NVC)", key: "cod_fee_vendor" },
    { label: "Phí GH (Hệ thống)", key: "system_transport_fee_vendor" },
    { label: "Phí GH (NVC)", key: "transport_fee_vendor" },
    { label: "Cân nặng (Hệ thống)", key: "system_weight_vendor" },
    { label: "Cân nặng (NVC)", key: "weight_vendor" },
    { label: "Kết quả đối soát", key: "order_check_result" },
    { label: "Tiền chênh lệch", key: "difference_money" },
    { label: "Trạng thái", key: "item_status" },
  ];

  // useEffect(() => {
  //   let arr: Array<IOrderCheckCommandItems> = [];

  //   if (rowSelection?.selectedRowKeys) {
  //     orderCheckCommandItems?.map((item) => {
  //       if (rowSelection.selectedRowKeys.indexOf(item?.id) != -1) {
  //         arr.push(item);
  //       }
  //     });
  //   }
  //   setDataExport(arr);
  // }, [rowSelection?.selectedRowKeys]);

  // if (!detail) {
  //   return null;
  // }

  return (
    <div className="w-full" ref={refname}>
      {/* Header */}
      <div className="flex gap-2 justify-between mb-5 flex-wrap">
        <TitlePage
          href="/orders/order-checks"
          title="Chi tiết phiên đối soát"
        />
        <div className="flex gap-x-2 flex-wrap">
          <Button
            variant="danger-outlined"
            width={118}
            icon={<Icon icon="trash" size={24} />}
            onClick={() => setIsShowModalRemoveOrderChecks(true)}
          >
            Xóa
          </Button>
          <Button
            variant="secondary"
            width={166}
            style={{ fontWeight: "bold" }}
            // onClick={onSubmit}
          >
            Lưu (F12)
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <InfoItem title="Mã phiên đối soát" description={detail?.code} />
          <InfoItem
            title="Thời điểm tạo"
            description={format(
              parseISO(detail.created_at),
              "dd/MM/yyyy - HH:mm"
            )}
          />
          <InfoItem
            title="Nhân viên tạo phiếu"
            description={detail?.user_name}
          />
          <InfoItem
            title="Đơn vị vận chuyển"
            description={detail?.transport_company_name}
          />
          <InfoItem title="Kho đối soát" description={detail?.warehouse_name} />
        </div>
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <Select
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            defaultValue={detail?.status}
            options={[
              {
                label: "Mới",
                value: "Mới",
              },
              {
                label: "Hoàn tất",
                value: "Hoàn tất",
              },
            ]}
            onChange={(val) => setStatus(val)}
          />
          <TextArea
            label="Ghi chú"
            className="!h-[79px]"
            placeholder="Nhập ghi chú"
            defaultValue={detail?.note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      {/* Filter */}
      <div className="flex gap-x-2 mt-4 mb-3 flex-wrap">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã vận đơn / mã đơn hàng"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />

        <DropdownStatus
          text="Cập nhật trạng thái"
          options={statusOrderChecksOptions}
          icon="refresh"
          disabled={selectedRowKeys.length === 0}
          // onChange={(stt) => handleUpdateStatus(stt)}
        />
        <CSVLink
          headers={headers}
          data={dataExport}
          filename={"order-check-command-items.csv"}
          onClick={() => {
            notification.success({
              message: "Download thành công",
            });
          }}
        >
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
            disabled={selectedRowKeys.length === 0}
          >
            Xuất file
          </Button>
        </CSVLink>
      </div>

      <Tabs
        defaultTab="Tất cả"
        showTabAll={false}
        tabs={tabStatus}
        onChange={(val) => setStatusQuery(val)}
      />
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        // rowSelection={rowSelection}
        columns={columns}
        loading={loading}
        // dataSource={orderCheckCommandItems}
        dataSource={colsData}
        pagination={{
          total: pagination.total,
          defaultPageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onChange={(e) => {
          setPagination({
            ...pagination,
            page: e.current || 1,
            pageSize: e.pageSize || 10,
          });
        }}
        scroll={{ x: 50 }}
      />
      <div className="flex items-center justify-between flex-wrap-reverse gap-2">
        <div className="flex items-center h-max">
          <div className="flex gap-x-1">
            <span className="text-medium text-[#4B4B59]">
              Tổng COD (Hệ thống):
            </span>
            <span className="text-medium font-semibold text-[#384ADC]">
              {totalCodSystem} đ
            </span>
          </div>
          <div className="flex gap-x-1 border-l border-l-[#4B4B59] border-r border-r-[#4B4B59] px-3 mx-3">
            <span className="text-medium text-[#4B4B59]">Tổng COD (NVC):</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              {totalCodNVC} đ
            </span>
          </div>
          <div className="flex gap-x-1">
            <span className="text-medium text-[#4B4B59]">Tổng chênh lệch:</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              {" "}
              {totalDifferenceMoney} đ
            </span>
          </div>
        </div>

        {/* <PaginationCustom
          total={totalItems}
          defaultPageSize={pageSize}
          current={page}
          onChangePage={(page) => setPage(page)}
          onChangePageSize={(pageSize) => setPageSize(pageSize)}
        /> */}
      </div>
      <ModalRemove
        isVisible={isShowModalRemoveOrderChecks}
        onClose={() => setIsShowModalRemoveOrderChecks(false)}
        onOpen={() => setIsShowModalRemoveOrderChecks(false)}
        titleBody="Xóa phiên đối soát này?"
        content="Thông tin của phiên đối soát sẽ không còn nữa."
        // onOk={handleDelete}
      />
    </div>
  );
};

export default OrderChecksDetail;
