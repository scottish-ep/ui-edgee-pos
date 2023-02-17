import { ReactNode } from 'react';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Upload from '../../../components/Upload/Upload';
import Modal from '../../../components/Modal/Modal/Modal';
interface ModalUpdateCatProps {
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
        variant="secondary"
        text="Thêm mới"
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
      <div className="mb-[12px]  flex justify-start flex-col">
        <span className='text-[#2E2D3D] text-[18px] font-semibold mb-[28px]'>Thêm mới danh mục</span>
        <div className="mb-[12px]">
          <span className="text-[#1D1C2D] text-[14px] font-medium leading-[21px] mr-[12px]">
            Hình ảnh
          </span>
          <span className="text-[#4B4B59] text-[14px] font-normal leading-[21px]">
            (Kích thước tối ưu 120 x 120 px)
          </span>
        </div>
        <Upload
          className="mb-[16px]"
          // iconUpload={<Icon icon="upload" size={80} />}
        />
        <span className="text-[#1D1C2D] text-[14px] font-medium leading-[21px] mr-[12px] mb-[12px]">
          Tên danh mục
        </span>
        <Input width={420} placeholder="Nhập" className='mb-[28px]'/>
      </div>
    </Modal>
  );
};

export default ModalUpdateCat;
