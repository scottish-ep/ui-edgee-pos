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
          label: 'T???t c??? ngu???n',
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
        return <div className="font-semibold text-[#0EA5E9]">KH m???i</div>;
      case LevelCustomer.GOLD:
        return <div className="font-semibold text-[#EAB308]">V??ng</div>;
      case LevelCustomer.SILVER:
        return <div className="font-semibold text-[#5F5E6B[">B???c</div>;
      case LevelCustomer.BRONZE:
        return <div className="font-semibold text-[#F97316]">?????ng</div>;
      default:
        return <div></div>;
    }
  };

  const renderTag = (record: CustomerType) => {
    if (record?.is_bad && record?.is_block === 1) {
      return (
        <>
          <Tag className="ml-0.5" color="red">
            X???u
          </Tag>
        </>
      );
    } else if (record?.is_bad && record?.is_block === 0) {
      return (
        <Tag className="ml-0.5" color="red">
          X???u
        </Tag>
      );
    } else if (!record?.is_bad && record?.is_block === 1) {
      return (
        <Tag className="ml-0.5" color="red">
          Ch???n
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
            message: 'C???p nh???t th??ng tin kh??ch h??ng th??nh c??ng!',
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
        message: 'C?? l???i !!!',
        description: 'Ch??a ch???n kh??ch h??ng ????? xo??',
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
            message: 'X??a th??nh c??ng!',
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
      title: 'Ch???n',
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
      title: 'T??n kh??ch h??ng',
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
      title: 'S??? ??i???n tho???i',
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
      title: 'C???p ????? KH',
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
      title: 'T???ng s??? l?????ng ????n',
      width: 126,
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      render: (_, record) => <div>{record.orderTotalCount}</div>,
    },
    {
      title: '???? in',
      width: 88,
      dataIndex: 'printed',
      key: 'printed',
      align: 'center',
      render: (_, record) => <div>{record.count_print_order}</div>,
    },
    {
      title: '???? nh???n',
      width: 100,
      dataIndex: 'received',
      key: 'received',
      align: 'center',
      render: (_, record) => <div>{record.count_received_order}</div>,
    },
    {
      title: '????n ho??n',
      width: 110,
      dataIndex: 'orderReturn',
      key: 'orderReturn',
      align: 'center',
      render: (_, record) => <div>{record.count_return_order}</div>,
    },
    {
      title: 'Ho??n 1 ph???n',
      width: 96,
      dataIndex: 'orderReturnAPart',
      key: 'orderReturnAPart',
      align: 'center',
      render: (_, record) => <div>{record.count_partial_return_order}</div>,
    },
    // {
    //   title: "???? thanh to??n",
    //   width: 160,
    //   dataIndex: "successCost",
    //   key: "successCost",
    //   align: "center",
    //   // render: (_, record) => <div>{record.successCost || "0 vn??"}</div>,
    // },
    {
      title: 'L???n mua cu???i',
      width: 140,
      dataIndex: 'lastBuy',
      key: 'lastBuy',
      align: 'center',
      render: (_, record) => <div>{record.lastBuy}</div>,
    },
    {
      title: 'Th???i gian c???p nh???t',
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
      label: 'Ch???n',
      value: 'is_block',
    },
    {
      label: 'C???p ????? KH',
      value: 'level',
    },
    {
      label: 'T???ng s??? l?????ng ????n',
      value: 'order',
    },
    {
      label: '???? in',
      value: 'printed',
    },
    {
      label: '???? nh???n',
      value: 'received',
    },
    {
      label: '????n ho??n',
      value: 'orderReturn',
    },
    {
      label: 'Ho??n 1 ph???n',
      value: 'orderReturnAPart',
    },
    {
      label: '???? thanh to??n',
      value: 'successCost',
    },
    {
      label: 'L???n mua cu???i',
      value: 'lastBuy',
    },
    {
      label: 'Th???i gian c???p nh???t',
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
            message: 'Th??m kh??ch h??ng th??nh c??ng!',
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
        <TitlePage title="Danh s??ch kh??ch h??ng" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Ch???n ngu???n</div>
            <Select
              placeholder="Ch???n ngu???n"
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
            Xu???t file
          </Button>
          {/*<Button
            variant="outlined"
            width={101}
            icon={<Icon icon="upload" size={24} />}
          >
            T???i l??n
          </Button>*/}
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => setIsShowModalAddCustomer(true)}
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px] justify-start">
        <Input
          width={300}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nh???p ID/ T??n kh??ch h??ng/S??T"
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
          Ghim t??m ki???m
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
          placeholder="Nh???p t??n nh??n vi??n"
        />
        <InputRangePicker
          placeholder={['Ng??y b???t ?????u', 'Ng??y k???t th??c']}
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
          X??a KH
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
          S??? kh??ch h??ng ??ang ch???n:{' '}
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
        titleBody="X??a th??ng tin kh??ch h??ng?"
        content={
          <div className="text-center">
            M???i d??? li???u c???a kh??ch h??ng n??y <br />
            s??? b??? xo?? kh???i h??? th???ng
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
      <ModalNotice
        titleBody="Kh??ng th??? xo?? ng?????i d??ng n??y kh???i h??? th???ng"
        content="B???n kh??ng th??? xo?? kh??ch h??ng c??n c??ng n???"
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
        titleConfirm="?????ng ??"
        titleBody=""
        content={
          <div>
            <div className="text-center mb-[12px]">
              B???n c?? ch???c ch???n mu???n {targetRow.checked ? 'b??? ch???n' : 'ch???n'}{' '}
              kh??ch h??ng n??y kh??ng?
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
