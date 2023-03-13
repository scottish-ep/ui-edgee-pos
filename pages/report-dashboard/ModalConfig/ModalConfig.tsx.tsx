import { setConfig } from "next/config";
import React, { ReactNode, useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal/Modal";
import Select from "../../../components/Select/Select";
import { orderStatus } from "../../../const/constant";
import { Form, notification } from "antd";
import ReportConfigApi from "../../../services/report-config/report-config";
import styles from "../../../styles/DetailCustomer.module.css";

interface ModalConfigProps {
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

const ModalConfig = (props: ModalConfigProps) => {
  const { isVisible, title, iconClose, onClose, onOpen } = props;
  const [form] = Form.useForm();

  const roleApplyRevenueList = [
    {
      label: "Nhân viên sale",
      value: 1,
    },
    {
      label: "Test",
      value: 2,
    },
  ];

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    const { data } = await ReportConfigApi.getConfig();
    if (data) {
      setConfig(data);
      let config = {
        roles_apply_revenue: [1],
        status_count_revenue: JSON.parse(data.status_count_revenue),
        status_lock_revenue: JSON.parse(data.status_lock_revenue),
        status_count_order: data.status_count_order,
      };
      form.setFieldsValue(config);
    }
  };
  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text="LƯU (F12)"
        width="48%"
        onClick={() => form.submit()}
      />
    </div>
  );

  const handleSubmit = async (data: any) => {
    const reportConfig = await ReportConfigApi.updateConfig(data);
    if (reportConfig.success) {
      notification.success({
        message: "Cập nhật thành công",
      });
    }
    onClose;
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={620}
      footer={<Footer />}
      className="px-[16px] py-[12px]"
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        className="mb-[24px] flex justify-start flex-col"
      >
        <div className={styles.row}>
          <div className={styles.row_left_table}>
            Thời điểm tính đơn chốt: <span className="text-[#EF4444]">*</span>
          </div>
          <Form.Item
            className="flex flex-1"
            name="status_count_order"
            rules={[
              {
                required: true,
                message: "Thời điểm tính đơn chốt là bắt buộc!",
              },
            ]}
          >
            <Select width={248} showArrow options={orderStatus} />
          </Form.Item>
        </div>
        <div className={styles.row}>
          <div className={styles.row_left_table}>
            Doanh thu + doanh số được chốt cho:
            <span className="text-[#EF4444]">*</span>
          </div>
          <Form.Item
            className="flex flex-1"
            name="roles_apply_revenue"
            rules={[
              {
                required: true,
                message: "Doanh thu + doanh số được chốt cho là bắt buộc!",
              },
            ]}
          >
            <Select
              width={248}
              showArrow
              disabled={true}
              mode="multiple"
              maxTagCount="responsive"
              options={roleApplyRevenueList}
            />
          </Form.Item>
        </div>
        <div className={styles.row}>
          <div className={styles.row_left_table}>
            Thời điểm tính doanh thu + doanh số :
            <span className="text-[#EF4444]">*</span>
          </div>
          <Form.Item
            className="flex flex-1"
            name="status_count_revenue"
            rules={[
              {
                required: true,
                message: "Thời điểm tính doanh thu + doanh số là bắt buộc!",
              },
            ]}
          >
            <Select
              width={248}
              showArrow
              mode="multiple"
              maxTagCount="responsive"
              options={orderStatus}
            />
          </Form.Item>
        </div>
        <div className={styles.row}>
          <div className={styles.row_left_table}>
            Thời điểm chốt doanh thu + doanh số :
            <span className="text-[#EF4444]">*</span>
          </div>
          <Form.Item
            className="flex flex-1"
            name="status_lock_revenue"
            rules={[
              {
                required: true,
                message: "Thời điểm chốt doanh thu + doanh số bắt buộc!",
              },
            ]}
          >
            <Select
              width={248}
              showArrow
              mode="multiple"
              maxTagCount="responsive"
              options={orderStatus}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalConfig;
