import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import DatePicker from "../../../components/DatePicker/DatePicker";
import Modal from "../../../components/Modal/Modal/Modal";
import { notification, Table } from "antd";
import Icon from "../../../components/Icon/Icon";
import { ColumnsType } from "antd/es/table";
import { listDebtDetail } from "../../../const/constant";
import Upload from "../../../components/Upload/Upload";

// const { Option } = Select;
let index = 0;
interface ModalDeleteProps {
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
  handleDelete: () => void;
}

const ModalDelete = (props: ModalDeleteProps) => {
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    handleDelete,
  } = props;

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={648}
      footer={false}
      className="p-[16px] modal-edit-fault rounded-lg"
    >
      <div>
        <div className="w-full flex flex-col bg-white rounded-lg p-[12px]">
          <div className="flex justify-between items-center mb-[12px]">
            <p className="text-medium font-medium ">Xác nhận xóa?</p>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <Button
            width={270}
            height={44}
            text="HUỶ BỎ"
            variant="outlined"
            onClick={onClose}
          />
          <Button
            onClick={handleDelete}
            variant="secondary"
            text="LƯU"
            width={270}
            height={44}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;
