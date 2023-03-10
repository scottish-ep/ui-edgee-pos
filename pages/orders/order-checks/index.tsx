/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format, parseISO } from 'date-fns';

import {
  wareHouseList,
  warehouses,
  statusOrderChecksOptions,
  orderChecksList,
} from '../../../const/constant';
import { StatusColorEnum, StatusEnum, StatusList } from '../../../types';
import Tabs from '../../../components/Tabs';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import DatePicker from '../../../components/DateRangePicker/DateRangePicker';
import DropdownStatus from '../../../components/DropdownStatus';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';
import { onCoppy } from '../../../utils/utils';
import TableEmpty from '../../../components/TableEmpty';
import { IOrderChecks } from '../orders.type';
import ModalAddOrderChecks from './ModalAddOrderChecks';
import PaginationCustom from '../../../components/PaginationCustom';
import { useDebounce } from 'usehooks-ts';
import OrderCheckCommandApi from '../../../services/order-check-command';
import DateRangePickerCustom from '../../../components/DateRangePicker/DateRangePickerCustom';
import { RangePickerProps } from 'antd/lib/date-picker';
import vi from 'date-fns/locale/vi';
import { uuid } from 'uuidv4';

const OrderChecksList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [orderChecks, setOrderChecks] = useState<IOrderChecks[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: orderChecks.length,
    pageSize: 10,
    page: 1,
  });
  const [isShowModalAddOrderChecks, setIsShowModalAddOrderChecks] =
    useState(false);
  const [isShowModalRemoveOrderChecks, setIsShowModalRemoveOrderChecks] =
    useState(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [creator, setCreator] = useState<string>('');
  const [reload, setReload] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const debouncedValue = useDebounce<string>(searchPhrase, 500);
  const debounceCreator = useDebounce<string>(creator, 500);
  const [status, setStatus] = useState<string>('T???t c???');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [tabStatus, setTabStatus] = useState([
    { name: 'T???t c???', count: 0 },
    { name: 'M???i', count: 0 },
    { name: 'Ho??n t???t', count: 0 },
  ]);

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
  }, []);

  const onDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings?.[0]);
      setDateTo(dateStrings?.[1]);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  useEffect(() => {
    getAllOrderCommands();
  }, [page, pageSize, debouncedValue, reload, status, debounceCreator, dateTo]);

  const getAllOrderCommands = async () => {
    setLoading(true);
    const {
      data,
      totalPage,
      totalItems,
      countAll,
      countCompleteItems,
      countNewItems,
    } = await OrderCheckCommandApi.list({
      limit: pageSize,
      page: page,
      name: searchPhrase,
      status,
      creator,
      date_to: dateTo,
      date_from: dateFrom,
    });

    setOrderChecks(data);
    setTotalItems(totalItems);
    setTabStatus([
      { name: 'T???t c???', count: countAll },
      { name: 'M???i', count: countNewItems },
      { name: 'Ho??n t???t', count: countCompleteItems },
    ]);
    setLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const colsData: IOrderChecks[] = Array(50) 
  .fill({
    code: "ADK123",
    created_by: "Tester",
    created_at: Date.now(),
    transport_company: "Dream",
    order_check_number: 13,
    status: 'M???i',
    note: "Nope"
  })
  .map((item, index) => ({...item, id: index++}))

  const columns: ColumnsType<IOrderChecks> = [
    {
      title: 'M?? phi??n',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#EF4444] font-semibold"
          onClick={(e) => onCoppy(e, record?.code || '')}
        >
          {record?.id}
        </span>
      ),
    },
    {
      title: 'NV x??? l?? / Th???i gian',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {record?.created_by}
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            {record?.created_at
              ? format(new Date(record?.created_at), 'HH:mm - dd/MM/yyyy', {
                  locale: vi,
                })
              : ''}
          </span>
        </div>
      ),
    },
    {
      title: '????n v??? v???n chuy???n',
      width: 100,
      dataIndex: 'shippingUnit',
      key: 'shippingUnit',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {record?.transport_company}
        </span>
      ),
    },
    {
      title: 'S??? ??H ?????i so??t',
      width: 100,
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {record?.order_check_number || 0}
        </span>
      ),
    },
    {
      title: 'Tr???ng th??i',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <span
          className={`text-medium font-semibold ${
            record?.status === 'M???i' ? 'text-[#10B981]' : 'text-[#384ADC]'
          }`}
        >
          {record?.status}
        </span>
      ),
    },
    {
      title: 'Ghi ch??',
      width: 200,
      dataIndex: 'note',
      key: 'note',
      align: 'left',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {record?.note}
        </span>
      ),
    },
  ];

  const onDeleteMany = async () => {
    const { data } = await OrderCheckCommandApi.deleteMany(selectedRowKeys);
    if (data) {
      message.success('X??a th??nh c??ng');
    }
    setReload(uuid);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Qu???n l?? ?????i so??t" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="danger-outlined"
            width={137}
            icon={<Icon icon="trash" size={24} />}
            onClick={() => setIsShowModalRemoveOrderChecks(true)}
            disabled={selectedRowKeys.length === 0}
          >
            X??a
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => setIsShowModalAddOrderChecks(true)}
          >
            Th??m m???i
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
              H??? tr???
            </a>
          </Button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nh???p m?? phi??n giao d???ch"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <Input
          width={306}
          prefix={<Icon icon="personalcard" size={24} />}
          placeholder="Nh???p t??n nh??n vi??n"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />
        <DateRangePickerCustom width={306} onChange={onDateChange} />
      </div>
      <Tabs
        defaultTab="T???t c???"
        showTabAll={false}
        tabs={tabStatus}
        onChange={(val) => setStatus(val)}
      />
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = `/orders/order-checks/${record?.id}`;
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={orderChecks}
        dataSource={colsData}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        total={totalItems}
        defaultPageSize={pageSize}
        current={page}
        onChangePage={(page) => setPage(page)}
        onChangePageSize={(pageSize) => setPageSize(pageSize)}
      />

      <ModalAddOrderChecks
        isVisible={isShowModalAddOrderChecks}
        onClose={() => setIsShowModalAddOrderChecks(false)}
        onSuccess={(uuid) => setReload(uuid)}
      />

      <ModalRemove
        isVisible={isShowModalRemoveOrderChecks}
        onClose={() => setIsShowModalRemoveOrderChecks(false)}
        onOpen={() => setIsShowModalRemoveOrderChecks(false)}
        titleBody="X??a phi??n ?????i so??t n??y?"
        content="Th??ng tin c???a phi??n ?????i so??t s??? kh??ng c??n n???a."
        onOk={onDeleteMany}
      />
    </div>
  );
};

export default OrderChecksList;
