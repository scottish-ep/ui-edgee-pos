import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode, Fragment } from "react";
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
import et from "date-fns/esm/locale/et/index.js";
import StaffGroupApi from "../../../services/staff-groups";
import ModalDelete from "./modal-delete";

interface ModalSettingGroupProps {
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
  id?: string | number;
  itemList: any[];
  setItemList: (event?: any) => void;
  handleReload: any;
  submitLoading: boolean;
}

const ModalSettingGroup = (props: ModalSettingGroupProps) => {
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    itemList,
    setItemList,
    handleReload,
    submitLoading,
  } = props;

  const [newItemList, setNewItemList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [value, setValue] = useState("");
  const onNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleAdd = (e: any) => {
    const value = Math.floor(Math.random() * 10000000).toString();
    setItemList((current) => [...current, { value, name: name }]);
    setNewItemList((current) => [...current, { value, name: name }]);
  };

  const handleClear = () => {
    setName("");
  };

  const onDelete = (value: string) => {
    setIsShowModalDelete(true);
    setValue(value);
  };

  const handleDelete = async () => {
    const newItemListFound = newItemList.find((item) => item.value === value);
    if (newItemListFound) {
      setNewItemList((prevItemList) =>
        prevItemList.filter((item) => item.value !== value)
      );
      setItemList((prevItemList) =>
        prevItemList.filter((product) => product.value !== value)
      );
      notification.success({
        message: "Xóa thành công",
      });
      setIsShowModalDelete(false);
      return;
    }
    const itemListFound = itemList.find((item) => item.value === value);
    if (itemListFound) {
      const res = await StaffGroupApi.deleteStaffErrors(value);
      if (res && !res.data.success) {
        notification.error({
          message: res.data.message,
        });
        setIsShowModalDelete(false);
        return;
      }
      setItemList((prevItemList) =>
        prevItemList.filter((product) => product.value !== value)
      );
      notification.success({
        message: "Xóa thành công",
      });
      setIsShowModalDelete(false);
      return;
    }
  };

  const handleAddInput = (e: any) => {
    handleAdd(e);
    handleClear();
  };

  const handleSaveStaffGroup = async () => {
    const errors = await StaffGroupApi.addStaffGroup(newItemList);
    if (errors) {
      setItemList([]);
      setNewItemList([]);
      await handleReload();
      notification.success({
        message: "Thêm thành công",
      });
    }
  };

  return (
    <Fragment>
      <Modal
        isCenterModal
        title={title}
        isVisible={isVisible}
        onClose={onClose}
        onOpen={onOpen}
        iconClose={iconClose}
        width={504}
        footer={false}
        className="p-[16px] modal-setting-group rounded-lg"
      >
        <div>
          <div className="w-full flex flex-col rounded-lg bg-white p-[12px] mb-[32px]">
            {Array.isArray(itemList) &&
              itemList.map((item, index) => {
                return (
                  item.value !== -1 && (
                    <div
                      className="flex justify-between items-center mb-[12px]"
                      key={index}
                    >
                      <Input width={380} value={item.name} />
                      <div
                        onClick={() => onDelete(item.value)}
                        className="cursor-pointer"
                      >
                        <Icon icon="trash" size={24} />
                      </div>
                    </div>
                  )
                );
              })}
            <div className="w-full bg-slate-100"></div>
            <Input
              className="w-full"
              placeholder="Thêm mới và nhấn Enter.."
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddInput(name);
                }
              }}
              prefix={
                <div onClick={handleAddInput}>
                  <Icon icon="add-1" size={24} />
                </div>
              }
            />
          </div>
          <div className="w-full flex justify-between">
            <Button
              width={210}
              height={44}
              text="HUỶ BỎ"
              className="font-medium"
              variant="outlined"
              onClick={onClose}
              loading={submitLoading}
            />
            <Button
              variant="secondary"
              text="LƯU (F12)"
              onClick={handleSaveStaffGroup}
              width={210}
              height={44}
              loading={submitLoading}
            />
          </div>
        </div>
      </Modal>
      <ModalDelete
        title="Xóa bản ghi"
        isVisible={isShowModalDelete}
        // staffs={staffs}
        handleDelete={handleDelete}
        onClose={() => setIsShowModalDelete(false)}
        onOpen={() => setIsShowModalDelete(true)}
      />
    </Fragment>
  );
};

export default ModalSettingGroup;
