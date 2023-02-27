import React, { useState } from 'react';
import { Table } from 'antd';
import Icon from 'components/Icon/Icon';
import Button from 'components/Button/Button';
import TitlePage from 'components/TitlePage/Titlepage';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import ModalCustomerSource from '../ModalAddCustomer/ModalCustomerSource';

const CustomerSource = () => {
  const [isShowModalCustomerSource, setIsShowModalCustomerSource] = useState(false);
  const [haveDetail, setHaveDetail] = useState('');
  // const detail = {
  //   avatar: require('../../../public/yellow-start.svg'),
  //   name: 'Tran Huyen',
  // };
  const data = Array(6)
    .fill({
      image: require('../../../public/yellow-star.svg'),
      name: 'In App',
    })
    .map((item, index) => ({ ...item, id: `${index + 1}` }));

  const columns: ColumnsType<any> = [
    {
      title: '#',
      key: 'id',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.id}</div>
      ),
    },
    {
      title: 'ICON',
      key: 'icon',
      width: 200,
      // style: {{display: flex}},
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Image src={record.image} width={40} height={40} alt="icon" />
        </div>
      ),
    },
    {
      title: 'TÊN',
      width: 1074,
      align: 'left',
      key: 'name',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.name}</div>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-between gap-[10px]">
          <div
            onClick={(e) => {
              setHaveDetail(record.name);
              setIsShowModalCustomerSource(true);
              console.log('detail', haveDetail);
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
        <TitlePage title="Nguồn khách hàng" />
        <div className="flex gap-[10px] justify-between items-center">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add-1" size={24} color="white" />}
            onClick={() => {
              setHaveDetail('');
              setIsShowModalCustomerSource(true);
              console.log('detail', haveDetail);
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
      <ModalCustomerSource
        detail={haveDetail}
        onClose={() => setIsShowModalCustomerSource(false)}
        isVisible={isShowModalCustomerSource}
      />
    </div>
  );
};

export default CustomerSource;
