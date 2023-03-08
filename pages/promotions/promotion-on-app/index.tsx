import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import Image from 'next/image';

import { comboList } from '../../../const/constant';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import DatePicker from '../../../components/DateRangePicker/DateRangePicker';
import { IPromotionManage } from '../promotion.type';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';
import { isArray, onCoppy } from '../../../utils/utils';
import TableEmpty from '../../../components/TableEmpty';
import PaginationCustom from '../../../components/PaginationCustom';
import PromotionProgramApi from '../../../services/promotion-programs';
import WarehouseApi from '../../../services/warehouses';
import { CSVLink } from 'react-csv';
import { uuid } from 'uuidv4';
import DateRangePickerCustom from '../../../components/DateRangePicker/DateRangePickerCustom';
import { useDebounce } from 'usehooks-ts';
import moment from 'moment';
import _ from 'lodash';

const PromotionOnApp = () => {
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [listDisabledId, setListDisabledId] = useState<any[]>([]);
  const [reload, setReload] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSelectDateRange = (value: any) => {
    if (value) {
      setStartDate(value[0].format('YYYY-MM-DD'));
      setEndDate(value[1].format('YYYY-MM-DD'));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };
  const handleShowPromotion = async (status: any, dt: any) => {
    setListDisabledId(listDisabledId.concat(dt.id));
    await PromotionProgramApi.updatePromotionProgram(dt.id, {
      is_active: status,
    });
    setReload(uuid());
    let newListDisabledId = listDisabledId.filter(
      (item: any) => item.id != dt.id
    );
    setListDisabledId(newListDisabledId);
  };

  const handleExportExcel = () => {
    window.location.href = '/api/v2/customers/export/';
  };

  const colData: IPromotionManage[] = Array(50)
    .fill({
      channel: 'Tai quay',
      code: 'KM0083',
      createdAt: Date.now(),
      created_at: Date.now(),
      img: require('public/yellow-star.svg'),
      created_user: {
        createdAt: Date.now(),
        created_at: Date.now(),
        id: 102,
        name: 'Nguyen van A',
      },
      created_user_id: 102,
      end_date: Date.now(),
      is_active: false,
      item_channel: {
        code: 'OFFLINE',
        created_at: null,
        id: 3,
        label: 'Tai quay',
        updated_at: null,
      },
      item_channel_id: 3,
      name: 'Khuyen mai 50%',
      start_date: Date.now(),
      type: 'item',
      updated_at: Date.now(),
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<IPromotionManage> = [
    {
      title: 'Áp dụng',
      width: 81,
      key: 'is_active',
      sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            disabled={listDisabledId.includes(record.id)}
            className="button-switch"
            onChange={(e) => handleShowPromotion(e, record)}
            checked={record.is_active}
          />
        );
      },
    },
    {
      title: 'Mã KM',
      width: 110,
      key: 'code',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-medium"
          onClick={(e) => {
            record?.code && onCoppy(e, record?.code);
          }}
        >
          {record?.code || '--'}
        </span>
      ),
    },
    {
      title: 'Ảnh',
      width: 64,
      key: 'img',
      align: 'center',
      render: (_, record) => (
        <div className="w-[64px] h-[64px]">
          {record.img ? (
            <Image src={record.img} fill alt="promotion image" />
          ) : (
            <Image src={require('public/yellow-star.svg')} fill alt="" />
          )}
        </div>
      ),
    },
    {
      title: 'Tên mã khuyến mãi',
      width: 564,
      key: 'promotion',
      align: 'left',
      render: (_, record) => (
        <span className="text-[#2E2D3D] text-sm font-medium">
          {record.name}
        </span>
      ),
    },
    {
      title: 'Thời gian áp dụng',
      width: 212,
      align: 'center',
      key: 'time',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {moment(new Date(record?.start_date)).format('DD/MM/YYYY')} -{' '}
          {moment(new Date(record?.end_date)).format('hh-mm DD/MM/YYYY')}
        </span>
      ),
    },
    {
      title: 'Người tạo / Ngày tạo',
      width: 152,
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {record.created_user?.name}
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            {moment(new Date(record?.created_at || null)).format(
              'hh-mm DD/MM/YYYY'
            )}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-[24px]">
        <TitlePage title="Mã khuyến mãi trên App" />
        <div className="flex justify-between gap-[8px]">
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
            onClick={handleExportExcel}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => window.location.href=`/promotions/promotion-on-app/create`}
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <DateRangePickerCustom width={306} onChange={handleSelectDateRange} />
        <Button
          variant="no-outlined"
          prefixIcon={<Icon icon="trash" size={24} />}
          width={166}
        >
          Xoá CTKM
        </Button>
      </div>
      <div className="relative">
        <Table
          rowKey={(record) => record.id}
          locale={{
            emptyText: <TableEmpty />,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () =>
                (window.location.href = `/promotions/promotion-on-app/${record.id}`),
            };
          }}
          onChange={(e) => {
            setPageSize(e.pageSize || 10);
          }}
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={colData}
          scroll={{ x: 50 }}
        />
      </div>
    </div>
  );
};

export default PromotionOnApp;
