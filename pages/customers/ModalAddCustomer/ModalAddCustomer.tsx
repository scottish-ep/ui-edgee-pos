import React, { Children } from "react";
import { ReactNode } from "react";

import Modal from "../../../components/Modal/Modal/Modal";
import Button from "../../../components/Button/Button";

import styles from "./Modal.module.css";
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DatePicker/DatePicker";
import { Radio, Form } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/lib/date-picker";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen: (event?: any) => void;
  content?: string | ReactNode;
  titleBody?: string;
  listSource: {
    label: string;
    value: string | number;
    id: number;
  }[];
}

const ModalAddCustomer = (props: ModalProps) => {
  const {
    isVisible,
    title = "Thông báo",
    iconClose = "Đóng",
    onClose,
    onOpen,
    content,
    titleBody,
    listSource,
  } = props;

  const [form] = Form.useForm();

  const name = Form.useWatch("name", form);
  const phone_number = Form.useWatch("phone_number", form);

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        htmlType="submit"
        variant="secondary"
        text="THÊM MỚI"
        width="48%"
        onClick={() => {
          form.submit();
        }}
        className={!name || !phone_number ? "disabled" : ""}
      />
    </div>
  );

  const handleSubmit = (value: any) => {
    onOpen(value);
    form.resetFields();
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days after today and today
    return current && current > dayjs().endOf("day");
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      iconClose={iconClose}
      footer={<Footer />}
      width={535}
    >
      <Form form={form} onFinish={handleSubmit} className="w-full">
        <div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Chọn nguồn</div>
            <Form.Item name="source_id">
              <Select
                placeholder="Chọn nguồn"
                style={{ width: 296 }}
                options={listSource}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Họ và tên <span className="text-[#EF4444]">*</span></div>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Họ và tên là bắt buộc!",
                },
              ]}
            >
              <Input width={296} placeholder="Nhập tên nhân viên" />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Số điện thoại <span className="text-[#EF4444]">*</span></div>
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
              <Input
                type="phone-number"
                width={296}
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Giới tính</div>
            <div style={{ width: 296 }}>
              <Form.Item name="sex">
                <Radio.Group>
                  <div className="mr-[95px]">
                    <Radio value="Nam">Nam</Radio>
                  </div>
                  <Radio value="Nữ">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Sinh nhật</div>
            <Form.Item name="birthday">
              <DatePicker
                width={296}
                placeholder="Ngày/tháng/năm"
                disabledDate={disabledDate}
                // showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-medium font-medium">Email</div>
            <Form.Item
              name="email"
              rules={[
                {
                  pattern: new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ),
                  message: "Địa chỉ email không hợp lệ",
                },
              ]}
            >
              <Input type="email" width={296} placeholder="nhập email" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddCustomer;
