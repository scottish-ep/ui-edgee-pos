/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import get from "lodash/get";
import { format } from "date-fns";
import Image from "next/image";
import { Checkbox, Form } from "antd";
import Tabs from "../../../components/Tabs";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DropdownStatus from "../../../components/DropdownStatus";
import ModalSettingTarget from "../Modal/modal-setting-target";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import InputRangePicker from "../../../components/DateRangePicker/DateRangePicker";

import classNames from "classnames";

import styles from "../../styles/DetailCustomer.module.css";

import { ITartgetManageProps } from "../staff.type";
import { productTypeList } from "../../../const/constant";
import TargetApi from "../../../services/targets";
import StaffGroupApi from "../../../services/staff-groups";
import { isArray } from "../../../utils/utils";
import WarehouseApi from "../../../services/warehouses";
import moment from "moment";

const EditTargetManagement = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<any>({});
  const [staffGroupOptions, setStaffGroupOptions] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState([]);
  const [pagination, setPagination] = useState<{
    current: number;
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);

  const [form] = Form.useForm();

  const [isShowModalSettingTarget, setIsShowModalSettingTarget] =
    useState(false);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getDetail();
    getStaffGroups();
    getAllWarehouses();
  }, []);

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();
    setWarehouses(
      warehouses.concat(
        data.map((v: any) => ({
          label: v.name,
          value: v.id,
          id: v.id,
        }))
      )
    );
  };

  const getStaffGroups = async () => {
    const data = await StaffGroupApi.getStaffGroup();
    const rawStaffGroupOptions =
      isArray(data) &&
      data.map((item: any) => ({
        ...item,
        label: item.name,
        value: item.id,
        total_order_handle: 0,
        total_revenue: 0,
      }));
    setStaffGroupOptions(staffGroupOptions.concat(rawStaffGroupOptions));
  };

  const getDetail = async () => {
    const data = await TargetApi.getDetail(id);
    console.log("data", data);
    let rawData: any = {
      name: data.name,
      total_order_handle_percent: data.total_order_handle_percent,
      total_revenue_percent: data.total_revenue_percent,
      staff_group_ids: isArray(data.salegroup_relations)
        ? data.salegroup_relations.map((item) => item.staff_group_id)
        : [],
      warehouse_ids: isArray(data.warehouse_relations)
        ? data.warehouse_relations.map((item) => item.warehouse_id)
        : [],
      time: [moment(data.from), moment(data.to)],
    };
    console.log("rawdata", rawData);
    if (data) {
      form.setFieldsValue(rawData);
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

  const columns: ColumnsType<ITartgetManageProps> = [
    {
      title: "",
      width: 50,
      key: "id",
      fixed: "left",
      align: "center",
      render: (_, record) => {
        return <Checkbox className="ml-[4px]" />;
      },
    },
    {
      title: "Tên nhân viên / ID",
      width: 184,
      dataIndex: "id",
      key: "name",
      fixed: "left",
      align: "left",
      render: (_, record) => (
        <div className="w-full flex justify-start">
          {/* <div className="w-[36px] relative mr-[8px]">
            <Image src={record.img} layout="fill" />
          </div> */}
          <div className="flex flex-col justify-start">
            <p className="text-medium font-medium text-[#384ADC]">
              {record.name}
            </p>
            <p className="text-medium font-medium text-[#5F5E6B]">
              {record.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      width: 130,
      dataIndex: "role",
      key: "name",
      align: "center",
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">{record.role}</span>
        </div>
      ),
    },
    {
      title: "Tổng số lượng đơn hàng",
      width: 132,
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.orderSum - b.orderSum,
      align: "center",
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.order}</span>
      ),
    },
    {
      title: "Doanh thu",
      width: 150,
      dataIndex: "profit",
      sorter: (a, b) => a.orderProfit - b.orderProfit,
      key: "profit",
      align: "center",
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.profit} đ</span>
      ),
    },
    {
      title: "KPI đơn hàng",
      width: 315,
      sorter: (a, b) => a.orderKpiOrder - b.orderKpiOrder,
      dataIndex: "kpiorder",
      key: "kpiorder",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="w-[55%] flex items-center justify-between">
            <div className="w-[135px] h-[6px] rounded-lg relative bg-slate-200">
              <div
                className="h-[6px] rounded-lg absolute bg-sky-500"
                style={{
                  width: `${
                    Math.round((record.order / record.kpiorder) * 1000) / 10
                  }%`,
                }}
              ></div>
            </div>
            <div className="text-medium font-medium text-[#0EA5E9]">
              {Math.round((record.order / record.kpiorder) * 1000) / 10}%
            </div>
          </div>
          <div className="w-[28%] flex justify-around text-[#909098]">
            <span className="font-medium text-[#FF970D]">{record.order}</span>
            <span className="text-medium font-medium text-[#F0F0F1]">/</span>
            <span className="font-medium text-[#909098]">
              {record.kpiorder}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "KPI doanh thu",
      width: 315,
      dataIndex: "kpiprofit",
      sorter: (a, b) => a.orderKpiProfit - b.orderKpiProfit,
      key: "kpiprofit",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="w-[55%] flex items-center justify-between">
            <div className="w-[135px] h-[6px] rounded-lg relative bg-slate-200">
              <div
                className="h-[6px] rounded-lg absolute bg-green-500"
                style={{
                  width: `${
                    Math.round((record.profit / record.kpiprofit) * 1000) / 10
                  }%`,
                }}
              ></div>
            </div>
            <div className="text-medium font-medium text-[#10B981]">
              {Math.round((record.profit / record.kpiprofit) * 1000) / 10}%
            </div>
          </div>
          <div className="w-[50%] flex justify-around text-[#909098]">
            <span className="font-medium text-[#FF970D]">{record.profit}</span>
            <span className="text-medium font-medium text-[#F0F0F1]">/</span>
            <span className="font-medium text-[#909098]">
              {record.kpiprofit}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const data = Array(50).fill({
    show: true,
    id: "NV0001",
    name: "Yến Nhi",
    img: "",
    role: "Sale cấp 1",
    category: "Áo",
    order: 150,
    profit: 13500000,
    kpiorder: 270,
    kpiprofit: 30000000,
  });

  const handleSubmit = () => {};

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      className="w-full target-management"
    >
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <div className="flex flex-col justify-start">
          <TitlePage title="Chi tiết chỉ tiêu" href="/targets" />
        </div>
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="outlined"
            width={158}
            color="white"
            icon={<Icon icon="settings-1" size={24} />}
            onClick={() => (window.location.href = "/targets/edit/" + id)}
          >
            Cài đặt chỉ tiêu
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
      <div className="flex flex-row gap-[12px] mb-[24px]">
        <div className="flex flex-col flex-1">
          <div
            className={styles.table}
            style={{ marginBottom: 0, height: "100%" }}
          >
            <div className={styles.row}>
              <div className={styles.row_label}>
                Tên KPI <span className="text-[#EF4444]">*</span>
              </div>
              <Form.Item
                className="flex flex-1"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên KPI là bắt buộc!",
                  },
                ]}
              >
                <Input disabled width="100%" />
              </Form.Item>
            </div>
          </div>
          <div
            className={styles.table}
            style={{ marginBottom: 0, height: "100%" }}
          >
            <div className={styles.row}>
              <div className={styles.row_label}>
                Chọn kho áp dụng <span className="text-[#EF4444]">*</span>
              </div>
              <Form.Item
                className="flex flex-1"
                name="warehouse_ids"
                rules={[
                  {
                    required: true,
                    message: "Chọn kho áp dụng là bắt buộc!",
                  },
                ]}
              >
                <Select
                  options={warehouses}
                  mode="multiple"
                  placeholder="Chọn kho"
                  defaultValue={[]}
                  style={{ width: "100%" }}
                  disabled
                  maxTagCount="responsive"
                />
              </Form.Item>
            </div>
          </div>
          <div
            className={styles.table}
            style={{ marginBottom: 0, height: "100%" }}
          >
            <div className={styles.row}>
              <div className={styles.row_label}>
                Thời gian áp dụng <span className="text-[#EF4444]">*</span>
              </div>
              <Form.Item
                className="flex flex-1"
                name="time"
                rules={[
                  {
                    required: true,
                    message: "Thời gian áp dụng là bắt buộc!",
                  },
                ]}
              >
                <InputRangePicker
                  disabled
                  placeholder={["Ngày tạo bắt đầu", "Ngày tạo kết thúc"]}
                  width={"100%"}
                  prevIcon={<Icon size={24} icon="calendar" />}
                />
              </Form.Item>
            </div>
          </div>
          <div
            className={styles.table}
            style={{ marginBottom: 0, height: "100%" }}
          >
            <div className={styles.row}>
              <div className={styles.row_label}>
                Chọn nhóm áp dụng <span className="text-[#EF4444]">*</span>
              </div>
              <Form.Item
                className="flex flex-1"
                name="staff_group_ids"
                rules={[
                  {
                    required: true,
                    message: "Chọn nhóm áp dụng là bắt buộc!",
                  },
                ]}
              >
                <Select
                  options={staffGroupOptions}
                  mode="multiple"
                  placeholder="Chọn nhóm"
                  defaultValue={[]}
                  maxTagCount="responsive"
                  style={{ width: "100%" }}
                  disabled
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div
            className={styles.table}
            style={{ marginBottom: 0, height: "100%" }}
          >
            <div className={styles.row_label}>Chọn trọng số áp dụng</div>
            <div className="w-full mt-[12px]">
              <div className={classNames(styles.heading_table, styles.row)}>
                <div className={classNames("w-4/6", styles.row_total)}>
                  Tên chỉ tiêu
                </div>
                <div
                  className={classNames(styles.row_total, "w-8/12 text-center")}
                >
                  Trọng số
                </div>
              </div>
              <div className={styles.row}>
                <div className={classNames("w-4/6", styles.row_title)}>
                  Tổng số lượng đơn hàng đã xử lý
                </div>
                <Form.Item
                  className="w-8/12"
                  name="total_order_handle_percent"
                  rules={[
                    {
                      required: true,
                      message: "Tổng số lượng đơn hàng đã xử lý là bắt buộc!",
                    },
                  ]}
                >
                  <Input disabled width="100%" suffix={<span>%</span>} />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={classNames("w-4/6", styles.row_title)}>
                  Tổng doanh thu
                </div>
                <Form.Item
                  className="w-8/12"
                  name="total_revenue_percent"
                  rules={[
                    {
                      required: true,
                      message: "Tổng doanh thu là bắt buộc!",
                    },
                  ]}
                >
                  <Input disabled width="100%" suffix={<span>%</span>} />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          width="100%"
          className="flex flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập ID/ Tên nhân viên"
        />
        <Select
          containerClassName="flex flex-1"
          allowClear
          clearIcon={<Icon icon="cancel" size={16} />}
          prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
          placeholder="Tìm theo nhóm nhân viên"
          options={staffGroupOptions}
        />
      </div>
      <div className="w-full">
        <Table columns={columns} dataSource={[]} scroll={{ x: 50 }} />
      </div>
      <ModalSettingTarget
        title="Cài đặt chỉ tiêu"
        isVisible={isShowModalSettingTarget}
        onClose={() => setIsShowModalSettingTarget(false)}
        onOpen={() => setIsShowModalSettingTarget(false)}
      />
    </Form>
  );
};

ReactDOM.render(<EditTargetManagement />, document.getElementById("root"));
