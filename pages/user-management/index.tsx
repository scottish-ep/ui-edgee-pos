/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useDebounce } from 'usehooks-ts';
import { Table, Switch, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import get from 'lodash/get';
import TitlePage from '../../../components/TitlePage/Titlepage';
import { isArray, onCoppy } from '../../../utils/utils';
import { formatCustomers } from '../../../utils/utils';
import { LevelCustomer } from '../../../enums/enums';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import Checkbox from '../../../components/CheckboxList/CheckboxList';
import NoData from '../../../public/no-data.svg';
import { warehouses } from '../../../const/constant';
import DatePicker from '../../../components/DatePicker/DatePicker';
import PaginationCustom from '../../../components/PaginationCustom';
import UserModal from '../../users/components/UserModal';
import { IUser } from '../../../types/users';
import UserApi from '../../../services/users';
import { usersList } from '../../../dummy-data/dummyData';
import Image from 'next/image';
import PermissionApi from '../../../services/permission';
import { IOption } from '../../../types/permission';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';

const UserManagement = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectPermissionOptions, setSelectPermissionOptions] = useState<
    IOption[]
  >([]);
  const [isShowModalRemove, setIsShowModalRemove] = useState(false);

  const [filter, setFilter] = useState<any>({});
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchPhrase, 500);

  useEffect(() => {
    document.title = 'Danh sách người dùng hệ thống';
  });

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getListStaff();
  }, []);

  const getListStaff = async () => {
    setLoading(true);
    const result = await UserApi.getListStaff({
      populate: [
        'user_role_companies:id,role_id,user_id',
        'user_role_companies.role:id,name',
        'staff_group:id,name',
        'warehouses:id,staff_id,warehouse_id',
      ],
      filter,
      name: searchPhrase,
    });
    setUsers(result);
    setLoading(false);
  };

  useEffect(() => {
    getSelectPermissionOptions();
  }, []);

  const getSelectPermissionOptions = async () => {
    const result = await PermissionApi.list();
    const listPermission = result.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setSelectPermissionOptions(listPermission);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    getListStaff();
  }, [filter, debouncedValue]);

  const handleSuccess = () => {
    setOpenModal(false);
    getListStaff();
  };

  const handleDelete = async () => {
    setIsShowModalRemove(false);
    if (!userSelected) {
      return;
    }
    const { data } = await UserApi.deleteId(
      parseInt(userSelected?.id.toString())
    );
    if (data) {
      notification.success({
        message: 'Xóa người dùng thành công!',
      });
      getListStaff();
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChange = (record?: any) => {
    console.log('record', record);
  };

  const colData: IUser[] = Array(20)
    .fill({
      isBlock: false,
      avatar: require('public/yellow-star.svg'),
      email: 'a@gmail.com',
      phone: '0199910020',
      name: 'Tester',
      user_role_companies: [
        {
          role: {
            name: 'CEO',
          },
        },
      ],
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<IUser> = [
    {
      title: 'Chặn',
      width: 110,
      dataIndex: 'isBlock',
      key: 'isBlock',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            className="button-switch"
            defaultChecked={record?.isBlock}
            onChange={() => onChange(record)}
          />
        );
      },
    },
    {
      title: 'ID',
      width: 120,
      key: 'ID',
      align: 'center',
      render: (_, record) => <div className="font-semibold">{record?.id}</div>,
    },
    {
      title: 'Tên người dùng',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="font-semibold flex items-center gap-x-[8px] text-[#384ADC]">
          {record?.avatar && (
            <div className="relative w-[36px] h-[36px]">
              <Image
                className="rounded__img"
                src={record?.avatar}
                alt=""
                fill
              />
            </div>
          )}
          {record?.name}
        </div>
      ),
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      align: 'left',
      render: (_, record) => (
        <div
          className="font-medium"
          onClick={(e) => {
            record?.phone && onCoppy(e, record?.phone);
          }}
        >
          {record?.phone}
        </div>
      ),
    },
    {
      title: 'Email',
      width: 200,
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      render: (_, record) => <div className="font-medium">{record?.email}</div>,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
      render: (_, record) => (
        <div className="font-medium">
          {get(record, 'user_role_companies[0].role.name')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-[16px]">
          <div
            className="pointer"
            onClick={() => {
              setUserSelected(record);
              setOpenModal(true);
            }}
          >
            <Icon icon="edit-1" size={24} color="#4B4B59" />
          </div>
          <div
            className="pointer"
            onClick={() => {
              setUserSelected(record);
              setIsShowModalRemove(true);
            }}
          >
            <Icon icon="delete-1" size={24} color="#EF4444" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Danh sách người dùng hệ thống" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            {/*<div className="font-medium mr-[12px] text-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
            />*/}
          </div>
          {/*<Button
            variant="outlined"
            width={113}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>*/}
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => {
              setOpenModal(true);
              setUserSelected({
                id: Math.floor(Math.random() * 10000000).toString(),
                name: '',
                email: '',
                phone: '',
                isBlock: false,
              });
            }}
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
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập Tên người dùng cần tìm"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
          className="w-full"
        />
        <Select
          allowClear
          showSearch
          clearIcon={<Icon icon="cancel" size={16} />}
          prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
          placeholder="Tìm theo chức vụ"
          style={{ width: 306 }}
          options={selectPermissionOptions}
          onChange={(e, option: any) => {
            if (option?.id) {
              setFilter({
                ...filter,
                role_id: option?.id || null,
              });
            } else {
              setFilter({});
            }
          }}
        />
      </div>
      <Table
        loading={loading}
        columns={columns}
        // dataSource={users}
        dataSource={colData}
        pagination={false}
        scroll={{ x: 50 }}
        rowKey={(record) => record.id}
        locale={{
          emptyText: (
            <div className="text-center w-[36px] h-[36px] flex items-center justify-center py-[20px]">
              <Image src={require('public/no-data.svg')} fill alt="no-data" />
            </div>
          ),
        }}
      />

      <UserModal
        isVisible={openModal}
        userSelected={userSelected}
        handleSuccess={handleSuccess}
        onClose={() => setOpenModal(false)}
      />

      <ModalRemove
        isVisible={isShowModalRemove}
        onClose={() => setIsShowModalRemove(false)}
        onOpen={() => setIsShowModalRemove(false)}
        titleBody="Xóa người dùng này?"
        content="Thông tin của người dùng sẽ không còn nữa."
        onOk={handleDelete}
      />
    </div>
  );
};

export default UserManagement;
