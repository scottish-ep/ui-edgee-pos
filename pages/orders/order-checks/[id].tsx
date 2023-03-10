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
  const [statusQuery, setStatusQuery] = useState<string>("T???t c???");
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
    { name: "T???t c???", count: 10 },
    { name: "Kh???p", count: 20 },
    { name: "L???ch", count: 30 },
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
    item_status: "Ch??a ?????i so??t",
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
  //     { name: "T???t c???", count: countAll || 0 },
  //     { name: "Kh???p", count: countTrue || 0 },
  //     { name: "L???ch", count: countFalse || 0 },
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
  //       message: "C???p nh???t th??nh c??ng",
  //     });
  //     window.location.href = "/order-management/check-orders";
  //   }
  // };

  // const handleDelete = async () => {
  //   const { data } = await OrderCheckCommandApi.deleteMany([id]);
  //   if (data) {
  //     notification.success({
  //       message: "X??a th??nh c??ng",
  //     });
  //     window.location.href = "/order-management/check-orders";
  //   }
  // };

  const columns: ColumnsType<IOrderCheckCommandItems> = [
    {
      title: "M?? v???n ????n",
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
      title: "M?? ????n h??ng",
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
      title: "Tr???ng th??i ????n h??ng",
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
      title: "COD (H??? th???ng)",
      width: 100,
      dataIndex: "codSystem",
      key: "codSystem",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#6366F1]">
          {record?.system_cod_fee_vendor || 0} ??
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
          {record?.cod_fee_vendor || 0} ??
        </span>
      ),
    },
    {
      title: "Ph?? GH (H??? th???ng)",
      width: 100,
      dataIndex: "priceSystem",
      key: "priceSystem",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#6366F1]">
          {record?.system_transport_fee_vendor || 0} ??
        </span>
      ),
    },
    {
      title: "Ph?? GH (NVC)",
      width: 100,
      dataIndex: "priceNVC",
      key: "priceNVC",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record?.transport_fee_vendor || 0} ??
        </span>
      ),
    },
    {
      title: "C??n n???ng (H??? th???ng)",
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
      title: "C??n n???ng (NVC)",
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
      title: "K???t qu??? ?????i so??t",
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
      title: "Ti???n ch??nh l???ch",
      width: 150,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.cod_fee_vendor - record.system_cod_fee_vendor} ??
        </span>
      ),
    },
    {
      title: "Tr???ng th??i",
      width: 150,
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <span
          className={`text-medium font-semibold ${
            record?.item_status === "Ch??a ?????i so??t"
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
  //     if (exist && exist.item_status == "???? ?????i so??t") {
  //       hasError = true;
  //     } else {
  //       hasUpdate = true;
  //     }
  //   });
  //   if (hasError) {
  //     notification.error({
  //       message: "Kh??ng th??? chuy???n tr???ng th??i c???a ????n h??ng ???? ?????i so??t!",
  //     });
  //   }

  //   const { data } = await OrderCheckCommandApi.updateCommandItemsStatus({
  //     ids: rowSelection?.selectedRowKeys || [],
  //     status: stt,
  //   });
  //   if (data) {
  //     if (hasUpdate) {
  //       notification.success({
  //         message: "C???p nh???t th??nh c??ng",
  //       });
  //     }
  //     setReload(uuid());
  //   }
  // };

  const headers = [
    { label: "ID", key: "id" },
    { label: "M?? v???n ????n", key: "order_tracking_code" },
    { label: "M?? ????n h??ng", key: "order_id" },
    { label: "Tr???ng th??i ????n h??ng", key: "order_status" },
    { label: "COD (H??? th???ng)", key: "system_cod_fee_vendor" },
    { label: "COD (NVC)", key: "cod_fee_vendor" },
    { label: "Ph?? GH (H??? th???ng)", key: "system_transport_fee_vendor" },
    { label: "Ph?? GH (NVC)", key: "transport_fee_vendor" },
    { label: "C??n n???ng (H??? th???ng)", key: "system_weight_vendor" },
    { label: "C??n n???ng (NVC)", key: "weight_vendor" },
    { label: "K???t qu??? ?????i so??t", key: "order_check_result" },
    { label: "Ti???n ch??nh l???ch", key: "difference_money" },
    { label: "Tr???ng th??i", key: "item_status" },
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
          title="Chi ti???t phi??n ?????i so??t"
        />
        <div className="flex gap-x-2 flex-wrap">
          <Button
            variant="danger-outlined"
            width={118}
            icon={<Icon icon="trash" size={24} />}
            onClick={() => setIsShowModalRemoveOrderChecks(true)}
          >
            X??a
          </Button>
          <Button
            variant="secondary"
            width={166}
            style={{ fontWeight: "bold" }}
            // onClick={onSubmit}
          >
            L??u (F12)
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <InfoItem title="M?? phi??n ?????i so??t" description={detail?.code} />
          <InfoItem
            title="Th???i ??i???m t???o"
            description={format(
              parseISO(detail.created_at),
              "dd/MM/yyyy - HH:mm"
            )}
          />
          <InfoItem
            title="Nh??n vi??n t???o phi???u"
            description={detail?.user_name}
          />
          <InfoItem
            title="????n v??? v???n chuy???n"
            description={detail?.transport_company_name}
          />
          <InfoItem title="Kho ?????i so??t" description={detail?.warehouse_name} />
        </div>
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <Select
            label="Tr???ng th??i"
            placeholder="Ch???n tr???ng th??i"
            defaultValue={detail?.status}
            options={[
              {
                label: "M???i",
                value: "M???i",
              },
              {
                label: "Ho??n t???t",
                value: "Ho??n t???t",
              },
            ]}
            onChange={(val) => setStatus(val)}
          />
          <TextArea
            label="Ghi ch??"
            className="!h-[79px]"
            placeholder="Nh???p ghi ch??"
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
          placeholder="Nh???p m?? v???n ????n / m?? ????n h??ng"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />

        <DropdownStatus
          text="C???p nh???t tr???ng th??i"
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
              message: "Download th??nh c??ng",
            });
          }}
        >
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
            disabled={selectedRowKeys.length === 0}
          >
            Xu???t file
          </Button>
        </CSVLink>
      </div>

      <Tabs
        defaultTab="T???t c???"
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
              T???ng COD (H??? th???ng):
            </span>
            <span className="text-medium font-semibold text-[#384ADC]">
              {totalCodSystem} ??
            </span>
          </div>
          <div className="flex gap-x-1 border-l border-l-[#4B4B59] border-r border-r-[#4B4B59] px-3 mx-3">
            <span className="text-medium text-[#4B4B59]">T???ng COD (NVC):</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              {totalCodNVC} ??
            </span>
          </div>
          <div className="flex gap-x-1">
            <span className="text-medium text-[#4B4B59]">T???ng ch??nh l???ch:</span>
            <span className="text-medium font-semibold text-[#2E2D3D]">
              {" "}
              {totalDifferenceMoney} ??
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
        titleBody="X??a phi??n ?????i so??t n??y?"
        content="Th??ng tin c???a phi??n ?????i so??t s??? kh??ng c??n n???a."
        // onOk={handleDelete}
      />
    </div>
  );
};

export default OrderChecksDetail;
