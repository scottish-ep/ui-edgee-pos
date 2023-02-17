/* eslint-disable react-hooks/exhaustive-deps */
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import DatePicker from "../../../components/DatePicker/DatePicker";
import Modal from "../../../components/Modal/Modal/Modal";
import { Table } from "antd";
import Icon from "../../../components/Icon/Icon";
import { ColumnsType } from "antd/es/table";
import { listDebtDetail } from "../../../const/constant";
import Upload from "../../../components/Upload/Upload";
import StaffApi from "../../../services/staffs";
import { isArray } from "lodash";

interface ModalSettingFaultProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose: () => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  titleBody?: string;
  time?: string;
  deal?: string;
  method?: string;
  status?: StatusEnum;
  id?: string;
  staffGroups: any[];
  warehouses: any[];
  handleSubmit: any;
  submitLoading: boolean;
  // staffs: any[];
}

const ModalSettingStaff = (props: ModalSettingFaultProps) => {
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    staffGroups,
    warehouses,
    // staffs,
    handleSubmit,
    submitLoading,
  } = props;
  const [warehouseSelected, setWarehouseSelected] = useState<number>();
  const [staffGroupSelected, setStaffGroupSelected] = useState<number>();
  const [staffSelected, setStaffSelected] = useState<any[]>([]);
  const [staffSelectedIds, setStaffSelectedIds] = useState<number[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onWareHouseChange = (value: number) => {
    setWarehouseSelected(value);
    if (value === -1) {
      setStaffSelected([]);
    }
  };

  const onStaffGroupChange = (value: number) => {
    setStaffGroupSelected(value);
    if (value === -1) {
      setStaffSelected([]);
    }
  };

  const getAllStaffs = async () => {
    setLoading(true);
    let filterNotEqual = {};
    if (warehouseSelected && warehouseSelected !== -1) {
      filterNotEqual["warehouse_id"] = warehouseSelected;
    }
    if (staffGroupSelected && staffGroupSelected !== -1) {
      filterNotEqual["staff_group_id"] = staffGroupSelected;
    }
    const { data, totalPage, totalItem } = await StaffApi.getStaff({
      filterNotEqual,
    });
    setStaffs(
      data?.map((v: any) => ({
        label: v.name,
        value: v.name,
        id: v.id,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    getAllStaffs();
  }, [warehouseSelected, staffGroupSelected]);

  const onStaffChange = (option) => {
    let newSelectedStaffIds: any[] = [];
    option.map((item) => {
      const staff = staffs.find((v) => v.value == item);
      if (staff) {
        newSelectedStaffIds.push(staff.id);
      }
    });
    setStaffSelectedIds(newSelectedStaffIds);
    setStaffSelected(option);
  };

  const onAddStaff = async () => {
    let params = {};
    if (warehouseSelected && warehouseSelected !== -1) {
      params["warehouse_id"] = warehouseSelected;
    }
    if (staffGroupSelected && staffGroupSelected !== -1) {
      params["staff_group_id"] = staffGroupSelected;
    }
    await handleSubmit(params, staffSelectedIds);
    onClear();
  };

  const onClear = () => {
    setWarehouseSelected(-1);
    setStaffGroupSelected(-1);
    setStaffSelected([]);
    onClose();
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClear}
      onOpen={onOpen}
      iconClose={iconClose}
      width={648}
      footer={false}
      className="p-[16px] modal-setting-fault rounded-lg"
    >
      <div>
        <div className="w-full">
          <div className="w-full flex flex-col rounded-lg bg-white p-[12px] mb-[32px]">
            <div className="flex justify-between items-center mb-[12px]">
              <p className="text-medium font-medium">Chọn kho trực thuộc</p>
              <Select
                width={385}
                defaultValue={warehouses[0]}
                options={warehouses}
                onChange={onWareHouseChange}
                value={warehouseSelected}
              />
            </div>
            <div className="flex justify-between items-center mb-[12px]">
              <p className="text-medium font-medium">Chọn nhóm sale</p>
              <Select
                width={385}
                defaultValue={staffGroups[0]}
                options={staffGroups}
                onChange={onStaffGroupChange}
                value={staffGroupSelected}
              />
            </div>
            <div className="flex justify-between items-center mb-[12px]">
              <p className="text-medium font-medium">Chọn nhân viên</p>
              <Select
                showSearch
                mode="multiple"
                placeholder="Chọn nhân viên"
                width={385}
                value={staffSelected}
                options={staffs}
                loading={loading}
                onChange={(value) => {
                  onStaffChange(value);
                }}
              />
            </div>
          </div>
          <div className="w-full flex justify-between">
            <Button
              width={270}
              height={44}
              text="HUỶ BỎ"
              variant="outlined"
              onClick={onClose}
              loading={submitLoading}
            />
            <Button
              onClick={onAddStaff}
              variant="secondary"
              text="LƯU"
              width={270}
              height={44}
              disabled={!isArray(staffSelectedIds) || submitLoading}
              loading={submitLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSettingStaff;
