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
import StaffErrorRelationApi from "../../../services/staff-error-relations";

// const { Option } = Select;
let index = 0;
interface ModalEditFaultProps {
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
  listError: any[];
  staff_id: string;
  errorRecord?: any;
  setErrorRecord?: any;
  onSaveFault?: any;
}

const ModalEditFault = (props: ModalEditFaultProps) => {
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
    listError,
    staff_id,
    errorRecord,
    setErrorRecord,
    onSaveFault,
  } = props;

  // const [record, setRecord] = useState<any>(errorRecord);
  const onCreateStaffError = async () => {
    onSaveFault();
  };

  const onRecordChange = (value: any, name: string) => {
    setErrorRecord({
      ...errorRecord,
      [name]: value,
    });
  };

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
          <div className="flex justify-between items-center mb-[12px] ">
            <p className="text-medium font-medium ">Tên lỗi</p>
            <div>
              <Select
                width={385}
                onChange={(e) => onRecordChange(e, "staff_error_id")}
                value={errorRecord?.staff_error_id}
                options={listError}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mb-[12px]">
            <p className="text-medium font-medium ">Số lần vi phạm</p>
            <Input
              width={385}
              onChange={(e) =>
                onRecordChange(e.target.value, "number_violations")
              }
              value={errorRecord?.number_violations}
            />
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-medium font-medium mb-[8px]">Ghi chú</p>
            <TextArea
              className="bg-slate-100 !h-[104px]"
              placeholder="Nhập ghi chú"
              value={errorRecord?.note}
              onChange={(e) => onRecordChange(e.target.value, "note")}
            />
          </div>
        </div>
        <div className="w-full flex justify-between mt-[32px]">
          <Button
            width={285}
            height={44}
            text="HUỶ BỎ"
            variant="outlined"
            onClick={onClose}
          />
          <Button
            variant="secondary"
            text="LƯU"
            width={285}
            height={44}
            onClick={onCreateStaffError}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditFault;
