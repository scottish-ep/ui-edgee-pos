/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { notification, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';

import {
  wareHouseList,
  statusTransferWareHouseOptions,
  warehouses,
  warehouseStatusOption,
  warehouseBalanceStatusOption,
} from '../../../const/constant';
import {
  StatusColorEnum,
  StatusEnum,
  StatusList,
  warehouseStatusList,
} from '../../../types';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import Tabs from '../../../components/Tabs';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import DropdownStatus from '../../../components/DropdownStatus';
import { IWareHouseManagement, IWareHouses } from '../warehouse.type';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';
import { isArray, onCoppy } from '../../../utils/utils';
import TableEmpty from '../../../components/TableEmpty';
import PaginationCustom from '../../../components/PaginationCustom';
import { useDebounce } from 'usehooks-ts';
import { CustomerType } from '../../customers/CustomerType';
import UserApi from '../../../services/users';
import { IUser } from '../../../types/users';
import styles from '../../../styles/DetailCustomer.module.css';
import WarehouseApi from '../../../services/warehouses';
import Item from 'antd/lib/list/Item';
import { get } from 'lodash';
import { CommandStatus, CommandStatusColor } from '../../../enums/enums';
import WarehouseTransferCommandApi from '../../../services/warehouse-transfer-command';
import WarehouseBalanceCommandApi from '../../../services/warehouse-balance-command';

const TransferWareHouseList = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [balanceWareHouses, setBalanceWareHouses] = useState<IWareHouses[]>([
    ...wareHouseList,
  ]);
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [tabStatus, setTabStatus] = useState<
    { name: StatusEnum | string; count: number }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<any>({});
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);

  const [isShowModalRemoveExport, setIsShowModalRemoveExport] = useState(false);

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getListStaff();
    getListWarehouse();
    getTotalWarehouseBanlanceCommandByStatus();
  }, []);

  useEffect(() => {
    getListWarehouseBalanceCommand();
  }, [filter, debouncedSearchTerm, pagination.page, pagination.pageSize]);

  const getListWarehouse = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setWareHouseManagement(listWarehouse);
  };

  const getListStaff = async () => {
    const result = await UserApi.getListStaff();
    const newListStaff = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.id,
          id: item.id,
        }))
      : [];
    setListStaff(newListStaff);
  };

  const getListWarehouseBalanceCommand = async () => {
    setLoading(true);
    const result =
      await WarehouseBalanceCommandApi.getListWarehouseBalanceCommand({
        ...filter,
        code: debouncedSearchTerm,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
    setBalanceWareHouses(result.banlanceCommands);
    setPagination({
      ...pagination,
      total: result.totalCommands,
    });
    setLoading(false);
  };

  const getTotalWarehouseBanlanceCommandByStatus = async () => {
    const result =
      await WarehouseBalanceCommandApi.getTotalNumberBalanceCommands();
    let tabs = [
      {
        name: 'Mới',
        count: result.CREATED,
      },
      {
        name: 'Hoàn tất',
        count: result.COMPLETED,
      },
      {
        name: 'Huỷ',
        count: result.CANCEL,
      },
    ];
    setTabStatus(tabs);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const warehouseList: IWareHouses[] = Array(50).fill({
    code: 'CB0001',
    note: 'Kiểm kho ngày 29/09',
    cmdStatus: "CREATED",
    id: "1"
  });

  const columns: ColumnsType<IWareHouses> = [
    {
      title: 'Mã cân bằng kho',
      width: 150,
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => onCoppy(e, record.code)}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: 'Kho kiểm',
      width: 200,
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          Tổng kho Linh Dương
          {/* {get(record, "warehouse.name")} */}
        </span>
      ),
    },
    {
      title: 'Số sản phẩm',
      width: 158,
      dataIndex: 'number_items',
      key: 'number_items',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          3
          {/* {isArray(get(record, "warehouse_items"))
            ? get(record, "warehouse_items").length
            : "--"} */}
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      width: 387,
      dataIndex: 'note',
      key: 'note',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">{record.note}</span>
      ),
    },
    {
      title: 'NV xử lý / Thời gian',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {/* {get(record, "created_user.name")} */}
            Nguyễn Văn A
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            09:23 - 21/09/2022
            {/* {get(record, "created_at")
              ? format(
                  new Date(get(record, "created_at")),
                  "HH:mm - dd/MM/yyyy"
                )
              : ""} */}
          </span>
        </div>
      ),
    },
    {
      title: 'Cập nhật cuối',
      width: 185,
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          08:36 19/09/2022
          {/* <span>{format(new Date(record.updated_at), "HH:mm")}</span>
          <span>{format(new Date(record.updated_at), "dd/MM/yyyy")}</span> */}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      width: 185,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <span
          className={`text-medium font-semibold text-[${
            CommandStatusColor[record.cmdStatus]
          }]`}
        >
          {CommandStatus[record.cmdStatus] || ''}
        </span>
      ),
    },
  ];

  const handleChangeTab = (e: any) => {
    const value =
      warehouseStatusList.find((item: any) => item.name == e)?.value || '';
    setFilter({
      ...filter,
      status: value,
    });
  };

  const handleDeleteBalanceCommand = async () => {
    const data = await WarehouseBalanceCommandApi.deleteManyBalanceCommands(
      selectedRowKeys
    );
    if (data.data.success) {
      getListWarehouseBalanceCommand();
    } else {
      notification.error({
        message: data.data.message,
      });
    }
  };

  const handleUpdateStatus = async (e: any) => {
    console.log('e', e);
    console.log('selectedRowKeys', selectedRowKeys);
    selectedRowKeys.map((id) => {
      const commands = balanceWareHouses.find((item: any) => item.id === id);
      if (commands?.status === 'CANCEL') {
        notification.error({
          message: 'Không thể cập nhập phiếu cân bằng đã huỷ',
        });
        return;
      }
      if (commands?.status === 'COMPLETED') {
        notification.error({
          message: 'Không thể cập nhập phiếu cân bằng đã hoàn thành',
        });
        return;
      }
    });
    const data = await WarehouseBalanceCommandApi.updateManyBalanceCommand({
      arrayId: selectedRowKeys,
      status: e,
    });
    if (data) {
      notification.success({
        message: 'Cập nhật thành công!',
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Cân bằng kho" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              allowClear
              clearIcon={<Icon icon="cancel" size={16} />}
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouseManagement}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  warehouse_id: e,
                })
              }
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="printer" size={24} />}
          >
            In phiếu
          </Button>
          <DropdownStatus
            text="Cập nhật trạng thái"
            options={warehouseBalanceStatusOption}
            icon="refresh"
            onChange={(e) => handleUpdateStatus(e)}
            onRemoveSelected={() => setIsShowModalRemoveExport(true)}
          />
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = '/warehouses/balance-warehouse/create')
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          onChange={(e: any) => {
            console.log('code', e);
            setSearchKey(e.target.value);
          }}
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã chuyển kho"
        />
        <Select
          allowClear
          containerClassName={styles.wrapper_select}
          width={306}
          prefix={<Icon icon="personalcard" size={24} />}
          options={listStaff}
          onChange={(e) =>
            setFilter({
              ...filter,
              created_user_id: e,
            })
          }
          clearIcon={<Icon icon="cancel" size={16} />}
          placeholder="Nhập tên nhân viên"
        />
        <InputRangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          width={306}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(e: any) =>
            setFilter({
              ...filter,
              from: e[0].format('YYYY-MM-DD'),
              to: e[1].format('YYYY-MM-DD'),
            })
          }
        />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số phiếu cân bằng kho đang chọn:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs
        onClick={(e) => handleChangeTab(e)}
        countTotal={pagination.total}
        tabs={tabStatus}
      />
      <Table
        rowKey={(record) => record.id}
        locale={
          !loading
            ? {
                emptyText: <TableEmpty />,
              }
            : { emptyText: <></> }
        }
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = `/warehouses/balance-warehouse/${record.id}`;
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={warehouseList}
        pagination={{
          total: pagination.total,
          defaultPageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onChange={(e) => {
          setPagination({
            ...pagination,
            page: e.current || 1,
            pageSize: e.pageSize || 10,
          });
        }}
        scroll={{ x: 50 }}
      />
      <ModalRemove
        isVisible={isShowModalRemoveExport}
        onClose={() => setIsShowModalRemoveExport(false)}
        onOpen={() => {
          setIsShowModalRemoveExport(false);
          handleDeleteBalanceCommand();
        }}
        titleBody="Xóa phiếu chuyển kho?"
        content="Thông tin của phiếu chuyển kho sẽ không còn nữa."
      />
    </div>
  );
};

export default TransferWareHouseList;
