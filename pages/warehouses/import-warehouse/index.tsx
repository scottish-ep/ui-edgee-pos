/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message, notification, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';

import {
  wareHouseList,
  statusImportWareHouseOptions,
  warehouses,
  provinceList,
  districtList,
  wardList,
} from '../../../const/constant';
import { StatusColorEnum, StatusEnum, StatusList } from '../../../types';
import Tabs from '../../../components/Tabs';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import DropdownStatus from '../../../components/DropdownStatus';
import {
  IWareHouseManagement,
  IWareHouseManagementDetail,
  IWareHouses,
} from '../warehouse.type';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';
import { isArray, onCoppy } from '../../../utils/utils';
import TableEmpty from '../../../components/TableEmpty';
import PaginationCustom from '../../../components/PaginationCustom';
import { get } from 'lodash';
import { useDebounce } from 'usehooks-ts';
import { IUser } from '../../../types/users';
import WarehouseApi from '../../../services/warehouses';
import { CSVLink } from 'react-csv';
import WarehouseImportCommandApi from '../../../services/warehouse-import';
import {
  CommandStatusEnum,
  CommandWarehouseStatusEnum,
} from '../../../enums/enums';

declare global {
  interface Window {
    loggedInUser: string;
  }
}

const ImportWareHouseList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
    }[]
  >([]);
  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [importWareHouses, setImportWareHouses] = useState<any[]>([]);
  const [currenStatus, setCurrenStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [isShowModalRemoveExport, setIsShowModalRemoveExport] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [filter, setFilter] = useState<any>({});
  const [dataExport, setDataExport] = useState<Array<IWareHouses>>([]);
  const [totalCommand, setTotalCommand] = useState<any>({
    CREATED: 0,
    COMPLETED: 0,
    CANCELED: 0,
  });

  let selectedUser = '';
  useEffect(() => {
    selectedUser = window.loggedInUser;
  });

  const TabStatus = [
    {
      name: StatusEnum.CREATED,
      count: totalCommand.CREATED,
    },
    {
      name: StatusEnum.COMPLETED,
      count: totalCommand.COMPLETED,
    },
    {
      name: StatusEnum.CANCELED,
      count: totalCommand.CANCELED,
    },
  ];

  const content = () => {
    let data: any = [''];
    switch (currenStatus) {
      case StatusEnum.CREATED:
        data = importWareHouses ? importWareHouses[StatusEnum.CREATED] : [];
        break;
      case StatusEnum.COMPLETED:
        data = importWareHouses ? importWareHouses[StatusEnum.COMPLETED] : [];
        break;
      case StatusEnum.CANCELED:
        data = importWareHouses ? importWareHouses[StatusEnum.CANCELED] : [];
        break;
      default:
        data = importWareHouses ? importWareHouses['ALL'] : [];
        break;
    }
    return data;
  };

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getListWarehouse();
    getListStaff();
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter,
    debouncedSearchTerm,
    pagination.page,
    pagination.current,
    pagination.pageSize,
    currenStatus,
  ]);

  const getData = async () => {
    setLoading(true);
    const { data } = await WarehouseImportCommandApi.getCommand({
      ...filter,
      ...pagination,
      code: debouncedSearchTerm,
      status: currenStatus,
    });
    setImportWareHouses(data.data);
    setPagination({
      ...pagination,
      total: data.totalCommand,
    });
    setTotalCommand({
      CREATED: data.commandSuccessed,
      COMPLETED: data.commandCreated,
      CANCELED: data.commandCanceled,
    });
    setLoading(false);
  };

  const getListWarehouse = async () => {
    const data = await WarehouseApi.getWarehouse();
    const listWarehouseManagement =
      isArray(data) &&
      data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    setWareHouseManagement(listWarehouseManagement);
  };

  const getListStaff = () => {
    const url = '/api/v2/users/list';
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        const newListStaff = isArray(result)
          ? result.map((item: IUser) => ({
              label: item.name,
              value: item.name,
              id: item.id,
            }))
          : [];
        setListStaff(newListStaff);
      })
      .catch((error) => console.log(error));
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const data: IWareHouses[] = Array(50)
    .fill({
      code: 'KH0001',
      creadted_user: {
        name: 'Nguy???n V??n A',
      },
      created_at: Date.now(),
      warehouse: {
        name: 'Kho t???ng Linh D????ng',
      },
      note: 'Nh???p l?? h??ng m???i',
      items_sum_quantity: 100,
      items_sum_weight: 13,
      updated_at: Date.now(),
      status: 'COMPLETED',
    })
    .map((item, index) => ({ ...item, id: `KH${index + 1}` }));

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
      title: 'M?? nh???p h??ng',
      width: 200,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => {
            record?.code && onCoppy(e, record?.code);
          }}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: 'NV x??? l?? / Th???i gian',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="text-[#384ADC] font-semibold text-medium">
            {get(record, 'created_user.name')}
          </span>
          <span className="text-[#5F5E6B] font-medium text-medium">
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
      title: 'Kho nh???p',
      width: 200,
      dataIndex: 'export_name',
      key: 'export_name',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#2E2D3D]">
          {get(record, 'warehouse.name')}
        </span>
      ),
    },
    {
      title: 'Ghi ch??',
      width: 200,
      dataIndex: 'note',
      key: 'note',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">{record.note}</span>
      ),
    },
    // {
    //   title: "Ngu???n h??ng",
    //   width: 200,
    //   dataIndex: "source",
    //   key: "source",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#4B4B59]"></span>
    //   ),
    // },
    {
      title: 'S??? l?????ng',
      width: 100,
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, 'items_sum_quantity')
            ? get(record, 'items_sum_quantity')
            : '--'}
        </span>
      ),
    },
    {
      title: 'Tr???ng l?????ng',
      width: 100,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {get(record, 'items_sum_weight')
            ? get(record, 'items_sum_weight') + ' kg'
            : '--'}
        </span>
      ),
    },
    {
      title: 'T???ng ti???n s???n ph???m',
      width: 260,
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      align: 'center',
      render: (_, record: any) => {
        let quantity = parseFloat(record.items_sum_quantity || 0);
        let weight = parseFloat(record.items_sum_weight || 0);
        return (
          <span className="text-medium text-[#384ADC] font-medium">
            {`${quantity * weight} ??`}
          </span>
        );
      },
    },
    // {
    //   title: "Ph?? v???n chuy???n",
    //   width: 260,
    //   dataIndex: "transport_fee",
    //   key: "transport_fee",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#1D1C2D] font-medium">
    //       {/* {record.transport_fee.toLocaleString()} ?? */}
    //     </span>
    //   ),
    // },
    {
      title: 'C???p nh???t cu???i',
      width: 185,
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          <span>{format(new Date(record.updated_at), 'HH:mm')}</span>
          <span>{format(new Date(record.updated_at), 'dd/MM/yyyy')}</span>
        </div>
      ),
    },
    {
      title: 'Tr???ng th??i',
      width: 185,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <span
          className={`text-medium font-semibold text-[${
            StatusColorEnum[record.status]
          }]`}
        >
          {StatusList.find((status) => status.value === record.status)?.name}
        </span>
      ),
    },
  ];

  const handleChangeStatus = async (status: any) => {
    setLoading(true);
    const body = {
      arrayId: selectedRowKeys,
      status: status,
      user_id: selectedUser,
    };
    let hasErrors = false;
    isArray(selectedRowKeys) &&
      selectedRowKeys.map((id) => {
        let command = importWareHouses.find((v) => v.id === id);
        if (command && command.status == CommandWarehouseStatusEnum.CANCELED) {
          hasErrors = true;
        }
      });
    if (hasErrors) {
      notification.error({
        message:
          'Kh??ng th??? c???p nh???t tr???ng th??i l???nh nh???p kho c?? tr???ng th??i ???? hu???',
      });
    }

    const data = await WarehouseImportCommandApi.updateManyCommand(body);
    console.log('data', data);
    if (data.success) {
      notification.success({
        message: 'C???p nh???t tr???ng th??i th??nh c??ng!',
      });
      getData();
      setSelectedRowKeys([]);
    } else {
      notification.error({
        message: 'C???p nh???t tr???ng th??i kh??ng th??nh c??ng!',
      });
      console.log('error');
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    const url = `/api/v2/warehouse-imports/delete-many`;
    const body = {
      arrayId: selectedRowKeys,
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log('data return', data);
        if (data.success) {
          getData();
          setSelectedRowKeys([]);
          notification.success({
            message: 'Xo?? th??nh c??ng!',
          });
        } else {
          notification.error({
            message: 'Xo?? kh??ng th??nh c??ng!',
          });
          console.log('error');
        }
      });
  };

  const handleChangeDates = (dates: any) => {
    if (dates) {
      setFilter({
        ...filter,
        from: dates[0].format('YYYY-MM-DD'),
        to: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setFilter({
        ...filter,
        from: null,
        to: null,
      });
    }
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'M?? nh???p h??ng', key: 'code' },
    { label: 'NV x??? l??', key: 'created_user_name' },
    { label: 'Kho nh???p', key: 'import_warehouse_name' },
    { label: 'Ghi ch??', key: 'note' },
    { label: 'S??? l?????ng', key: 'quantity' },
    { label: 'Tr???ng l?????ng', key: 'weight' },
    { label: 'T???ng ti???n s???n ph???m', key: 'total_products' },
    { label: 'Tr???ng th??i', key: 'status' },
  ];

  useEffect(() => {
    let arr: Array<any> = [];

    if (rowSelection?.selectedRowKeys) {
      let data = content();
      data?.map((item: any) => {
        if (rowSelection.selectedRowKeys.indexOf(item?.id) != -1) {
          arr.push({
            id: item.id,
            code: item.code,
            created_user_name: item?.created_user?.name,
            import_warehouse_name: item?.warehouse?.name,
            note: item?.note,
            quantity: item?.quantity,
            weight: item?.weight + ' kg',
            total_products: item?.total_import_cost,
            status: item?.status,
          });
        }
      });
    }
    setDataExport(arr);
  }, [rowSelection?.selectedRowKeys]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Nh???p kho" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Ch???n kho</div>
            <Select
              placeholder="Ch???n kho"
              style={{ width: 248 }}
              options={warehouseManagement}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  warehouseId: e,
                })
              }
            />
          </div>
          {/* <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="printer" size={24} />}
          >
            In phi???u
          </Button> */}
          <DropdownStatus
            text="C???p nh???t tr???ng th??i"
            options={statusImportWareHouseOptions.filter(
              (item) => item.value !== StatusEnum.CREATED
            )}
            icon="refresh"
            onRemoveSelected={() => setIsShowModalRemoveExport(true)}
            onChange={(e) => handleChangeStatus(e)}
          />
          <CSVLink
            headers={headers}
            data={dataExport}
            filename={'nhap-kho.csv'}
            onClick={() => {
              message.success('Download th??nh c??ng');
            }}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="export" size={24} />}
            >
              Xu???t file
            </Button>
          </CSVLink>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = '/warehouse/import-commands/create')
            }
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
          width={458}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          onChange={(e: any) => {
            console.log('code', e);
            setSearchKey(e.target.value);
          }}
          placeholder="Nh???p m?? nh???p kho"
        />
        <Select
          containerClassName="max-w-fit	"
          allowClear
          placeholder="Nh???p t??n nh??n vi??n"
          prefix={<Icon icon="personalcard" size={24} />}
          clearIcon={<Icon icon="cancel" size={16} />}
          width={306}
          options={listStaff}
          onChange={(e, option: any) => {
            setFilter({
              ...filter,
              userId: option ? option.id : null,
            });
          }}
          showSearch
        />
        <InputRangePicker
          placeholder={['Ng??y t???o b???t ?????u', 'Ng??y t???o k???t th??c']}
          width={356}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(dates: any) => handleChangeDates(dates)}
        />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          S??? phi???u nh???p kho ??ang ch???n:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs
        countTotal={pagination.total}
        tabs={TabStatus}
        onChange={(e) => {
          setCurrenStatus(e);
        }}
      />
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = `/warehouses/import-warehouse/${record.id}`;
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        // dataSource={[...importWareHouses]}
        dataSource={data}
        scroll={{ x: 50 }}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          defaultPageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onChange={(e) => {
          setPagination({
            ...pagination,
            current: e.current || 1,
            page: e.current || 1,
            pageSize: e.pageSize || 10,
          });
        }}
      />

      <ModalRemove
        isVisible={isShowModalRemoveExport}
        onClose={() => setIsShowModalRemoveExport(false)}
        onOpen={() => {
          setIsShowModalRemoveExport(false);
        }}
        titleBody="X??a phi???u nh???p kho?"
        content="Th??ng tin c???a phi???u nh???p kho s??? kh??ng c??n n???a."
        onOk={handleRemove}
      />
    </div>
  );
};

export default ImportWareHouseList;
