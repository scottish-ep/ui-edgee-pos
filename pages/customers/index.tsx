/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { Table, Switch, notification, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import get from 'lodash/get';
import TitlePage from '../../components/TitlePage/Titlepage';
import Image from 'next/image';
import { isArray, onCoppy } from '../../utils/utils';
import { LevelCustomer } from '../../enums/enums';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/Input';
import InputRangePicker from '../../components/DateRangePicker/DateRangePicker';
import ModalConfirm from '../../components/Modal/ModalConfirm/ModalConfirm';
import ModalNotice from '../../components/Modal/ModalNotice/ModalConfirm';
import ModalAddCustomer from './ModalAddCustomer/ModalAddCustomer';
import Checkbox from '../../components/CheckboxList/CheckboxList';
import DefaultAvatar from '../../assets/default-avatar.svg';
import CustomerApi from '../../services/customers';
import { useDebounce } from 'usehooks-ts';
import { format } from 'date-fns';
import { IUser } from '../../types/users';
import TableEmpty from '../../components/TableEmpty';
import PaginationCustom from '../../components/PaginationCustom';
import styles from '../../styles/DetailCustomer.module.css';
import UserApi from '../../services/users';
import { CustomerType } from './CustomerType';

const ListCustomer = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [listSource, setListSource] = useState<
    {
      label: string;
      value: string | number | any;
      id: number | any;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<any>({});
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [pagination, setPagination] = useState<{
    current: number;
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isShowModalNotice, setIsShowModalNotice] = useState(false);
  const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(false);
  const [isShowModalConfirmBlock, setIsShowModalConfirmBlock] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CustomerType>();
  const [targetRow, setTargetRow] = useState({ id: 0, checked: false });

  // useEffect(() => {
  //   const element = document.getElementById('loading__animation');
  //   if (element) {
  //     element.remove();
  //   }
  //   getListStaff();
  //   getListSource();
  // }, []);

  useEffect(() => {
    getListCustomer(1, pagination.pageSize);
  }, [filter, debouncedSearchTerm]);

  const getListCustomer = (page: any, pageSize: any) => {
    setLoading(true);
    const url =
      '/api/v2/customers/list?' +
      new URLSearchParams({
        ...filter,
        search: debouncedSearchTerm,
        page: page,
        pageSize: pageSize,
      });
    fetch(url)
      .then((res) => res.json())
      .then((res: any) => {
        const result = res.data.data;
        console.log('result', result);
        console.log('total', res.data.totalCustomers);
        setPagination({
          current: page,
          page: page,
          pageSize: pageSize,
          total: get(res, 'data.totalCustomers'),
        });
        setCustomers(result);
        setLoading(false);
        // reset selected row
        setTargetRow({
          id: 0,
          checked: false,
        });
      });
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

  const getListSource = async () => {
    const result = await UserApi.getListSource();
    const newListSource = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.id,
          id: item.id,
        }))
      : [];
    setListSource(
      [
        {
          label: 'Tất cả nguồn',
          value: '',
          id: '',
        },
      ].concat(newListSource)
    );
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const renderLevel = (level?: string) => {
    switch (level) {
      case LevelCustomer.NEW_CLIENT:
        return <div className="font-semibold text-[#0EA5E9]">KH mới</div>;
      case LevelCustomer.GOLD:
        return <div className="font-semibold text-[#EAB308]">Vàng</div>;
      case LevelCustomer.SILVER:
        return <div className="font-semibold text-[#5F5E6B[">Bạc</div>;
      case LevelCustomer.BRONZE:
        return <div className="font-semibold text-[#F97316]">Đồng</div>;
      default:
        return <div></div>;
    }
  };

  const renderTag = (record: CustomerType) => {
    if (record?.is_bad && record?.is_block === 1) {
      return (
        <>
          <Tag className="ml-0.5" color="red">
            Xấu
          </Tag>
        </>
      );
    } else if (record?.is_bad && record?.is_block === 0) {
      return (
        <Tag className="ml-0.5" color="red">
          Xấu
        </Tag>
      );
    } else if (!record?.is_bad && record?.is_block === 1) {
      return (
        <Tag className="ml-0.5" color="red">
          Chặn
        </Tag>
      );
    }
  };

  const renderBlock = (record: CustomerType) => {
    // record.is_block ? (record.is_block === 1 ? true : false) : false
    if (targetRow.id === record.id) {
      return targetRow.checked;
    }

    if (record?.is_block === 1) {
      return true;
    } else if (record?.is_bad) {
      return true;
    } else {
      return false;
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleBlock = () => {
    const record = selectedRecord;

    const url = `/api/v2/customers/update/${record?.id}`;
    const body = {
      is_block: record?.is_block == true ? 1 : 0,
    };

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log('data return', data);
        if (data.success) {
          notification.success({
            message: 'Cập nhật thông tin khách hàng thành công!',
          });
          setTargetRow({
            id: record?.id ? +record.id : 0,
            checked: record?.is_block ? true : false,
          });

          getListCustomer(pagination.page, pagination.pageSize);
        } else {
          notification.error({
            message: data.message,
          });
          console.log('error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setIsShowModalConfirmBlock(false);
  };

  const handleConfirmDelete = () => {
    setIsShowModalConfirm(false);
    console.log('delete');
    if (!selectedRowKeys.length) {
      notification.error({
        message: 'Có lỗi !!!',
        description: 'Chưa chọn khách hàng để xoá',
        placement: 'top',
      });
    }
    const url = `/api/v2/customers/delete-many`;
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
          getListCustomer(pagination.page, pagination.pageSize);
          setSelectedRowKeys([]);
          notification.success({
            message: 'Xóa thành công!',
          });
        } else {
          notification.error({
            message: data.message,
          });
          console.log('error');
        }
      });
    // setIsShowModalNotice(true);
  };

  const handleSearchByDate = (value: any) => {
    if (value) {
      const from = value[0];
      const to = value[1];
      setFilter({
        ...filter,
        from,
        to,
      });
    } else {
      setFilter({
        ...filter,
        from: '',
        to: '',
      });
    }
  };

  const handleExportExcel = () => {
    window.location.href = '/api/v2/customers/export/';
  };

  const [columnSelecteted, setColumnSelecteted] = useState([
    'is_block',
    'id',
    'name',
    'phone_number',
    'level',
    'order',
    'printed',
    'received',
    'orderReturn',
    'orderReturnAPart',
    'successCost',
    'lastBuy',
    'updated_at',
    '',
  ]);

  const data: CustomerType[] = Array(50)
    .fill({
      is_block: false,
      name: 'Tran Huyen',
      phone_number: '0854634162',
      email: 'a@gmail.com',
      updated_at: Date.now(),
      user: {
        name: 'Nguyen Van A',
        phone: '092922221',
        updated_at: Date.now(),
        id: 1,
      },
      customer_level: {
        name:LevelCustomer.NEW_CLIENT,
      },
      customerLvName: LevelCustomer.NEW_CLIENT,
      orderTotalCount: 100,
      count_print_order: 10,
      count_received_order: 10,
      count_return_order: 10,
      count_partial_return_order: 10,
      lastBuy: 19,
    })
    .map((item, index) => ({ ...item, id: `KH${index + 1}` }));

  const columns: ColumnsType<CustomerType> = [
    {
      title: 'Chặn',
      width: 75,
      dataIndex: 'is_block',
      key: 'is_block',
      fixed: 'left',
      render: (_, record) => {
        return (
          <Switch
            className="button-switch"
            checked={renderBlock(record)}
            onClick={(value, event) => {
              setTargetRow({
                id: +record.id,
                checked: !value,
              });
              setIsShowModalConfirmBlock(true);
            }}
            onChange={(value, e) => {
              e.preventDefault();
              e && e.stopPropagation();
              record.is_block = value;
              setSelectedRecord(record);
            }}
          />
        );
      },
    },
    {
      title: 'ID',
      width: 100,
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => <div>{record.id || get(record, 'user.id')}</div>,
    },
    {
      title: 'Tên khách hàng',
      width: 260,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="relative w-[36px] h-[36px] mr-[8px]">
            {/* {record?.avatar || get(record, "user.avatar") ? (
              <Image src={record?.avatar || get(record, "user.avatar")} alt=""/>
            ) : (
              <DefaultAvatar />
            )} */}
          </div>
          <div
            className="text-[#384ADC] font-medium text-medium"
            onClick={(e) => {
              record?.name
                ? onCoppy(e, record?.name)
                : record?.phone_number
                ? onCoppy(e, record?.phone_number)
                : record?.email
                ? onCoppy(e, record?.email)
                : get(record, 'user.name');
              // ? onCoppy(e, get(record, "user.name"))
              // : onCoppy(e, get(record, "user.phone"));
            }}
          >
            {record?.name
              ? record?.name
              : record?.phone_number
              ? record?.phone_number
              : record?.email
              ? record?.email
              : get(record, 'user.name')
              ? get(record, 'user.name')
              : get(record, 'user.phone')}
            {renderTag(record)}
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      width: 156,
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      render: (_, record) => (
        <div
        // onClick={(e) => {
        //   record.phone_number
        //     ? onCoppy(e, record.phone_number)
        //     : onCoppy(e, get(record, "user.phone"));
        // }}
        >
          {record.phone_number
            ? record.phone_number
            : get(record, 'user.phone')}
        </div>
      ),
    },
    {
      title: 'Cấp độ KH',
      width: 115,
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      render: (_, record) => (
        <div className="font-semibold">
          {renderLevel(get(record, 'customer_level.name'))}
          {/* {renderLevel(record.customerLvName)} */}
        </div>
      ),
    },
    {
      title: 'Tổng số lượng đơn',
      width: 126,
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      render: (_, record) => <div>{record.orderTotalCount}</div>,
    },
    {
      title: 'Đã in',
      width: 88,
      dataIndex: 'printed',
      key: 'printed',
      align: 'center',
      render: (_, record) => <div>{record.count_print_order}</div>,
    },
    {
      title: 'Đã nhận',
      width: 100,
      dataIndex: 'received',
      key: 'received',
      align: 'center',
      render: (_, record) => <div>{record.count_received_order}</div>,
    },
    {
      title: 'Đơn hoàn',
      width: 110,
      dataIndex: 'orderReturn',
      key: 'orderReturn',
      align: 'center',
      render: (_, record) => <div>{record.count_return_order}</div>,
    },
    {
      title: 'Hoàn 1 phần',
      width: 96,
      dataIndex: 'orderReturnAPart',
      key: 'orderReturnAPart',
      align: 'center',
      render: (_, record) => <div>{record.count_partial_return_order}</div>,
    },
    // {
    //   title: "Đã thanh toán",
    //   width: 160,
    //   dataIndex: "successCost",
    //   key: "successCost",
    //   align: "center",
    //   // render: (_, record) => <div>{record.successCost || "0 vnđ"}</div>,
    // },
    {
      title: 'Lần mua cuối',
      width: 140,
      dataIndex: 'lastBuy',
      key: 'lastBuy',
      align: 'center',
      render: (_, record) => <div>{record.lastBuy}</div>,
    },
    {
      title: 'Thời gian cập nhật',
      width: 185,
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          <span>
            {/* {format(
              new Date(record.updated_at || get(record, "user.updated_at")),
              "HH:mm"
            )} */}
            {record.updated_at
              ? format(record.updated_at, 'HH:mm - dd/MM/yyyy')
              : ''}
          </span>
          <span>
            {record.updated_at
              ? format(record.updated_at, 'HH:mm - dd/MM/yyyy')
              : ''}
            {/* {format(
              new Date(record.updated_at || get(record, "user.updated_at")),
              "dd/MM/yyyy"
            )} */}
          </span>
        </div>
      ),
    },
  ];

  const checkboxSettings: {
    label: string;
    value: string;
  }[] = [
    {
      label: 'Chặn',
      value: 'is_block',
    },
    {
      label: 'Cấp độ KH',
      value: 'level',
    },
    {
      label: 'Tổng số lượng đơn',
      value: 'order',
    },
    {
      label: 'Đã in',
      value: 'printed',
    },
    {
      label: 'Đã nhận',
      value: 'received',
    },
    {
      label: 'Đơn hoàn',
      value: 'orderReturn',
    },
    {
      label: 'Hoàn 1 phần',
      value: 'orderReturnAPart',
    },
    {
      label: 'Đã thanh toán',
      value: 'successCost',
    },
    {
      label: 'Lần mua cuối',
      value: 'lastBuy',
    },
    {
      label: 'Thời gian cập nhật',
      value: 'updated_at',
    },
  ];

  const transactionByWarehouseData = [
    {
      
    }
  ]

  const styleHiddenSlideToggle = {
    height: 0,
    opacity: 0.75,
    overflow: 'hidden',
    padding: '0px',
    // display: "none",
    transition: 'all 0.3s linear',
  };

  const styleShowSlideToggle = {
    height: 'fit-content',
    opacity: 1,
    // display: "block",
    padding: '10px',
    border: '1px solod #FFCF90',
  };

  const handleAddCustomer = (e: any) => {
    console.log('e', e);
    setIsShowModalAddCustomer(false);
    setLoading(true);
    const url = `/api/v2/customers/create`;
    const body = {
      birthday: e.birthday,
      email: e.email,
      name: e.name,
      phone_number: e.phone_number,
      sex: e.sex,
      source_id: e.source_id,
      is_in_app: false,
      is_taken_by: window.loggedInUser,
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
        getListCustomer(pagination.page, pagination.pageSize);
        setLoading(false);
        if (data.success) {
          notification.success({
            message: 'Thêm khách hàng thành công!',
          });
        } else {
          notification.error({
            message: data.message,
          });
          console.log('error');
        }
      });
  };

  return (
    <div className="w-full list-customer">
      <div className="flex items-center justify-between mb-[12px] flex-wrap ">
        <TitlePage title="Danh sách khách hàng" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Chọn nguồn</div>
            <Select
              placeholder="Chọn nguồn"
              style={{ width: 426 }}
              options={listSource}
              onChange={(e) => {
                setPagination({
                  current: 1,
                  page: 1,
                  total: 0,
                  pageSize: pagination.pageSize || 10,
                });

                setFilter({
                  ...filter,
                  source_id: e,
                });
              }}
              clearIcon={<Icon icon="cancel" size={16} />}
            />
          </div>
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
            onClick={handleExportExcel}
          >
            Xuất file
          </Button>
          {/*<Button
            variant="outlined"
            width={101}
            icon={<Icon icon="upload" size={24} />}
          >
            Tải lên
          </Button>*/}
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => setIsShowModalAddCustomer(true)}
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px] justify-start">
        <Input
          width={300}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập ID/ Tên khách hàng/SĐT"
          onChange={(e: any) => {
            setPagination({
              current: 1,
              page: 1,
              total: 0,
              pageSize: pagination.pageSize || 10,
            });
            setSearchKey(e.target.value);
          }}
        />
        {/* <Button variant="outlined" width={148}>
          Ghim tìm kiếm
        </Button> */}
        <Select
          clearIcon={<Icon icon="cancel" size={16} />}
          containerClassName={styles.wrapper_select}
          style={{ maxWidth: 280 }}
          prefix={<Icon icon="personalcard" size={24} />}
          options={listStaff}
          onChange={(e) => {
            setPagination({
              current: 1,
              page: 1,
              total: 0,
              pageSize: pagination.pageSize || 10,
            });
            setFilter({
              ...filter,
              staff_id: e,
            });
          }}
          placeholder="Nhập tên nhân viên"
        />
        <InputRangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          width={306}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(value) => {
            setPagination({
              current: 1,
              page: 1,
              total: 0,
              pageSize: pagination.pageSize || 10,
            });
            handleSearchByDate(value);
          }}
        />
        <Button
          variant="danger-outlined"
          width={113}
          icon={<Icon icon="trash" size={24} color="#EF4444" />}
          onClick={() => setIsShowModalConfirm(true)}
        >
          Xóa KH
        </Button>
        <Button
          variant="outlined"
          width={69}
          icon={<Icon icon="settings-1" size={24} />}
          onClick={() => setIsShowSettings(!isShowSettings)}
        />
        <div
          style={isShowSettings ? styleShowSlideToggle : styleHiddenSlideToggle}
          className="my-[12px] w-full bg-[#FFFFFF] rounded-b"
        >
          <Checkbox
            options={checkboxSettings}
            onChange={(e) =>
              setColumnSelecteted(e.concat(['id', 'name', 'phone_number']))
            }
            value={columnSelecteted}
          />
        </div>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số khách hàng đang chọn:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
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
              window.location.href = `/customers/${record.id}`;
            },
          };
        }}
        // loading={loading}
        rowSelection={rowSelection}
        columns={columns.filter((e: any) => columnSelecteted.includes(e.key))}

        // dataSource={[...customers]}
        dataSource={data}
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
          getListCustomer(e.current || 1, e.pageSize || 10);
        }}
        scroll={{ x: 50 }}
      />
      <ModalConfirm
        titleBody="Xóa thông tin khách hàng?"
        content={
          <div className="text-center">
            Mọi dữ liệu của khách hàng này <br />
            sẽ bị xoá khỏi hệ thống
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
      <ModalNotice
        titleBody="Không thể xoá người dùng này khỏi hệ thống"
        content="Bạn không thể xoá khách hàng còn công nợ"
        onClose={() => setIsShowModalNotice(false)}
        isVisible={isShowModalNotice}
      />
      <ModalAddCustomer
        listSource={listSource}
        isVisible={isShowModalAddCustomer}
        onClose={() => setIsShowModalAddCustomer(false)}
        onOpen={(e) => handleAddCustomer(e)}
      />

      <ModalConfirm
        titleConfirm="Đồng ý"
        titleBody=""
        content={
          <div>
            <div className="text-center mb-[12px]">
              Bạn có chắc chắn muốn {targetRow.checked ? 'bỏ chặn' : 'chặn'}{' '}
              khách hàng này không?
            </div>
          </div>
        }
        onOpen={() => handleBlock()}
        onClose={() => {
          setTargetRow({
            id: targetRow.id,
            checked: targetRow.checked,
          });
          getListCustomer(pagination.page, pagination.pageSize);
          setIsShowModalConfirmBlock(false);
        }}
        isVisible={isShowModalConfirmBlock}
      />
    </div>
  );
};

export default ListCustomer;
