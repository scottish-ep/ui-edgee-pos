import { useState, ReactNode, useEffect } from 'react';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Modal from 'components/Modal/Modal/Modal';
import { IOrderCancel } from '../orders.type';
import { Form, notification } from 'antd';
interface ModalCancelProps {
  detail?: any;
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  itemList: any[];
  method?: string;
  id?: string;
  setItemList: (event?: any) => void;
  rowSelected?: IOrderCancel;
  data?: any;
}

const ModalCancel = (props: ModalCancelProps) => {
  const {
    detail,
    rowSelected,
    isVisible,
    itemList,
    setItemList,
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
  const [loading, setLoading] = useState(false);
  const [newItemList, setNewItemList] = useState<any[]>([]);
  const [name, setName] = useState('');

  const onCloseForm = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (rowSelected) {
      form.setFieldsValue({
        customer_type_name: rowSelected?.name,
      });
    }
  }, [rowSelected, form]);

  const handleAdd = (e: any) => {
    const id = Math.floor(Math.random() * 10000000).toString();
    setItemList((current: any) => [
      ...current,
      { id, name: form.getFieldValue('customer_type_name') },
    ]);
    setNewItemList((current: any) => [
      ...current,
      { id, name: form.getFieldValue('customer_type_name') },
    ]);
  };

  const handleClear = () => {
    setName('');
  };

  const handleAddInput = (e: any) => {
    handleAdd(e);
    handleClear();
  };

  const onSave = () => {
    setLoading(true);
    let formValue = form.getFieldsValue();
    const name = formValue.customer_type_name;
    if (name === '') {
      notification.error({
        message: 'Không được để trống',
      });
      setLoading(false);
      return;
    }

    form.validateFields().then(async () => {
      formValue = {
        ...formValue,
      };
      const dataSend = { ...formValue };
    });
  };

  const handleSubmit = (value: any) => {
    onOpen && onOpen(value);
    form.resetFields();
  };

  const Footer = () => (
    <div className="flex justify-between">
      <Button
        variant="outlined"
        text="Huỷ bỏ"
        width="48%"
        onClick={onCloseForm}
      />
      <Button
        variant="primary"
        text={rowSelected?.name !== '' ? 'Cập nhật' : 'Thêm mới'}
        width="48%"
        onClick={(e) => {
            // onOpen;
            // onSave;
          handleAddInput(e);
        }}
        loading={loading}
      />
    </div>
  );

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onCloseForm}
      onOpen={onOpen}
      iconClose={iconClose}
      width={500}
      className="p-[16px]"
      footer={<Footer />}
    >
      <Form onFinish={handleSubmit} form={form} initialValues={data}>
        <div className="mb-[12px] flex flex-col">
          <span className="text-[#212121] text-base font-medium mb-[28px]"></span>
          <Form.Item
            name="customer_type_name"
            rules={[
              {
                required: false,
                message: 'Không được để trống',
              },
            ]}
          >
            <Input
              className="mb-[24px]"
              label="Tên"
              placeholder={detail ? '' : 'Nhập tên lí do hủy'}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddInput(form.getFieldValue("customer_type_name"));
                }
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCancel;
