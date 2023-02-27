import React from 'react';
import { Table } from 'antd';
import Select from 'components/Select/Select';
import TitlePage from 'components/TitlePage/Titlepage';
import Image from 'next/image';
import { ColumnsType } from 'antd/es/table';
import { CustomerReview } from '../CustomerType';
import { isArray } from 'lodash';

const CustomerReview = () => {
  const filterList = [
    { label: 'Mới nhất', value: 'latest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  const handleChangeValue = (id: any, key: string, value: any) => {};

  const data: CustomerReview[] = Array(50).fill({
    createdAt: Date.now(),
    id: '0337166027',
    name: 'KHÔ GÀ VIỆT 200g - Thực phẩm',
    star: 5,
    detail: 'Tôt',
    image: [
      {
        src: require('../../../public/yellow-star.svg'),
      },
      {
        src: require('../../../public/yellow-star.svg'),
      },
    ],
    list_label: [
      {
        label: 'good',
      },
      {
        label: 'bad',
      },
    ],
    is_show: 0,
  });

  const columns: ColumnsType<CustomerReview> = [
    {
      title: 'THỜI GIAN',
      width: 220,
      key: 'created_at',
      align: 'left',
      render: (_, record) => (
        <div className="text-[14px] text-[#1d1c2d] font-normal">
          18:35 <br></br>29/12/2022
          {/* {record.createdAt} */}
        </div>
      ),
    },
    {
      title: 'TÊN & ID KHÁCH HÀNG',
      width: 250,
      key: 'id',
      align: 'left',
      render: (_, record) => (
        <div className="text-[14px] text-[#1d1c2d] font-normal">
          {record.id}
        </div>
      ),
    },
    {
      title: 'SP ĐÁNH GIÁ',
      width: 295,
      key: 'name',
      align: 'left',
      render: (_, record) => (
        <div className="text-[14px] text-[#1d1c2d] font-normal">
          {record.name}
        </div>
      ),
    },
    {
      title: 'ĐÁNH GIÁ',
      width: 147,
      key: 'rate',
      align: 'left',
      render: (_, record) => (
        <div className="flex justify-start items-center gap-[6px]">
          {record.star}
          <Image
            src={require('../../../public/yellow-star.svg')}
            width={16}
            height={16}
            alt="start"
          />
        </div>
      ),
    },
    {
      title: 'CHI TIẾT',
      width: 368,
      key: 'detail',
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col justify-start">
          <span className="text-[14px] text-[#1d1c2d] font-normal mb-[8px]">
            {record.detail}
          </span>
          <div className="flex justify-start gap-[10px] items-center mb-[8px]">
            {isArray(record.image) &&
              record.image.map((item, index) => (
                <Image
                  key={index}
                  src={item.src}
                  width={71}
                  height={71}
                  alt="item-review"
                />
              ))}
          </div>
          <div className="flex justify-start gap-[10px] items-center">
            {isArray(record.list_label) &&
              record.list_label.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[12px] text-[#0F172A] text-sm font-light bg-[#F0F0F1] px-[11px] py-[6px]"
                >
                  {item.label}
                </div>
              ))}
          </div>
        </div>
      ),
    },
    {
      title: 'THAO TÁC',
      width: 147,
      key: 'action',
      align: 'left',
      render: (_, record) => (
        <div
        className="font-semibold text-[#384ADC] cursor-pointer"
        onClick={() => {
          console.log("record", record);
          handleChangeValue(
            record.id,
            "is_show",
            record.is_show == 0 ? 1 : 0
          );
          record.is_show == 1 ? 0 : 1;
        }}
      >
        {record.is_show == 0 ? "Hiện" : "Ẩn"}
      </div>
        // <div
        //   className="text-[#384adc] text-[14px] font-semibold"
        //   onClick={() => {
        //     record.is_show === 0 ? 1 : 0;
        //   }}
        // >
        //   {record.is_show == 0 ? 'Hiện' : 'Ẩn'}
        // </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[24px]">
        <div className="flex flex-col justify-start">
          <TitlePage title="Quản lý đánh giá" />
          <span className="text-[13px] text-[#1d1c2d] font-normal">
            Quản lý ứng dụng / Quản lý đánh giá
          </span>
        </div>
        <Select
          options={filterList}
          placeholder="Sắp xếp theo"
          showArrow={true}
          style={{ width: 150 }}
        />
      </div>
      <div className="relative">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default CustomerReview;
