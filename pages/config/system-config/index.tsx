import { useState, useEffect } from 'react';
import { Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TitlePage from 'components/TitlePage/Titlepage';

const SystemConfig = () => {
  useEffect(() => {
    document.title = 'Cấu hình hệ thống';
  });

  const colData = Array(5)
    .fill({
      name: 'Xuất kho ngay sau khi tạo đơn hàng',
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<any> = [
    {
      title: '#',
      key: 'id',
      width: 50,
      align: 'center',
      render: (_, record) => <div>{record.id}</div>,
    },
    {
      title: 'Tên Cấu Hình',
      width: 440,
      key: 'name',
      align: 'left',
      render: (_, record) => (
        <div className="font-medium text-sm text-[#1a202c]">{record.name}</div>
      ),
    },
    {
      title: 'Giá Trị',
      width: 880,
      align: 'center',
      key: 'value',
      render: (_, record) => (
        <div>
          <Switch />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-start">
        <TitlePage title="Hệ thống" description="Cấu hình" />
      </div>
      <div className="relative">
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={colData}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SystemConfig;
