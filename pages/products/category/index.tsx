import { useEffect, useState, createContext, useContext } from 'react';
// Import Assets
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import get from "lodash/get";

// Import Components
import Image from 'next/image';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import TitlePage from '../../../components/TitlePage/Titlepage';
import ModalConfirm from 'components/Modal/ModalConfirm/ModalConfirm';

// Import service
import ItemCategoryApi from '../../../services/item-categories';

// Add interface
import { IsProduct } from '../product.type';
// Add modal
import ModalUpdateCat from '../Modal/ModalUpdateCat';
import { da } from 'date-fns/locale';
import { error } from 'console';

const pageTitle = 'Danh mục sản phẩm';
const perPage = 10;
const serviceFetching = 'Đang tải dữ liệu...';
const serviceFetched = 'Dữ liệu đã được tải!';
const serviceFailed = 'Không tìm thấy dữ liệu!';

// export const CreateUpdateItemCategoryContext = createContext<IsProduct | any>('');
// export const useItemCategoryContext = () => useContext(CreateUpdateItemCategoryContext);
const ProductCategory = (props: any) => {

  // States
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [isShowModalUpdateCat, setIsShowModalUpdateCat] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / perPage);

  // Data 
  const [createUpdateCategory, setCreateUpdateCategory] = useState<IsProduct|any>();
  const [itemCategories, setItemCategories] = useState<IsProduct[]>([]);

  const items: IsProduct[] = [
    { order_id: 1, img: require('../../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../../public/clothes.svg'), name: 'Áo' },
    { order_id: 1, img: require('../../../public/clothes.svg'), name: 'Áo' },
  ];

  const columns: ColumnsType<IsProduct> = [
    {
      title: '#',
      width: 91,
      key: '#',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return <div>{record.id}</div>;
      },
    },
    {
      title: 'Ảnh',
      width: 97,
      key: 'image',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div className="w-[72px] h-[72px] relative rounded-[50%] m-auto">
            <Image src={record.image} fill alt="" />
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
            <div  onClick={() => {
              setIsShowModalUpdateCat(true); 
              setIsUpdate(true);
              setCreateUpdateCategory(record);
              }}>
              <Icon icon="edit-2" size={24} />
            </div>
            <div onClick={() => {
              setIsShowModalConfirm(true);
              setCreateUpdateCategory(record);
              }}>
              <Icon icon="trash" size={24} />
            </div>
          </div>
        );
      },
    },
  ];

  // Functions
  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleCreateUpdateCategory = (event: any) => {
    setIsShowModalUpdateCat(false);
    setCreateUpdateCategory(undefined);
  };

  const handleConfirmDelete = async () => {
    ItemCategoryApi.deleteManyItemCategorys([createUpdateCategory?.id]);
    setIsShowModalUpdateCat(false);
    setCreateUpdateCategory(undefined);
  };

  const fetchingData = () => {
    const dataParams = {
      // limit: perPage,
      // offset: currentPage - 1
    };
    
    const res = ItemCategoryApi.getItemCategory(dataParams).then(data => {
      // console.log(data);
      setItemCategories(data?.data);
    });
  };


  useEffect(() => {
    document.title = pageTitle;
  }, []);

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    // <CreateUpdateItemCategoryContext.Provider value={{createUpdateCategory, setCreateUpdateCategory}}>

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
              onClick={() => {
                setIsShowModalUpdateCat(true);
                setIsUpdate(false);
                setCreateUpdateCategory(undefined);
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
          <div className="relative w-full">
            <Table
              rowKey={(record: any) => record.id}
              loading={loading}
              columns={columns}
              className="w-full"
              dataSource={itemCategories}
            />
          </div>
        </div>
        <ModalUpdateCat
          isUpdate = {isUpdate}
          data={createUpdateCategory}
          onOpen={() => handleCreateUpdateCategory}
          onClose={() => {
            setIsShowModalUpdateCat(false);
            setCreateUpdateCategory(undefined);
          }}
          isVisible={isShowModalUpdateCat}
        />
        <ModalConfirm
          titleBody="Xóa thông tin danh mục?"
          content={
            <div className="text-center">
              Mọi dữ liệu của danh mục này <br />
              sẽ bị xoá khỏi hệ thống
            </div>
          }
          onOpen={handleConfirmDelete}
          onClose={() => setIsShowModalConfirm(false)}
          isVisible={isShowModalConfirm}
        />
      </div>

      // {/* </CreateUpdateItemCategoryContext.Provider> */}
    
  );
};

export default ProductCategory;
