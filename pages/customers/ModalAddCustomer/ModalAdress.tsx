import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal/Modal";
import Button from "../../../components/Button/Button";
import React, { useEffect, useState, ReactNode } from "react";
import { Form } from "antd";
interface ModalAddressProps {
  isVisible: boolean;
  isEdit: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  titleBody?: string;
  time?: string;
  deal?: string;
  method?: string;
  id?: string;
  data?: any;
  provinces: any[];
  districts: any[];
  wards: any[];
}

const ModalAddress = (props: ModalAddressProps) => {
  const {
    isVisible,
    isEdit,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    content,
    titleBody,
    time,
    deal,
    method,
    id,
    data,
    provinces,
    districts,
    wards,
  } = props;

  const [form] = Form.useForm();
  const district_id = Form.useWatch("district_id", form);
  const ward_id = Form.useWatch("ward_id", form);
  const address = Form.useWatch("phone_number", form);
  const province_id = Form.useWatch("province_id", form);
  const defaultDistricts = province_id
    ? districts.filter((item) => item.province_id == province_id)
    : districts;
  const defaultWards = province_id
    ? wards.filter((item) => item.district_id == district_id)
    : wards;

  const Footer = () => (
    <div className="flex justify-between pt-[12px]">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        htmlType="submit"
        variant="secondary"
        text={isEdit ? "CẬP NHẬT" : "THÊM MỚI"}
        width="48%"
        onClick={() => {
          form.submit();
        }}
        className={
          !ward_id || !address || !province_id || !district_id ? "disabled" : ""
        }
      />
    </div>
  );

  const handleSubmit = (value: any) => {
    onOpen && onOpen(value);
    form.resetFields();
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={794}
      footer={<Footer />}
      className="p-[16px] modal-address"
    >
      <Form
        initialValues={data}
        form={form}
        onFinish={handleSubmit}
        className="w-full p-[12px] flex flex-col bg-[#F5F5F6]"
      >
        <div className="w-full flex justify-between">
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Họ và tên*</p>
            <Form.Item
              name="full_name"
              rules={[
                {
                  required: true,
                  message: "Họ và tên là bắt buộc!",
                },
              ]}
            >
              <Input width={340} placeholder="Nhập họ và tên" />
            </Form.Item>
          </div>
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Số điện thoại*</p>
            <Form.Item
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại là bắt buộc!",
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input width={340} placeholder="Nhập SĐT" />
            </Form.Item>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Tỉnh/Thành*</p>
            <Form.Item name="province_id">
              <Select width={340} placeholder="Chọn" onChange={() => {
                form.setFieldsValue({ district_id: null });
                form.setFieldsValue({ ward_id: null });
              }} options={provinces} />
            </Form.Item>
          </div>
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Quận/Huyện*</p>
            <Form.Item name="district_id">
              <Select
                width={340}
                placeholder="Chọn"
                onChange={() => {
                  form.setFieldsValue({ ward_id: null });
                }}
                options={defaultDistricts}
              />
            </Form.Item>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Xã/Phường*</p>
            <Form.Item name="ward_id">
              <Select width={340} placeholder="Chọn" options={defaultWards} />
            </Form.Item>
          </div>
          <div className="w-[365px] flex flex-col justify-start">
            <p className="font-medium text-medium my-[8px]">Địa chỉ*</p>
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ là bắt buộc!",
                },
              ]}
            >
              <Input width={340} placeholder="Nhập" />
            </Form.Item>
          </div>
        </div>
        <div className="w-full flex flex-col my-[8px]">
          <p className="text-medium font-medium mb-[8px]">Hướng dẫn chi tiết</p>
          <Form.Item name="note">
            <Input width={687} placeholder="Nhập" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddress;
