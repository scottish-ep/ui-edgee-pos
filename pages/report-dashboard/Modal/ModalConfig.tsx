import React, { ReactNode, useState } from 'react';
import Modal from 'components/Modal/Modal/Modal';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import { orderStatus } from 'const/constant';
import { Form } from 'antd';
import styles from '../../../styles/ModalConfig.module.css';
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
  const {
    detail,
    isVisible,
    title,
    iconClose,
    onClose,
    onOpen,
    content,
    method,
    id,
    data,
  } = props;

  const [form] = Form.useForm();

  const statusCountOrderList = [
    {
      label: 'Tạo mới',
      value: 1,
    },
    {
      label: 'Update',
      value: 2,
    },
  ];

  const roleApplyRevenueList = [
    {
      label: 'Nhân viên tạo đơn',
      value: 1,
    },
    {
      label: 'Test',
      value: 2,
    },
  ];

  const statusCountRevenueList = [
    {
      label: 'Đang gửi hàng',
      value: 1,
    },
    {
      label: 'đã nhận hàng',
      value: 2,
    },
    {
      label: 'Đã trả hàng',
      value: 3,
    },
  ];

  const handleSubmit = (value: any) => {
    onOpen && onOpen(value);
    form.resetFields();
  };

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text="LƯU (F12)"
        width="48%"
        onClick={() => {
          form.submit();
        }}
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
      width={658}
      footer={<Footer />}
      className="px-[16px] py-[12px]"
    >
      <Form onFinish={handleSubmit} form={form} initialValues={data}>
        <div className="mb-[24px] flex justify-start flex-col">
          <div className="flex flex-col w-[100%]">
            <div className={styles.row_wrapper}>
              <div className={styles.row}>
                <span className={styles.dot}></span>
                <div className="text-[#2E2D3D] font-medium text-sm">
                  Thời điểm tính đơn chốt:{' '}
                </div>
              </div>
              <Form.Item
                name="status_count_order"
                rules={[
                  {
                    required: false,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Select
                  width={248}
                  showArrow
                  // disabled={true}
                  defaultValue={statusCountOrderList[0]}
                  options={statusCountOrderList}
                />
              </Form.Item>
            </div>
            <div className={styles.row_wrapper}>
              <div className={styles.row}>
                <span className={styles.dot}></span>
                <div className="text-[#2E2D3D] font-medium text-sm">
                  Doanh thu + doanh số được chốt cho:{' '}
                </div>
              </div>
              <Form.Item
                name="role_apply_revenue"
                rules={[
                  {
                    required: false,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Select
                  width={248}
                  showArrow
                  disabled={true}
                  defaultValue={roleApplyRevenueList[0]}
                  options={roleApplyRevenueList}
                />
              </Form.Item>
            </div>
            <div className={styles.row_wrapper}>
              <div className={styles.row}>
                <span className={styles.dot}></span>
                <div className="text-[#2E2D3D] font-medium text-sm">
                  Thời điểm tính doanh thu + doanh số :{' '}
                </div>
              </div>
              <Form.Item
                name="status_count_revenue"
                rules={[
                  {
                    required: false,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Select
                  width={248}
                  showArrow
                  // disabled={true}
                  mode="multiple"
                  maxTagCount="responsive"
                  defaultValue={statusCountRevenueList[0]}
                  options={statusCountRevenueList}
                />
              </Form.Item>
            </div>
            <div className={styles.row_wrapper}>
              <div className={styles.row}>
                <span className={styles.dot}></span>
                <div className="text-[#2E2D3D] font-medium text-sm">
                  Thời điểm chốt doanh thu + doanh số :{' '}
                </div>
              </div>
              <Form.Item
                name="order_status"
                rules={[
                  {
                    required: false,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Select
                  width={248}
                  showArrow
                  // disabled={true}
                  defaultValue={orderStatus[0]}
                  options={orderStatus}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalConfig;
