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

interface ModalSettingTargetProps {
    isVisible: boolean;
    title?: string;
    iconClose?: ReactNode;
    onClose?: (event?: any) => void;
    onOpen?: (event?: any) => void;
    content?: string | ReactNode;
    titleBody?: string;
    time?: string;
    deal?: string;
    method?: string;
    status?: StatusEnum;
    id?: string;
}

const ModalSettingTarget = (props: ModalSettingTargetProps) => {
const {
  isVisible,
  title,
  iconClose = "Đóng",
  onClose,
  onOpen,
  content,
  titleBody,
  time,
  deal,
  method,
  status,
  id,
  } = props;

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={504}
      footer={false}
      className="p-[16px] modal-setting-target rounded-lg"
    >
      <div>
        <div className="w-full flex flex-col rounded-lg bg-white p-[12px]">
          <div className="flex justify-between items-center mb-[12px]">
            <p className="text-medium font-medium">Tên KPI</p>
            <Input suffix="đ" width={241} value="Chỉ tiêu tháng 9"/>
          </div>
          <div className="flex justify-between items-center ">
            <p className="text-medium font-medium">Thời gian áp dụng</p>
            <DatePicker width={241} />
          </div>
        </div>
        <div className="bg-white p-[12px]  w-full flex flex-col rounded-lg mt-[8px]">
          <p className="font-semibold text-medium">Sale cấp 1</p>
          <div className="flex justify-between items-center mb-[12px]">
            <p className="text-medium font-medium">Chỉ tiêu đơn hàng</p>
            <Input suffix="đ" width={241} value="270"/>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-medium font-medium">
              Chỉ tiêu doanh thu
            </p>
            <Input suffix="đ" width={241} value="30.000.000"/>
          </div>
        </div>
        <div className="bg-white p-[12px] w-full flex flex-col rounded-lg mt-[8px]">
          <p className="font-semibold text-medium">Sale cấp 2</p>
          <div className="flex justify-between items-center mb-[12px]">
            <p className="text-medium font-medium">Chỉ tiêu đơn hàng</p>
            <Input suffix="đ" width={241} value="270"/>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-medium font-medium">
              Chỉ tiêu doanh thu
            </p>
            <Input suffix="đ" width={241} value="30.000.000"/>
          </div>
        </div>
        <div className="w-full mt-[32px] flex justify-between items-center mb-[12px]">
          <Button variant="outlined" text="HUỶ BỎ" onClick={onClose} width={210} height={44} />
          <Button variant="secondary" text="LƯU (F12)" width={210} height={44}/>
        </div>
      </div>
    </Modal>
  )
}

export default ModalSettingTarget;