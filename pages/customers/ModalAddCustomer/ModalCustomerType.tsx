import { useState, ReactNode } from 'react';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Modal from 'components/Modal/Modal/Modal';

interface ModalCustomerTypeProps {
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

const ModalCustomerType = (props: ModalCustomerTypeProps) => {
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

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="Huỷ bỏ" width="48%" onClick={onClose} />
      <Button
        variant="primary"
        text={detail ? 'Cập nhật' : 'Thêm mới'}
        width="48%"
        onClick={onOpen}
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
      <div className="mb-[12px] flex flex-col">
        <span className="text-[#212121] text-base font-medium mb-[28px]">
          {Object.keys(detail).length > 0
            ? 'Cập nhật loại khách hàng mới'
            : 'Thêm loại khách hàng mới'}
        </span>
        <Input
          className="mb-[24px]"
          label="Tên"
          placeholder={
            Object.keys(detail).length > 0
              ? ''
              : 'Nhập tên phân loại khách hàng'
          }
        />
      </div>
    </Modal>
  );
};

export default ModalCustomerType;
