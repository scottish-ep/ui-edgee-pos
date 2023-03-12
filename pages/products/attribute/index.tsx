import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Button from 'components/Button/Button';
import Icon from 'components/Icon/Icon';
import TitlePage from 'components/TitlePage/Titlepage';
import { useEffect, useState } from 'react';
import { onCoppy } from '../../../utils/utils';
import { IsProduct } from '../product.type';
import CreateAttribute from './create';
import ModalConfirm from 'components/Modal/ModalConfirm/ModalConfirm';
import ItemAttributeApi from 'services/item-attributes';

const AttributeSetting = () => {

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: pageSize,
    defaultCurrent: page,
  });

  // Data 
  const pageTitle = "Cài Đặt Thuộc Tính";
  const [attributes, setAttributes] = useState<IsProduct[]|any[]>([]);
  const [attribute, setAttribute] = useState<IsProduct|any>();
  const attrList: IsProduct[] = Array(50)
    .fill({
      code: 'MAU',
      name: 'Màu sắc',
      type: [
        { label: 'TRẮNG', value: 'trang' },
        { label: 'ĐEN', value: 'den' },
      ],
      updatedAt: '01/09/2022',
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
          {record?.id}
        </span>
      ),
    },
    {
      title: 'Mã thuộc tính',
      width: 119,
      key: 'code',
      align: 'center',
      render: (_, record: any) => (
        <span className="text-[#1D1C2D] text-[14px] font-medium uppercase">
          {record?.code}
        </span>
      ),
    },
    {
      title: 'Tên thuộc tính',
      width: 284,
      key: 'name',
      align: 'left',
      render: (_, record: any) => (
        <span className="text-[#1D1C2D] text-[14px] font-medium">
          {record?.name}
        </span>
      ),
    },
    {
      title: 'Kiểu thuộc tính',
      width: 505,
      key: 'type',
      align: 'left',
      render: (_, record: any) => (
        <span className="flex justify-start">
          {record?.type?.map((item: any) => (
            <span
              key={item?.value}
              className="py-[4px] px-[8px] bg-[#F5F5F6] w-max text-[#1D1C2D] mr-[8px]"
            >
              {item?.label}
            </span>
          ))}
        </span>
      ),
    },
    {
      title: 'Cập nhật lần cuối',
      width: 151,
      key: 'updatedAt',
      align: 'center',
      render: (_, record: any) => (
        <span className="text-[#1D1C2D] text-[14px] font-medium">
          {record?.updatedAt}
        </span>
      ),
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
            <div
              onClick={() =>
                (window.location.href = `/products/attribute/${record?.id}`)
              }
            >
              <Icon icon="edit-2" size={24} />
            </div>
            <div onClick={() => {
              setAttribute(record);
              setIsShowModalConfirm(true);
              }}>
              <Icon icon="trash" size={24} />
            </div>
          </div>
        );
      },
    },
  ];

  // Functions 
  const fetchingData = () => {
    const dataParams = {
      // limit: pageSize,
      // offset: page - 1
    };

    const res = ItemAttributeApi.getItemAttribute(dataParams);
    res.then(data => {
      setAttributes(data);
    });

    console.log(attributes);

  };

  const handleConfirmDelete = () => {
    ItemAttributeApi.deleteManyItemAttributes([attribute?.id]);
    setIsShowModalConfirm(false);
    setAttribute(undefined);
  };

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[12px]">
        <TitlePage title="Danh sách thuộc tính" />
        <div className="flex justify-between min-w-[350px]">
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
            // onClick={handleExportExcel}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = `/products/attribute/create`)
            }
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
        <Table
        // rowKey={(record) => record.id}
          onChange={(e) => {
            console.log('e', e);
            setPageSize(e.pageSize || 10);
            setPage(e.current || 1);
          }}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={attrList}
          // dataSource={[...attributes]}  
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
      </div>
      <ModalConfirm
        titleBody="Xóa thuộc tính này?"
        content={
          <div className="text-center">
            Mọi thuộc tính của sản phẩm này <br></br>sẽ bị xóa khỏi hệ thống
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
    </div>
  );
};

export default AttributeSetting;
