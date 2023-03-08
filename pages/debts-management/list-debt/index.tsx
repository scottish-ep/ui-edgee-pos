/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import { productTypeList } from '../../../const/constant';
import Tabs from '../../../components/Tabs';
import type { ColumnsType } from 'antd/es/table';
import { message, Table } from 'antd';
import { StatusColorEnum, StatusEnum, StatusList } from '../../../types';
import { IDebt, ListDebtProps } from './../listdebt.type';
import classNames from 'classnames';
import { list_Debt } from '../../../const/constant';
import styles from '../../styles/ListPayment.module.css';
import ModalDebtDetail from './../Modal/ModalDebtDetail';
import ModalPayDebt from './../Modal/ModalPayDebt';
import ModalAddDebt from './../Modal/ModalAddDebt';
import { useDebounce } from 'usehooks-ts';
import { RangePickerProps } from 'antd/lib/date-picker';
import DebtApi from '../../../services/debt';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import PaginationCustom from '../../../components/PaginationCustom';
import { format, parseISO } from 'date-fns';
import { CSVLink } from 'react-csv';
import { isArray, onCoppy } from '../../../utils/utils';

export const colorStatus = [
  {
    key: 'Chờ duyệt',
    value: '#8B5CF6',
  },
  {
    key: 'Đã duyệt',
    value: '#0EA5E9',
  },
  {
    key: 'Hoàn tất',
    value: '#10B981',
  },
];

