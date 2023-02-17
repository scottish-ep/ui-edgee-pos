import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
// import get from "lodash/get";
import Image from 'next/image';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import TitlePage from '../../components/TitlePage/Titlepage';
import { IsProduct } from './product.type';
import ModalUpdateCat from './Modal/ModalUpdateCat';

const ProductPortfolio = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [isShowModalUpdateCat, setIsShowModalUpdateCat] = useState(false);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // const headers = [
  //   { label: '#', key: '#' },
  //   { label: 'Ảnh', key: 'image' },
  //   { label: 'Tên danh mục', key: 'portfolio' },
  //   { label: 'Thao tác', key: 'action' },
  // ];
  const handleConfirmDelete = async () => {
    setIsShowModalUpdateCat(false);
  };
  const items: IsProduct[] = [
    { order_id: 1, img: require('../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../public/clothes.svg'), name: 'Áo' },
  ];

  const columns: ColumnsType<IsProduct> = [
    {
      title: '#',
      width: 91,
      key: '#',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return <div>{record.order_id}</div>;
      },
    },
    {
      title: 'Ảnh',
      width: 97,
      key: 'image',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div className="w-[72px] h-[72px] relative rounded-[50%] m-auto">
            <Image src={record.img} fill alt="" />
          </div>
        );
      },
    },
    {
      title: 'Tên danh mục',
      width: 978,
      key: 'portfolio',
      fixed: 'left',
      align: 'left',
      render: (_, record: any) => {
        return (
          <span className="text-[#1D1C2D] text-[14px] font-semibold">
            {record.name}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      width: 107,
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div className="flex w-full justify-between">
            <div>
              <Icon icon="edit-2" size={24} />
            </div>
            <div>
              <Icon icon="trash" size={24} />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between  flex-wrap mt-[26px]">
        <TitlePage title="Danh mục sản phẩm" />
        <div className="mb-[12px] flex gap-[8px] flex-wrap">
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add-1" size={24} color="white" />}
            onClick={()=>setIsShowModalUpdateCat(true)}
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
        <div className="relative w-full">
          <Table
            rowKey={(record: any) => record.id}
            loading={loading}
            columns={columns}
            className="w-full"
            dataSource={items}
          />
        </div>
      </div>
      <ModalUpdateCat
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalUpdateCat(false)}
        isVisible={isShowModalUpdateCat}
      />
    </div>
  );
};

export default ProductPortfolio;
