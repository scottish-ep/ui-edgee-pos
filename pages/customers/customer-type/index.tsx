import React, { useState } from 'react';
import { Table } from 'antd';
import Icon from 'components/Icon/Icon';
import Button from 'components/Button/Button';
import TitlePage from 'components/TitlePage/Titlepage';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import ModalSource from '../ModalAddCustomer/ModalCustomerSource';
import ModalCustomerType from '../ModalAddCustomer/ModalCustomerType';

const CustomerType = () => {
  const [isShowModalCustomerType, setIsShowModalCustomerType] = useState(false);
  const [haveDetail, setHaveDetail] = useState('');
  const detail = {
    name: 'Tran Huyen',
  };

  const data = Array(6)
    .fill({
      name: 'khách mới thêm',
    })
    .map((item, index) => ({ ...item, id: `${index + 1}` }));

  const columns: ColumnsType<any> = [
    {
      title: '#',
      key: 'id',
      width: 200,
      align: 'left',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.id}</div>
      ),
    },
    {
      title: 'TÊN',
      width: 798,
      align: 'left',
      key: 'name',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.name}</div>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      align: 'right',
      width: 400,
      render: (_, record) => (
        <div className="flex w-full justify-end gap-[10px]">
          <div
            onClick={(e) => {
              setIsShowModalCustomerType(true);
            }}
          >
            <Icon icon="edit-2" size={24} />
          </div>
          <div>
            <Icon icon="trash" size={24} />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[24px]">
        <TitlePage title="Phân loại khách hàng" />
        <div className="flex gap-[10px] justify-between items-center">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add-1" size={24} color="white" />}
            onClick={() => {
              setIsShowModalCustomerType(true);
            }}
          >
            Thêm mới
          </Button>
          <Button
            variant="no-outlined"
            width={62}
            color="white"
            icon={<Icon icon="question" size={16} />}
          >
            <a
              href="https://docs.google.com/document/d/1wXPHowLeFIU6q-iXi-ryM56m7GuLahu4FFxsNPzJXYw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hỗ trợ
            </a>
          </Button>
        </div>
      </div>
      <div className="relative">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <ModalCustomerType
        detail={detail}
        onClose={() => setIsShowModalCustomerType(false)}
        isVisible={isShowModalCustomerType}
      />
    </div>
  );
};

export default CustomerType;
