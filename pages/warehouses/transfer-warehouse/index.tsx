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
} from '../../../const/constant';
import {
  StatusColorEnum,
  StatusEnum,
  StatusList,
  warehouseStatusList,
  warehouseTransferStatusList,
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
  const [transferWareHouses, setTransferWareHouses] = useState<IWareHouses[]>([
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
  }, []);

  useEffect(() => {
    getListWarehouseTransferCommand();
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

  const getListWarehouseTransferCommand = async () => {
    setLoading(true);
    const result =
      await WarehouseTransferCommandApi.getListWarehouseTransferCommand({
        ...filter,
        code: debouncedSearchTerm,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
    setTransferWareHouses(result.transferCommands);
    setPagination({
      ...pagination,
      total: result.totalCommands,
    });
    let tabs = [
      {
        name: 'Mới',
        count: result.transferCommandCreated,
      },
      {
        name: 'Đang chuyển hàng',
        count: result.transferCommandProcessing,
      },
      {
        name: 'Hoàn tất',
        count: result.transferCommandSuccessed,
      },
      {
        name: 'Huỷ',
        count: result.transferCommandCanceled,
      },
    ];
    setTabStatus(tabs);
    setLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<IWareHouses> = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'db_id',
      key: 'db_id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#384ADC] font-semibold">
          {record.id}
        </span>
      ),
    },
    {
      title: 'Mã chuyển kho',
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
      title: 'NV xử lý / Thời gian',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-medium text-[#384ADC] font-semibold">
            {/* {get(record, "created_user.name")} */}
            Tran Huyen
          </span>
          <span className="text-medium text-[#5F5E6B] font-medium">
            {format(new Date(), 'HH:mm - dd/MM/yyyy')}
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
      title: 'Kho chuyển',
      width: 200,
      dataIndex: 'transfer_name',
      key: 'transfer_name',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {/* {get(record, 'from_warehouse.name')} */}
          Kho chinh
        </span>
      ),
    },
    {
      title: 'Kho nhập',
      width: 200,
      dataIndex: 'export_name',
      key: 'export_name',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {/* {get(record, 'to_warehouse.name')} */}
          Kho phu
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      width: 200,
      dataIndex: 'note',
      key: 'note',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">{record.name}</span>
      ),
    },
    {
      title: 'Tổng số SP chuyển kho',
      width: 150,
      dataIndex: 'total_transfer_product',
      key: 'total_transfer_product',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#384ADC]">
          {/* {get(record, 'warehouse_transfer_command_items_count') || 0} */}
          12
        </span>
      ),
    },
    {
      title: 'Tổng số lượng chuyển',
      width: 150,
      dataIndex: 'total_transfer',
      key: 'total_transfer',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, 'warehouse_transfer_command_items_sum_quantity') || 0}
        </span>
      ),
    },
    {
      title: 'Tổng trọng lượng chuyển',
      width: 150,
      dataIndex: 'total_transfer_weight',
      key: 'total_transfer_weight',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, 'warehouse_transfer_command_items_sum_weight') || 0} kg
        </span>
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
          <span>{format(new Date(record.updated_at), 'HH:mm')}</span>
          <span>{format(new Date(record.updated_at), 'dd/MM/yyyy')}</span>
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
            CommandStatusColor[record.cmdEnumStatus]
          }]`}
        >
          {CommandStatus[record.cmdEnumStatus] || ''}
        </span>
      ),
    },
  ];

  const handleChangeTab = (e: any) => {
    const value =
      warehouseTransferStatusList.find((item) => item.name == e)?.value || '';
    setPagination({
      ...pagination,
      page: 1,
    });
    setFilter({
      ...filter,
      status: value,
    });
  };

  const handleDeleteTransferCommand = async () => {
    const data = await WarehouseTransferCommandApi.deleteManyTransferCommands(
      selectedRowKeys
    );
    if (data.data.success) {
      getListWarehouseTransferCommand();
    } else {
      window.alert(data.data.message);
    }
  };

  const handleUpdateStatus = async (e: any) => {
    setLoading(true);
    selectedRowKeys.map((id) => {});
    for (let id of selectedRowKeys) {
      const commands = transferWareHouses.find((item) => item.id === id);
      if (commands?.status === 'CANCEL') {
        notification.error({
          message: 'Không thể cập nhập phiếu chuyển kho đã huỷ',
        });
        setLoading(false);
        return;
      }
      if (commands?.status === 'COMPLETED') {
        notification.error({
          message: 'Không thể cập nhập phiếu chuyển kho đã hoàn thành',
        });
        setLoading(false);
        return;
      }
    }
    const data = await WarehouseTransferCommandApi.updateManyTransferCommand({
      arrayId: selectedRowKeys,
      status: e,
    });
    if (data) {
      await getListWarehouseTransferCommand();
      notification.success({
        message: 'Cập nhật thành công!',
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Chuyển kho" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              allowClear
              clearIcon={<Icon icon="cancel" size={16} />}
              placeholder="Chọn nguồn"
              style={{ width: 248 }}
              options={warehouseManagement}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  from_warehouse_id: e,
                })
              }
            />
          </div>
          <DropdownStatus
            text="Cập nhật trạng thái"
            options={warehouseStatusOption}
            icon="refresh"
            onChange={(e) => handleUpdateStatus(e)}
            onRemoveSelected={() => setIsShowModalRemoveExport(true)}
          />
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = '/warehouses/transfer-warehouse/create')
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
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập mã chuyển kho"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
            // setPage(1);
          }}
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
          onChange={(e: any) => {
            setPagination({
              ...pagination,
              page: 1,
            });
            if (e) {
              setFilter({
                ...filter,
                from: e[0].format('YYYY-MM-DD'),
                to: e[1].format('YYYY-MM-DD'),
              });
            } else {
              setFilter({
                ...filter,
                from: e,
                to: e,
              });
            }
          }}
        />
      </div>
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
              window.location.href = `/warehouses/transfer-warehouse/${record.id}`;
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={[...transferWareHouses]}
        dataSource={wareHouseList}
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
          handleDeleteTransferCommand();
        }}
        titleBody="Xóa phiếu chuyển kho?"
        content="Thông tin của phiếu chuyển kho sẽ không còn nữa."
      />
    </div>
  );
};

export default TransferWareHouseList;
