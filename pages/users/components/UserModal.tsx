/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";

import Modal from "../../../components/Modal/Modal/Modal";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import { Radio, RadioChangeEvent, Switch } from "antd";
import { Form, notification } from "antd";
import DatePicker from "../../../components/DatePicker/DatePicker";
import { IUser } from "../../../types/users";
import moment, { Moment } from "moment";
import UserApi from "../../../services/users";
import WarehouseApi from "../../../services/warehouses";
import PermissionApi from "../../../services/permission";
import { IOption } from "../../../types/permission";
import { get } from "lodash";
import StaffApi from "../../../services/staffs";
import StaffGroupApi from "../../../services/staff-groups";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  userSelected?: IUser | null;
  handleSuccess: () => void;
}

const UserModal = (props: ModalProps) => {
  const {
    isVisible,
    title = "Thông tin người dùng",
    iconClose = "Đóng",
    onClose,
    onOpen,
    userSelected,
    handleSuccess,
  } = props;

  const [gender, setGender] = useState<number>(1);
  const [isSpecialPermissions, setIsSpecialPermissions] =
    useState<boolean>(true);
  const [isBlock, setIsBlock] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [positionId, setPositionId] = useState<number | string | undefined>("");
  const [birthday, setBirthday] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<number | string | undefined>("");
  const [warehouseIds, setWarehouseIds] = useState<
    Array<string | number | undefined>
  >([]);
  const [specialPermissionId, setSpecialPermissionId] = useState<
    string | number | undefined
  >("");
  const [selectWarehouseOptions, setSelectWarehouseOptions] = useState<
    IOption[]
  >([]);
  const [selectPermissionOptions, setSelectPermissionOptions] = useState<
    IOption[]
  >([]);
  const [selectSaleGroupOptions, setSelectSaleGroupOptions] = useState<
    IOption[]
  >([]);
  const [detail, setDetail] = useState<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onGenderChange = (e: RadioChangeEvent) => {
    setGender(e.target.value);
  };

  useEffect(() => {
    setGender(userSelected?.gender || 1);
    setIsSpecialPermissions(userSelected?.isSpecialPermissions || false);
    setIsBlock(userSelected?.isBlock || false);
    setName(userSelected?.name || "");
    setPhone(userSelected?.phone || "");
    setEmail(userSelected?.email || "");
    setPositionId(
      get(userSelected, "user_role_companies[0].role_id") || undefined
    );
    setBirthday(userSelected?.birthday || null);
    setSpecialPermissionId(userSelected?.specialPermissionId || undefined);
    setGroupId(userSelected?.staff_group_id || undefined);
    setWarehouseIds(get(userSelected, "warehouses[0].warehouse_id") || []);
    setDetail(userSelected);
    form.setFieldsValue(userSelected);
  }, [userSelected]);

  useEffect(() => {
    getSelectWarehouseOptions();
    getSelectPermissionOptions();
    getSelectSaleGroupOptions();
  }, []);

  const getSelectWarehouseOptions = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    console.log("listWarehouse", listWarehouse);
    setSelectWarehouseOptions(listWarehouse);
  };

  const getSelectSaleGroupOptions = async () => {
    const result = await StaffGroupApi.getStaffGroup();
    const listSaleGroup = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setSelectSaleGroupOptions(listSaleGroup);
    console.log("listSaleGroup", listSaleGroup);
  };

  const getSelectPermissionOptions = async () => {
    const result = await PermissionApi.list();
    const listPermission = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    console.log("listPermission", listPermission);
    setSelectPermissionOptions(listPermission);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    const formValue = form.getFieldsValue();
    form
      .validateFields()
      .then(async () => {
        if (detail) {
          const { data, success } = await UserApi.updateUser(detail.id, {
            ...formValue,
            warehouse_ids: warehouseIds,
            role_id: positionId,
          });
          if (success) {
            notification.success({
              message: "Cập nhật người dùng thành công!",
            });
            handleSuccess();
          } else {
            notification.error({
              message: data.message,
            });
          }
        } else {
          const { data, success } = await UserApi.addUser({
            ...formValue,
            warehouse_ids: warehouseIds,
            role_id: positionId,
          });
          if (success) {
            notification.success({
              message: "Tạo người dùng thành công!",
            });
            handleSuccess();
          } else {
            notification.error({
              message: data.message,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const Footer = () => (
    <div className="flex items-center justify-between">
      <div className="flex justify-between w-[100%]">
        <Button
          variant="outlined"
          text="HUỶ BỎ"
          width="50%"
          onClick={onClose}
        />
        <Button
          variant="secondary"
          text="LƯU USER"
          width="50%"
          loading={loading}
          onClick={handleSaveUser}
        />
      </div>
    </div>
  );

  const onBirthdayChange = (date: Moment | null, dateString: string) => {
    setBirthday(dateString);
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      footer={<Footer />}
      width={630}
    >
      <Form form={form} className="w-[100%]">
        <div className="d-flex items-center gap-[10px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Họ và tên *</div>
          <Form.Item
            className="flex-1"
            name="name"
            rules={[
              {
                required: true,
                message: "Họ và tên là bắt buộc!",
              },
            ]}
          >
            <Input placeholder="Nhập" required={true} />
          </Form.Item>
        </div>
        <div className="d-flex items-center gap-[10px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Số điện thoại</div>
          <Form.Item name="phone" className="flex-1">
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>
        <div className="d-flex items-center gap-[10px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Email *</div>
          <Form.Item
            className="flex-1"
            name="email"
            rules={[
              {
                required: true,
                message: "Email là bắt buộc!",
              },
            ]}
          >
            <Input placeholder="Nhập" required={true} />
          </Form.Item>
        </div>
        <div className="flex items-center gap-x-[12px] mt-[24px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Chức vụ</div>
          <Select
            containerClassName="flex-1"
            width="100%"
            value={positionId}
            onChange={(value: string) => setPositionId(value)}
            placeholder="Chọn"
            options={selectPermissionOptions}
          />
        </div>
        <div className="flex items-center gap-x-[12px] mt-[24px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Nhóm</div>
          <Select
            containerClassName="flex-1"
            placeholder="Chọn"
            value={groupId}
            onChange={(value: string) => setGroupId(value)}
            options={selectSaleGroupOptions}
          />
        </div>
        <div className="flex items-center gap-x-[12px] mt-[24px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px]">Kho thao tác</div>
          <Select
            containerClassName="flex-1"
            placeholder="Chọn"
            onChange={(value) => setWarehouseIds(value)}
            value={warehouseIds}
            options={selectWarehouseOptions}
          />
        </div>
        <div className="flex items-center gap-x-[12px] mt-[24px] mb-[12px]">
          <div className="w-[200px] font-medium font-[14px] text-[#EF4444]">
            Chặn nhân viên này
          </div>
          <Switch
            className="button-switch"
            onChange={(checked) => setIsBlock(checked)}
            checked={isBlock}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal;