const ListDebt = () => {
  const [listDebt, setListDebt] = useState<IDebt[]>([]);
  console.log('listdebt', listDebt);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const TabStatus = [
    { name: StatusEnum.PENDING, count: 15 },
    { name: StatusEnum.COMPLETED, count: 9 },
  ];
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    page: 1,
  });
  const [isShowModalDebtDetail, setIsShowModalDebtDetail] = useState(false);
  const [isShowModalAddDebt, setIsShowModalAddDebt] = useState(false);
  const [isShowModalPayDebt, setIsShowModalPayDebt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [reload, setReload] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchPhrase, 500);
  const [status, setStatus] = useState<string>('Tất cả');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [curentDebt, setCurentDebt] = useState<IDebt>();
  const [tabStatus, setTabStatus] = useState([
    { name: 'Tất cả', count: 0 },
    { name: 'Chờ duyệt', count: 0 },
    { name: 'Đã duyệt', count: 0 },
    { name: 'Hoàn tất', count: 0 },
  ]);

  const [dataExport, setDataExport] = useState<Array<IDebt>>([]);
  const [debtSelected, setDebtSelected] = useState<IDebt>();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const colData: IDebt[] = Array(50)
    .fill({
      created_at: '2023-03-07T07:05:53.000000Z',
      code: 'XM102',
      detail_customer: {
        name: 'Tran Toan',
        phone_number: '02019299',
      },
      debt_total: 100000,
      note: 'none',
      status: 'Chờ duyệt',
      updated_at: '2023-03-07T07:05:53.000000Z',
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<IDebt> = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'dataIndex',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#2E2D3D] font-medium"
          onClick={(e) => {
            record.code && onCoppy(e, record.code);
          }}
        >
          {record?.code}
        </span>
      ),
    },
    {
      title: 'Tên khách hàng',
      width: 170,
      dataIndex: 'name',
      key: 'export_name',
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col justify-center cursor-pointer">
          <span className="text-medium font-medium text-[#384ADC]">
            {record?.detail_customer?.name || '--'}
          </span>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      width: 160,
      dataIndex: 'phone',
      key: 'note',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#4B4B59] cursor-pointer"
          onClick={(e) => {
            record?.detail_customer?.phone_number &&
              onCoppy(e, record?.detail_customer?.phone_number);
          }}
        >
          {record?.detail_customer?.phone_number || '--'}
        </span>
      ),
    },
    {
      title: 'Công nợ',
      width: 140,
      dataIndex: 'debt',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <span className="cursor-pointer text-medium font-medium text-[#F97316]">
          {new Intl.NumberFormat().format(record?.debt_total || 0)} đ
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      width: 300,
      dataIndex: 'note',
      key: 'weight',
      align: 'left',
      render: (_, record) => (
        <span className="cursor-pointer text-medium font-medium text-[#1D1C2D]">
          {record?.note}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      width: 185,
      dataIndex: 'status',
      key: 'totalMoney',
      align: 'center',
      render: (_, record) => (
        <span
          className={`cursor-pointer font-semibold text-[${
            colorStatus.find((status) => status.key === record.status)?.value
          }]`}
        >
          {record?.status}
        </span>
      ),
    },
    {
      title: 'Thời gian cập nhật ',
      width: 185,
      dataIndex: 'update_time',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <span className={`cursor-pointer text-medium font-semibold`}>
          {format(parseISO(record.updated_at), "dd/MM/yyyy - HH:mm")}
        </span>
      ),
    },
  ];

  const handleSearchByDate = (value: any) => {
    if (value) {
      const from = value[0];
      const to = value[1];
      console.log('from', from);
      console.log('to', to);
      setDateFrom(from.format('YYYY-MM-DD'));
      setDateTo(to.format('YYYY-MM-DD'));
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  useEffect(() => {
    getAllDebt();
  }, [
    pagination.page,
    pagination.pageSize,
    debouncedValue,
    reload,
    status,
    dateTo,
  ]);

  const getAllDebt = async () => {
    setLoading(true);
    const {
      data,
      totalDebt,
      totalItems,
      countAll,
      countPending,
      countApproved,
      countCompleted,
    } = await DebtApi.list({
      limit: pagination.pageSize,
      page: pagination.page,
      name: searchPhrase,
      status,
      date_to: dateTo,
      date_from: dateFrom,
    });
    setListDebt(data);
    setPagination({
      ...pagination,
      total: totalItems,
    });
    setTabStatus([
      { name: 'Tất cả', count: countAll },
      { name: 'Chờ duyệt', count: countPending },
      { name: 'Đã duyệt', count: countApproved },
      { name: 'Hoàn tất', count: countCompleted },
    ]);
    setTotalDebt(totalDebt);
    setLoading(false);
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Code', key: 'code' },
    { label: 'Tên khách hàng', key: 'customer_name' },
    { label: 'Số điện thoại', key: 'phone_number' },
    { label: 'Công nợ', key: 'debt_total' },
    { label: 'Ghi chú', key: 'note' },
    { label: 'Trạng thái', key: 'status' },
    { label: 'Thời gian cập nhật', key: 'updated_at' },
  ];

  useEffect(() => {
    let arr: Array<any> = [];

    if (rowSelection?.selectedRowKeys) {
      listDebt?.map((item) => {
        if (rowSelection.selectedRowKeys.indexOf(item?.id) != -1) {
          arr.push({
            id: item.id,
            code: item.code,
            customer_name: item?.detail_customer?.name,
            phone_number: item?.detail_customer?.phone_number,
            debt_total: item?.debt_total,
            note: item?.note,
            status: item?.status,
            updated_at: item?.updated_at,
          });
        }
      });
    }
    setDataExport(arr);
  }, [rowSelection?.selectedRowKeys]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý công nợ" />
        <div className="flex gap-[8px] flex-wrap">
          <CSVLink
            headers={headers}
            data={dataExport}
            filename={'debt.csv'}
            onClick={() => {
              message.success('Download thành công');
            }}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="export" size={24} />}
            >
              Xuất file
            </Button>
          </CSVLink>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add-1" size={24} color="white" />}
            onClick={() => setIsShowModalAddDebt(true)}
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
          placeholder="Tìm ID / Tên KH / Số điện thoại"
          value={searchPhrase}
          onChange={(e) => {
            setSearchPhrase(e.target.value);
            setPagination({
              ...pagination,
              page: 1,
            });
          }}
        />
        <InputRangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          width={306}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(value) => {
            setPagination({
              ...pagination,
              page: 1,
            });
            handleSearchByDate(value);
          }}
        />
      </div>
      <Tabs
        defaultTab="Tất cả"
        showTabAll={false}
        tabs={tabStatus}
        onChange={(val) => setStatus(val)}
      />
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số công nợ đang chọn:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Table
        rowKey={(record) => record.id}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={listDebt}
        dataSource={colData}
        pagination={false}
        scroll={{ x: 50 }}
        onRow={(record) => {
          return {
            onClick: () => {
              setIsShowModalDebtDetail(true);
              setDebtSelected(record);
            },
          };
        }}
      />
      <div className={classNames('flex items-center justify-content-between')}>
        <div className={styles.row} style={{ borderRight: '0px !important' }}>
          Tổng tiền công nợ:
          <span className="font-medium text-[#F97316]">
            {' '}
            {new Intl.NumberFormat().format(totalDebt)} đ
          </span>
        </div>
        <PaginationCustom
          total={pagination.total}
          defaultPageSize={pagination.pageSize}
          current={pagination.page}
          onChangePage={(page) =>
            setPagination({
              ...pagination,
              page,
            })
          }
          onChangePageSize={(pageSize) =>
            setPagination({
              ...pagination,
              pageSize,
            })
          }
        />
      </div>
      <ModalDebtDetail
        title="Chi tiết công nợ"
        isVisible={isShowModalDebtDetail}
        onClose={() => setIsShowModalDebtDetail(false)}
        onOpen={() => {
          setIsShowModalPayDebt(true);
          setIsShowModalDebtDetail(false);
        }}
        debtSelected={debtSelected}
        onReload={(uuid) => setReload(uuid)}
        onShowModalAdd={(debt) => {
          setIsShowModalAddDebt(true);
          setCurentDebt(debt);
        }}
      />
      <ModalPayDebt
        debtId={debtSelected?.id}
        title="Thanh toán công nợ"
        isVisible={isShowModalPayDebt}
        onClose={() => setIsShowModalPayDebt(false)}
        onOpen={() => setIsShowModalPayDebt(false)}
        onReload={(uuid) => setReload(uuid)}
      />
      <ModalAddDebt
        title="Thêm công nợ mới"
        isVisible={isShowModalAddDebt}
        onClose={(isFormChange) => {
          setIsShowModalAddDebt(false);
          if (isFormChange) {
            getAllDebt();
          }
        }}
        onOpen={() => setIsShowModalAddDebt(false)}
        onReload={(uuid) => setReload(uuid)}
        curentDebt={curentDebt}
      />
    </div>
  );
};

export default ListDebt;
