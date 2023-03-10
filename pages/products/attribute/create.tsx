import { Table, Form } from 'antd';
import Input from 'components/Input/Input';
import type { ColumnsType } from 'antd/es/table';
import Button from 'components/Button/Button';
import Icon from 'components/Icon/Icon';
import TitlePage from 'components/TitlePage/Titlepage';
import { useEffect, useState } from 'react';
import { onCoppy } from '../../../utils/utils';
import { IsProduct } from '../product.type';
import ModalConfirm from 'components/Modal/ModalConfirm/ModalConfirm';
const CreateAttribute = () => {
  const [isShowModalDeleteAttr, setIsShowModalDeleteAttr] = useState(false);
  const [form] = Form.useForm();
  const pageTitle = "Cài Đặt Thuộc Tính";

  const attrList = Array(5)
    .fill({
      label: 'TRẮNG',
      value: 'trang',
    })
    .map((item: any, index: any) => ({
      ...item,
      id: index + 1,
    }));

  const columns: ColumnsType<IsProduct> = [
    {
      title: '#',
      width: 24,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (_, record: any) => (
        <span
          className="text-medium text-[#1D1C2D] font-medium"
          onClick={(e) => onCoppy(e, record.id)}
        >
          {record.id}
        </span>
      ),
    },
    {
      title: 'Mã',
      width: 221,
      key: 'attr_code',
      align: 'center',
      render: (_, record: any) => (
        <Input
          value={record.value}
          width={223}
          className="border-[#DADADD] border-1 border-solid rounded-[4px] "
          inputClassName="pl-[12px] pt-[12px] pr-[8px] pb-[8px] text-center"
        />
      ),
    },
    {
      title: 'Kiểu thuộc tính',
      width: 352,
      key: 'attr_type',
      align: 'left',
      render: (_, record: any) => (
        <Input
          value={record.label}
          width={488}
          className="border-[#DADADD] border-1 border-solid rounded-[4px] "
          inputClassName="pl-[12px] pt-[12px] pr-[8px] pb-[8px]"
        />
      ),
    },
    {
      title: 'Thao tác',
      width: 625,
      key: 'action',
      align: 'right',
      render: (_, record: any) => {
        return (
          <div className="flex w-full justify-end">
            <div>
              <Icon icon="trash" size={24} />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex justify-between min-w-[230px]  items-center ">
          <div onClick={() => (window.location.href = `/products/attribute`)}>
            <Icon icon="back1" size={36} />
          </div>
          <TitlePage title="Tạo mới thuộc tính" />
        </div>
        <div className="flex justify-between min-w-[270px] items-center">
          <Button
            variant="danger-outlined"
            prefixIcon={<Icon icon="trash" size={24} />}
            width={110}
            onClick={() => setIsShowModalDeleteAttr(true)}
          >
            Xoá
          </Button>
          <Button
            variant="secondary"
            width={148}
            height={45}
            // text="LƯU (F12)"
            text="LƯU (F12)"
            onClick={() => {
              form.submit();
            }}
            // onClick={() =>
            //   itemSelected ? onSubmit("update") : onSubmit("add")
            // }
            // disabled={disabledBtn}
          />
        </div>
      </div>
      <div className="w-full flex justify-between bg-[#fff] p-[12px] gap-[16px] rounded-[4px] mt-[19px] mb-[24px]">
        <Input label="Mã thuộc tính *" width={640} />
        <Input label="Tên thuộc tính *" width={640} />
      </div>
      <div className="relative">
        <Table columns={columns} pagination={false} />
      </div>
      <div className="text-[#384ADC] mt-[24px] text-[15px] font-semibold cursor-pointer">
        + Thêm mới
      </div>
      <ModalConfirm
        titleBody="Xóa thuộc tính này?"
        // onOpen={deleteCustomerAddress}
        onClose={() => setIsShowModalDeleteAttr(false)}
        isVisible={isShowModalDeleteAttr}
      />
    </div>
  );
};

export default CreateAttribute;
