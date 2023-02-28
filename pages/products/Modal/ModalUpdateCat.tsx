import { ReactNode } from 'react';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Upload from '../../../components/Upload/Upload';
import Modal from '../../../components/Modal/Modal/Modal';
import { Form } from 'antd';

interface ModalUpdateCatProps {
  isUpdate?: boolean;
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

const ModalUpdateCat = (props: ModalUpdateCatProps) => {
  const {
    isUpdate,
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
    <div className="flex justify-between">
      <Button variant="outlined" text="Huỷ bỏ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text={isUpdate ? 'Lưu' : 'Thêm mới'}
        width="48%"
        // onClick={onOpen}
        onClick={() => form.submit()}
      />
    </div>
  );

  const handleSubmit = (event: any) => {
    const name = form.getFieldValue('name');
    const image = form.getFieldValue('upload');
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
      <Form onFinish={handleSubmit} form={form} initialValues={data}>
        <div className="mb-[12px]  flex justify-start flex-col">
          <span className="text-[#2E2D3D] text-[18px] font-semibold mb-[28px]">
            {isUpdate ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
          </span>
          <div className="mb-[12px]">
            <span className="text-[#1D1C2D] text-[14px] font-medium leading-[21px] mr-[12px]">
              Hình ảnh
            </span>
            <span className="text-[#4B4B59] text-[14px] font-normal leading-[21px]">
              (Kích thước tối ưu 120 x 120 px)
            </span>
          </div>
          <Form.Item name="upload">
            <Upload
              className="mb-[16px]"
              // iconUpload={<Icon icon="upload" size={80} />}
            />
          </Form.Item>
          <span className="text-[#1D1C2D] text-[14px] font-medium leading-[21px] mr-[12px] mb-[12px]">
            Tên danh mục
          </span>
          <Form.Item name="name">
            <Input value={data?.name} width={420} placeholder="Nhập" className="mb-[28px]" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalUpdateCat;
