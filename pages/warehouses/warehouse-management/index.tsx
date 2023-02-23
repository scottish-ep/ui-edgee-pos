import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";

import {
  districtList,
  provinceList,
  wardList,
  warehouseManagementList,
} from "../../../const/constant";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import {
  IWareHouseManagementDetail,
  IWareHouseManagement,
} from "../warehouse.type";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import TableEmpty from "../../../components/TableEmpty";
import ModalAddEditWareHouseManagement from "./ModalAddEditWareHouseManagement";
import moment from "moment";
import { isArray, onCoppy, randomId } from "../../../utils/utils";
import { get } from "lodash";
import { uuid } from "uuidv4";

const WareHouseManagementList: React.FC = () => {
  const [warehouseManagement, setWareHouseManagement] = useState<
    IWareHouseManagement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState("");
  const [
    isShowModalRemoveWarehouseManagement,
    setIsShowModalRemoveWarehouseManagement,
  ] = useState<{
    isvisible: boolean;
    id: number | null;
  }>({
    isvisible: false,
    id: null,
  });
  const [
    isShowModalAddEditWarehouseManagement,
    setIsShowModalAddEditWarehouseManagement,
  ] = useState(false);
  const [detail, setDetail] = useState<IWareHouseManagementDetail>();

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }

    getData();
  }, [reload]);

  const getData = () => {
    const url = "/api/v2/warehouses/list";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        console.log("result", result);
        const listWarehouseManagement =
          isArray(result) &&
          result.map((item: IWareHouseManagementDetail) => ({
            ...item,
            province: provinceList.find(
              (itemProvince) => itemProvince.id === item.province_id
            ),
            district: districtList.find(
              (itemDistrict) => itemDistrict.id === item.district_id
            ),
            wards: wardList.find((itemWard) => itemWard.id === item.ward_id),
          }));
        setWareHouseManagement(listWarehouseManagement);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleAddWarehouse = (value: any) => {
    if (!value || !value.name) {
      alert("Vui lòng nhập tên kho");
      return;
    }
    setIsShowModalAddEditWarehouseManagement(false);
    setLoading(true);
    const url = detail
      ? `/api/v2/warehouses/update/${value.id}`
      : "/api/v2/warehouses/create";
    const body = {
      name: value.name,
      description: value.description,
      phone_number: value.phone_number,
      district_id: get(value, "district.id") || null,
      province_id: get(value, "province.id") || null,
      ward_id: get(value, "wards.id") || null,
      address: value.address || null,
    };
    const options = {
      method: detail ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log("data return", data);
        if (detail) {
          let newWarehouseManagement = warehouseManagement;
          const indexUpdate = warehouseManagement.findIndex(
            (item) => item.id == value.id
          );
          newWarehouseManagement[indexUpdate] = value;
          console.log("newWarehouseManagement", newWarehouseManagement);
          setWareHouseManagement(newWarehouseManagement);
        } else {
          setWareHouseManagement([
            ...warehouseManagement,
            {
              ...value,
              updated_at: new Date().toString(),
              id: get(data, "data.id"),
            },
          ]);
        }
        setLoading(false);
      });
  };

  const handleDeleteWarehouse = (id: number) => {
    setLoading(true);
    // setIsShowModalRemoveWarehouseManagement({
    //   id: null,
    //   isvisible: false,
    // });
    const url = `/api/v2/warehouses/delete/${id}`;
    const options = {
      method: "DELETE",
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "🚀 ~ file: warehouse-management-list.tsx:147 ~ .then ~ data",
          data?.data
        );
        if (data?.data?.status === "error") {
          message.error(data?.data?.message);
        } else {
          message.success(data?.data?.message);
          setReload(uuid());
        }
        setLoading(false);
      });
  };

  const data: IWareHouseManagement[] = Array(50)
  .fill({
    name: "Kho Mai Linh",
    phone_number: "08546464661",
    ward_info: {
      prefix: "123",
      name: "Phuong 11"
    },
    district_info: {
      prefix: "123",
      name: "Quan 11"
    },
    province_info: {
      prefix: "123",
      name: "HCM"
    },
    description: "khong co",
    updated_at: Date.now(),

  })

  const columns: ColumnsType<IWareHouseManagement> = [
    {
      title: "Tên kho",
      width: 200,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.name}
        </span>
      ),
    },
    {
      title: "SĐT",
      width: 150,
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium font-medium text-[#1D1C2D]"
          onClick={(e) => {
            record?.phone_number && onCoppy(e, record?.phone_number);
          }}
        >
          {record.phone_number}
        </span>
      ),
    },
    {
      title: "Địa chỉ",
      width: 250,
      dataIndex: "address",
      key: "address",
      align: "left",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.address} {record?.ward_info ? ", " : ""}
          {record?.ward_info?.prefix} {record?.ward_info?.name}
          {record?.district_info ? ", " : ""}
          {record?.district_info?.prefix} {record?.district_info?.name}
          {record?.province_info ? ", " : ""} {record?.province_info?.name}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      width: 150,
      dataIndex: "note",
      key: "note",
      align: "left",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.description}
        </span>
      ),
    },
    {
      title: "Cập nhật lần cuối",
      width: 150,
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (_, record) => {
        return (
          <span className="text-medium font-medium text-[#1D1C2D]">
            {format(new Date(record.updated_at), "dd/MM/yyyy")}
          </span>
        );
      },
    },
    {
      title: "",
      width: 100,
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-x-6">
          <div
            onClick={() => {
              setDetail(record);
              setIsShowModalAddEditWarehouseManagement(true);
            }}
          >
            <Icon icon="edit-2" />
          </div>
          <div
            onClick={() => {
              handleDeleteWarehouse(record.id);
              // setIsShowModalRemoveWarehouseManagement({
              //   id: record.id || null,
              //   isvisible: true,
              // });
            }}
          >
            <Icon icon="trash" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Danh sách kho hàng" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => {
              setDetail(undefined);
              setIsShowModalAddEditWarehouseManagement(true);
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
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        // loading={loading}
        columns={columns}
        // dataSource={[...warehouseManagement]}
        dataSource={data}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <ModalRemove
        isVisible={isShowModalRemoveWarehouseManagement.isvisible}
        onClose={() =>
          setIsShowModalRemoveWarehouseManagement({
            ...isShowModalRemoveWarehouseManagement,
            isvisible: false,
          })
        }
        onOpen={() =>
          isShowModalRemoveWarehouseManagement.id &&
          handleDeleteWarehouse(isShowModalRemoveWarehouseManagement.id)
        }
        titleBody="Xóa kho hàng này?"
        content="Tất cả dữ liệu của kho hàng này sẽ không còn nữa"
      />

      <ModalAddEditWareHouseManagement
        detail={detail}
        isVisible={isShowModalAddEditWarehouseManagement}
        onClose={() => setIsShowModalAddEditWarehouseManagement(false)}
        onReload={(uuid: string) => setReload(uuid)}
      />
    </div>
  );
};
export default WareHouseManagementList;
