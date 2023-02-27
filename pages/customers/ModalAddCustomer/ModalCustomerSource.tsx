import React, { Children } from 'react';
import { ReactNode } from 'react';
import Image from 'next/image';
import Modal from '../../../components/Modal/Modal/Modal';
import Button from '../../../components/Button/Button';
import Upload from 'components/Upload/Upload';
import styles from './Modal.module.css';
import Select from '../../../components/Select/Select';
import Input from '../../../components/Input/Input';
import { Form } from 'antd';

interface ModalCustomerSourceProps {
  detail?: any;
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

const ModalCustomerSource = (props: ModalCustomerSourceProps) => {
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

  const handleSubmit = (value: any) => {
    onOpen && onOpen(value);
    form.resetFields();
  };

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="Huỷ bỏ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text={detail ? 'Cập nhật' : 'Thêm mới'}
        width="48%"
        onClick={() => form.submit()}
      />
    </div>
  );

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
      <Form initialValues={data} form={form} onFinish={handleSubmit}>
        <div className="mb-[12px] flex flex-col">
          <span className="text-[#212121] text-base font-medium mb-[16px]">
            {detail
              ? 'Cập nhật nguồn khách hàng mới'
              : 'Thêm nguồn khách hàng mới'}
          </span>
          <div className="mb-[12px]">
            <div className="flex items-center ">
              <Form.Item name="avatar">
                <Upload
                  // customRequest={handleUploadImage}
                  listType="picture-card"
                  // fileList={fileList}
                  showUploadList={true}
                  // onChange={handleChangeImage}
                  multiple
                >
                  {detail.avatar ? (
                    <Image
                      src={detail.avatar}
                      alt="avatar"
                      style={{
                        width: 80,
                        height: 80,
                      }}
                    />
                  ) : (
                    // <DefaultAvatar />
                    <div className="rounded-[50%] overflow-hidden">
                      <Image
                        src={require('../../../public/yellow-star.svg')}
                        width={80}
                        height={80}
                        alt=""
                      />
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                name="customer_name"
                rules={[
                  {
                    required: true,
                    message: 'Họ và tên là bắt buộc!',
                  },
                ]}
              >
                <Input
                  label="Tên Nguồn Khách Hàng"
                  width={300}
                  placeholder={
                    detail ? detail.name : 'Nhập tên nguồn khách hàng'
                  }
                ></Input>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCustomerSource;
