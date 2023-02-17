import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal/Modal';
import React, { useEffect, useState, ReactNode } from 'react';

interface UnreportCustomerProps {
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
  id?: string;
}

const ModalUnreportCustomer = (props: UnreportCustomerProps) => {
  const {
    isVisible,
    title,
    iconClose = 'Đóng',
    onClose,
    onOpen,
    content,
    titleBody,
    time,
    deal,
    method,
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
      width={535}
      footer={false}
      className="p-[16px] modal-unblock-customer bg-white"
    >
      <div className="flex justify-center w-full bg-white text-medium font-medium my-[48px]">
        Bạn có chắc chắn muốn bỏ báo xấu khách hàng này không?
      </div>
      <div className="flex justify-between">
        <Button variant="outlined" width={220} height={55} text="HUỶ BỎ" onClick={onClose}/>
        <Button variant="secondary" width={220} height={55} text="BỎ BÁO XẤU" onClick={onOpen}/>
      </div>
    </Modal>
  );
};

export default ModalUnreportCustomer;