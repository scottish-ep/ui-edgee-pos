import { useState } from 'react';
import { Form } from 'antd';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { ReactNode } from 'react';
import Modal from 'components/Modal/Modal/Modal';

interface ModalFeeCreateProps {
  detail?: boolean;
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  method?: string;
  id?: string;
  data?: any;
}

const ModalFeeCreate = (props: ModalFeeCreateProps) => {
  const {
    detail,
    isVisible,
    title,
    iconClose = 'Đóng',
    onClose,
    onOpen,
    content,
    method,
    id,
    data,
  } = props;

  const [form] = Form.useForm();

  const Footer = () => (
    <div className="flex justify-between mt-[24px]">
      <Button variant="outlined" text="Huỷ bỏ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text={detail ? 'Lưu' : 'Thêm mới'}
        width="48%"
        onClick={onOpen}
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
      width={500}
      className="p-[16px]"
      footer={<Footer />}
    >
      <Form onFinish={handleSubmit} form={form}>
        <div className="flex flex-col mt-[36px] w-full">
          <div className="flex justify-between mb-[8px] items-center">
            <span className="text-medium font-medium">
              Tên <span className="text-[#EF4444]">*</span>
            </span>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
              <Input width={296} placeholder="Nhập tên" />
            </Form.Item>
          </div>
          <div className="flex justify-between mb-[8px] items-center">
            <span className="text-medium font-medium">Giá</span>
            <Form.Item
              name="price"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input width={296} placeholder="Nhập giá" suffix="đ"/>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalFeeCreate;