import { Table } from 'antd';
import Icon from 'components/Icon/Icon';
import Button from 'components/Button/Button';
import { ColumnsType } from 'antd/es/table';
import TitlePage from 'components/TitlePage/Titlepage';
import { useState, useEffect } from 'react';
import { IOrderCancel } from '../orders.type';
import ModalCancel from '../container-management/ModalCancel';
const CancelReason = () => {
  const [isShowModalCancel, setIsShowModalCancel] = useState(false);
  const [rowSelected, setRowSelected] = useState<IOrderCancel>();
  const [itemList, setItemList] = useState<IOrderCancel[]>(
    Array(10)
      .fill({
        name: 'Sai số lượng',
      })
      .map((item, index) => ({ ...item, id: index++ }))
  );
  const data: IOrderCancel[] = Array(3)
    .fill({
      name: 'Sai số lượng',
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const detail = {
    name: 'Huy',
  };

  useEffect(() => {
    document.title = 'Các lý do hủy';
  });

  // useEffect(() => {
  //   setItemList(data);
  // }, [data]);

  const handleAdd = (e: any) => {
    setItemList((current: any) => [
      ...current,
      { id: Math.floor(Math.random() * 10000000).toString(), name: '' },
    ]);
  };

  const handleDelete = (id: string | number) => {
    setItemList((prevItemList) =>
      prevItemList.filter((reason) => reason.id !== id)
    );
    console.log('id', id);
    console.log('item', itemList);
  };

  const columns: ColumnsType<IOrderCancel> = [
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
      key: 'name',
      width: 795,
      align: 'left',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.name}</div>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 400,
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-[15px]">
          <div
            // onClick={(e) => {
            //   setHaveDetail(record.name);
            //   setIsShowModalCustomerSource(true);
            //   console.log('detail', haveDetail);
            // }}
            onClick={() => {
              setRowSelected(record);
              setIsShowModalCancel(true);
            }}
          >
            <Icon icon="edit-2" size={24} />
          </div>
          <div onClick={() => handleDelete(record.id)}>
            <Icon icon="trash" size={24} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-[24px]">
        <TitlePage title="Các lý do hủy" />\
        <div className="flex justify-between gap-[20px]">
          <Button
            variant="primary"
            width={151}
            color="white"
            prefixIcon={<Icon icon="add" size={24} />}
            onClick={() => {
              setRowSelected({ name: '', id: '' });
              setIsShowModalCancel(true);
            }}
            // onClick={() => setIsShowModalAddContainerManagement(true)}
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
          rowKey={(record) => record.id}
          pagination={false}
          columns={columns}
          dataSource={[...itemList]}
          // onRow={(record) => {
          //   return {
          //     onClick: () => {
          //       setRowSelected(record);
          //     },
          //   };
          // }}
        />
      </div>
      <ModalCancel
        rowSelected={rowSelected}
        title={
          rowSelected?.name !== '' ? 'Cập nhật lí do hủy' : 'Thêm mới lí do hủy'
        }
        itemList={[...itemList]}
        setItemList={setItemList}
        onClose={() => {
          setRowSelected(undefined);
          setIsShowModalCancel(false);
        }}
        isVisible={isShowModalCancel}
      />
    </div>
  );
};

export default CancelReason;
