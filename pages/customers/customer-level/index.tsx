import React from 'react';
import { Table } from 'antd';
import Icon from 'components/Icon/Icon';
import Button from 'components/Button/Button';
import TitlePage from 'components/TitlePage/Titlepage';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

const CustomerLevel = () => {
  const data = Array(7)
    .fill({
      image: require('../../../public/yellow-star.svg'),
      type: 'Khách hàng mới',
      note: 'User mới tạo account trên App và chưa có lịch sử mua hàng',
    })
    .map((item, index) => ({ ...item, id: index + 1 }));

    const columns: ColumnsType<any> =[
      {
        title: '#',
        key: "id",
        align: "center",
        width: 155,
        render: (_, record: any) => (
          <div>
            {record.id}
          </div>
        )
      },
      {
        title: "LOẠI PHÂN KHÚC",
        width: 620,
        key: "type",
        align: "left",
        render: (_, record: any) => (
          <div className='flex gap-[10px] justify-start items-center'>
            <div className='relative w-[39px] h-[39px] rounded-[50%]'>
              <Image src={record.image} fill alt="type avatar"/>
            </div>
            <div className='text-[#1a202c] text-[13px] font-normal'>
              {record.type}
            </div>
          </div>
        )
      },
      {
        title: "GHI CHÚ",
        width: 630,
        key: "note",
        align: "left",
        render: (_, record: any) => (
          <div className='text-[#4b4b59] text-base font-normal'>
            {record.note}
          </div>
        )
      }
    ]
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[24px]">
        <TitlePage title="Phân hạng thành viên" />
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
      <div className="relative">
        <Table columns={columns} dataSource={data} pagination={false}/>
      </div>
    </div>
  );
};

export default CustomerLevel;