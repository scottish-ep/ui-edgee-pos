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
        name: 'Nguyễn Văn A',
      },
      created_at: Date.now(),
      warehouse: {
        name: 'Kho tổng Linh Dương',
      },
      note: 'Nhập lô hàng mới',
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
      title: 'Mã nhập hàng',
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
      title: 'NV xử lý / Thời gian',
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
      title: 'Kho nhập',
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
      title: 'Ghi chú',
      width: 200,
      dataIndex: 'note',
      key: 'note',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59]">{record.note}</span>
      ),
    },
    // {
    //   title: "Nguồn hàng",
    //   width: 200,
    //   dataIndex: "source",
    //   key: "source",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#4B4B59]"></span>
    //   ),
    // },
    {
      title: 'Số lượng',
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
      title: 'Trọng lượng',
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
      title: 'Tổng tiền sản phẩm',
      width: 260,
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      align: 'center',
      render: (_, record: any) => {
        let quantity = parseFloat(record.items_sum_quantity || 0);
        let weight = parseFloat(record.items_sum_weight || 0);
        return (
          <span className="text-medium text-[#384ADC] font-medium">
            {`${quantity * weight} đ`}
          </span>
        );
      },
    },
    // {
    //   title: "Phí vận chuyển",
    //   width: 260,
    //   dataIndex: "transport_fee",
    //   key: "transport_fee",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#1D1C2D] font-medium">
    //       {/* {record.transport_fee.toLocaleString()} đ */}
    //     </span>
    //   ),
    // },
    {
      title: 'Cập nhật cuối',
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
      title: 'Trạng thái',
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
          'Không thể cập nhật trạng thái lệnh nhập kho có trạng thái đã huỷ',
      });
    }

    const data = await WarehouseImportCommandApi.updateManyCommand(body);
    console.log('data', data);
    if (data.success) {
      notification.success({
        message: 'Cập nhật trạng thái thành công!',
      });
      getData();
      setSelectedRowKeys([]);
    } else {
      notification.error({
        message: 'Cập nhật trạng thái không thành công!',
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
            message: 'Xoá thành công!',
          });
        } else {
          notification.error({
            message: 'Xoá không thành công!',
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
    { label: 'Mã nhập hàng', key: 'code' },
    { label: 'NV xử lý', key: 'created_user_name' },
    { label: 'Kho nhập', key: 'import_warehouse_name' },
    { label: 'Ghi chú', key: 'note' },
    { label: 'Số lượng', key: 'quantity' },
    { label: 'Trọng lượng', key: 'weight' },
    { label: 'Tổng tiền sản phẩm', key: 'total_products' },
    { label: 'Trạng thái', key: 'status' },
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
        <TitlePage title="Nhập kho" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
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
            In phiếu
          </Button> */}
          <DropdownStatus
            text="Cập nhật trạng thái"
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
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() =>
              (window.location.href = '/warehouse/import-commands/create')
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
          width={458}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          onChange={(e: any) => {
            console.log('code', e);
            setSearchKey(e.target.value);
          }}
          placeholder="Nhập mã nhập kho"
        />
        <Select
          containerClassName="max-w-fit	"
          allowClear
          placeholder="Nhập tên nhân viên"
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
          placeholder={['Ngày tạo bắt đầu', 'Ngày tạo kết thúc']}
          width={356}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(dates: any) => handleChangeDates(dates)}
        />
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số phiếu nhập kho đang chọn:{' '}
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
        titleBody="Xóa phiếu nhập kho?"
        content="Thông tin của phiếu nhập kho sẽ không còn nữa."
        onOk={handleRemove}
      />
    </div>
  );
};

export default ImportWareHouseList;
