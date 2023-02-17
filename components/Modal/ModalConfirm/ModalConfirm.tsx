import React, { Children } from "react";
import { ReactNode } from "react";

import Modal from "../Modal/Modal";
import Button from "../../Button/Button";

import styles from "./Modal.module.css";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  titleBody?: string;
  titleConfirm?: string;
}

const ModalConfirm = (props: ModalProps) => {
  const {
    isVisible,
    title = "Thông báo",
    iconClose = "Đóng",
    onClose,
    onOpen,
    content,
    titleBody,
    titleConfirm,
  } = props;

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        variant="danger"
        text={titleConfirm ? titleConfirm : "XOÁ"}
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
      footer={<Footer />}
    >
      <div className="text-center mb-[24px]">
        <div className="text-big font-bold mb-[12px]">{titleBody}</div>
        <div>{content}</div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
