/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { notification, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import get from "lodash/get";
import { format } from "date-fns";
import Image from "next/image";
import { Checkbox, Form } from "antd";
import Tabs from "../../components/Tabs";
import TitlePage from "../../components/TitlePage/Titlepage";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input/Input";
import DatePicker from "../../components/DatePicker/DatePicker";
import DropdownStatus from "../../components/DropdownStatus";
import ModalSettingTarget from "./Modal/modal-setting-target";
import { StatusColorEnum, StatusEnum, StatusList } from "../../types";
import InputRangePicker from "../../components/DateRangePicker/DateRangePicker";

import classNames from "classnames";

import styles from "../../styles/DetailCustomer.module.css";

import { ITartgetManageProps } from "./staff.type";
import { productTypeList, groupStaff } from "../../const/constant";
import WarehouseApi from "../../services/warehouses";
import StaffGroupApi from "../../services/staff-groups";
import { isArray } from "../../utils/utils";
import TargetApi from "../../services/targets";
import moment from "moment";

const EditTargetManagement = () => {
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];
  const [loading, setLoading] = useState(false);
  const [staffGroups, setStaffGroups] = useState<any[]>([]);
  const [staffGroupOptions, setStaffGroupOptions] = useState<any[]>([
    {
      id: -1,
      label: "Tất cả nhóm",
      value: "Tất cả nhóm",
      total_order_handle: 1,
      total_revenue: 1,
    },
  ]);
  const [warehouses, setWarehouses] = useState([
    {
      label: "Tất cả kho",
      value: "Tất cả kho",
    },
  ]);
  const [form] = Form.useForm();

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getStaffGroups();
    getDetail();
    getAllWarehouses();
  }, []);

  const getDetail = async () => {
    const data = await TargetApi.getDetail(id);
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
    let rawStaffGroups: any[] = [];
    isArray(data.salegroup_relations)
      ? data.salegroup_relations.map((item: any) => {
          rawStaffGroups.push({
            id: item.staff_group_id,
            name: item.salegroups.name,
            label: item.salegroups.name,
            value: item.staff_group_id,
            total_order_handle: item.total_order_handle,
            total_revenue: item.total_revenue,
          });
        })
      : [];
    if (data) {
      setStaffGroups(rawStaffGroups);
      form.setFieldsValue(rawData);
    }
  };

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

  const handleChange = (e, record, keyName) => {
    const newStaffGroups = staffGroups.map((v: any) => {
      if (v.id === record.id) {
        let newValue = record;
        newValue[keyName] = e.target.value;
        return newValue;
      } else return v;
    });
    setStaffGroups([...newStaffGroups]);
  };

  const handleSelectSaleGroups = (e) => {
    let newSelectSaleGroups: any[] = [];
    let rawSelectSaleGroups: any[] = [];
    if (e.includes("Tất cả nhóm")) {
      form.setFieldValue("staff_group_ids", staffGroupOptions);
      rawSelectSaleGroups = staffGroupOptions.filter(
        (item) => item.value !== "Tất cả nhóm"
      );
    } else {
      rawSelectSaleGroups = staffGroupOptions.filter(
        (item) => e.includes(item.value) && item.value !== "Tất cả nhóm"
      );
    }
    rawSelectSaleGroups.map((item) => {
      const itemExists = staffGroups.find(
        (v: any) => get(v, "value") === item.value
      );
      if (itemExists) {
        newSelectSaleGroups.push(itemExists);
      } else {
        newSelectSaleGroups.push(item);
      }
    });
    setStaffGroups(newSelectSaleGroups);
  };

  const handleSelectWarehouses = (e) => {
    if (e.includes("Tất cả kho")) {
      form.setFieldValue("warehouse_ids", warehouses);
    }
  };

  const handleChangePercent = (value: any, key: string) => {
    if (key === "total_order_handle_percent") {
      form.setFieldValue("total_revenue_percent", 100 - value);
    } else {
      form.setFieldValue("total_order_handle_percent", 100 - value);
    }
  };

  const handleSubmit = async (e: any) => {
    console.log("e", e);
    console.log("staffGroups", staffGroups);
    let warehouseIds: any[] = [];
    let saleGroups: any[] = [];
    if (isArray(e.warehouse_ids)) {
      warehouses.map((item: any) => {
        if (
          item.value !== "Tất cả kho" &&
          e.warehouse_ids.includes(item.value)
        ) {
          warehouseIds.push({
            ...item,
          });
        }
      });
    }

    let body: any = {
      name: e.name,
      from: e.time ? e.time[0].format("YYYY-MM-DD") : null,
      to: e.time ? e.time[1].format("YYYY-MM-DD") : null,
      total_revenue_percent: e.total_revenue_percent,
      total_order_handle_percent: e.total_order_handle_percent,
      warehouse_ids: warehouseIds,
      salegroup_ids: staffGroups,
    };
    console.log("body", body);
    const data = await TargetApi.updateTarget(id, body);
    if (data) {
      notification.success({
        message: "Cập nhật chỉ tiêu thành công!",
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên nhóm",
      width: 500,
      key: "name",
      dataIndex: "name",
      fixed: "left",
      align: "left",
      render: (_, record: any) => (
        <div className={styles.row_total}>{record.name}</div>
      ),
    },
    {
      title: "Tổng số lượng đơn hàng đã xử lý",
      width: 200,
      dataIndex: "total_order_handle",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <Input
              placeholder="Nhập giá bán tại quầy"
              value={record?.total_order_handle}
              onChange={(e) => handleChange(e, record, "total_order_handle")}
            />
          </div>
        );
      },
    },
    {
      title: "Tổng doanh thu",
      width: 200,
      dataIndex: "total_revenue",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <Input
              placeholder="Nhập giá bán tại quầy"
              value={record?.total_revenue}
              onChange={(e) => handleChange(e, record, "total_revenue")}
              suffix={<span>đ</span>}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      className="w-full target-management"
    >
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <div className="flex flex-col justify-start">
          <TitlePage title="Cài đặt chỉ tiêu" href="/targets" />
        </div>
        <div className="flex gap-[8px] flex-wrap">
          <Button
            onClick={() => {
              form.submit();
            }}
            variant="secondary"
            width={187}
          >
            LƯU (F12)
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
                <Input width="100%" />
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
                  onChange={(e) => handleSelectWarehouses(e)}
                  mode="multiple"
                  placeholder="Chọn kho"
                  defaultValue={[]}
                  style={{ width: "100%" }}
                  options={warehouses}
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
                  onChange={(e) => handleSelectSaleGroups(e)}
                  mode="multiple"
                  placeholder="Chọn nhóm"
                  defaultValue={[]}
                  maxTagCount="responsive"
                  style={{ width: "100%" }}
                  options={staffGroupOptions}
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
                  <Input
                    onChange={(e) =>
                      handleChangePercent(
                        e.target.value,
                        "total_order_handle_percent"
                      )
                    }
                    width="100%"
                    suffix={<span>%</span>}
                  />
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
                  <Input
                    onChange={(e) =>
                      handleChangePercent(
                        e.target.value,
                        "total_revenue_percent"
                      )
                    }
                    width="100%"
                    suffix={<span>%</span>}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Table
          loading={loading}
          columns={columns}
          dataSource={[...staffGroups]}
          pagination={false}
          scroll={{ x: 50 }}
        />
      </div>
    </Form>
  );
};

ReactDOM.render(<EditTargetManagement />, document.getElementById("root"));
