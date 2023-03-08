/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { notification, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import get from 'lodash/get';
import { format } from 'date-fns';
import Image from 'next/image';
import { Checkbox } from 'antd';
import Tabs from '../../components/Tabs';
import TitlePage from '../../components/TitlePage/Titlepage';
import { Popover } from 'antd';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/Input';
import DatePicker from '../../components/DatePicker/DatePicker';
import DropdownStatus from '../../components/DropdownStatus';
import { StatusColorEnum, StatusEnum, StatusList } from '../../types';
import ModalSettingGroup from './Modal/modal-setting-group';
import ModalSettingFault from './Modal/modal-setting-fault';
import ModalSettingStaff from './Modal/modal-setting-staff';
import { useDebounce } from 'usehooks-ts';
import classNames from 'classnames';

import styles from '../../styles/ListProduct.module.css';

// import { IStaffListProps } from "./staff.type";
import { productTypeList } from '../../const/constant';
import WarehouseApi from '../../services/warehouses';
import StaffApi from '../../services/staffs';
import StaffGroupApi from '../../services/staff-groups';
import StaffErrorApi from '../../services/staff-errors';

const StaffList = () => {
  const colsData = Array(50).fill({
    img: require('../../public/yellow-star.svg'),
    name: 'Testet',
    staff_code: 'X102011',
    phone: '029219919',
    roles: [
      {
        name: 'CEO',
      },
    ],
    staff_group: {
      name: 'FE Team',
    },
    warehouses: [
      {
        warehouse: {
          name: 'Kho Mai Linh',
        },
      },
    ],
    staff_errors_count: 1,
  })
  .map((item, index) => ({...item, id: index++}))
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      width: 70,
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <p className="text-medium font-medium text-[#5F5E6B]">{record.id}</p>
      ),
    },
    {
      title: 'Tên / mã nhân viên',
      width: 249,
      dataIndex: 'id',
      key: 'name',
      fixed: 'left',
      align: 'left',
      render: (_, record) => (
        <div className="w-full flex justify-start">
          <div className="w-[36px] relative mr-[8px]">
            <Image src={record?.img ? record.img : ''} layout="fill" alt="" />
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-medium font-medium text-[#384ADC]">
              {record.name}
            </p>
            <p className="text-medium font-medium text-[#5F5E6B]">
              {record.staff_code}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'SĐT',
      width: 105,
      dataIndex: 'phone',
      key: 'name',
      align: 'center',
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">{record.phone}</span>
        </div>
      ),
    },
    {
      title: 'Chức vụ',
      width: 175,
      dataIndex: 'role',
      key: 'name',
      align: 'center',
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">
            {record?.roles[0]?.name}
          </span>
        </div>
      ),
    },
    {
      title: 'Nhóm',
      width: 110,
      dataIndex: 'Fault',
      key: 'name',
      align: 'center',
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">
            {record.staff_group ? record.staff_group.name : ''}
          </span>
        </div>
      ),
    },
    {
      title: 'Trực thuộc',
      width: 213,
      dataIndex: 'store',
      key: 'name',
      align: 'center',
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">
            {record.warehouses.length !== 0 &&
              record.warehouses[0].warehouse &&
              record.warehouses[0].warehouse.name}
          </span>
        </div>
      ),
    },
    {
      title: 'Số lỗi',
      width: 70,
      dataIndex: 'role',
      key: 'name',
      sorter: true,
      align: 'center',
      onHeaderCell: (column) => {
        return {
          onClick: () => setSort(sort === 'DESC' ? 'ASC' : 'DESC'),
        };
      },
      render: (_, record) => (
        <div>
          <span className="font-medium text-medium">
            {record.staff_errors_count || 0}
          </span>
        </div>
      ),
    },
  ];

  const content = (
    <div className="w-[180px] flex flex-col justify-start">
      <p
        className="text-medium font-normal cursor-pointer mb-[16px]"
        onClick={() => setIsShowModalSettingGroup(true)}
      >
        Cài đặt nhóm NVBH
      </p>
      <p
        className="text-medium font-normal cursor-pointer"
        onClick={() => setIsShowModalSettingFault(true)}
      >
        Cài đặt lỗi
      </p>
    </div>
  );
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [page, setPage] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(10);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [staffGroups, setStaffGroups] = useState<any[]>([]);
  const [staffErrors, setStaffErrors] = useState<any[]>([]);
  let queryString = '';
  useRef(() => {
    queryString = window.location.search;
  });
  const urlParams = new URLSearchParams(queryString);
  const type = urlParams.get('type');

  const [isShowModalSettingGroup, setIsShowModalSettingGroup] = useState(false);
  const [isShowModalSettingFault, setIsShowModalSettingFault] = useState(false);
  const [isShowModalSettingStaff, setIsShowModalSettingStaff] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number>(-1);
  const [selectedGroup, setSelectedGroup] = useState<number>(-1);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchPhrase, 1000);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>({
    total: 1,
    pageSize: 10,
    page: 1,
  });
  const [sort, setSort] = useState('');
  const [warehouses, setWarehouses] = useState([
    {
      label: 'Tất cả kho',
      value: -1,
    },
  ]);

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getAllStaffs();
  }, [
    pagination.page,
    pagination.pageSize,
    debouncedSearchTerm,
    selectedGroup,
    selectedWarehouse,
    sort,
  ]);

  useEffect(() => {
    getAllWarehouses();
    getAllStaffGroups();
    getAllStaffErrors();
  }, []);

  const getAllStaffs = async () => {
    setLoading(true);
    const { data, totalPage, totalItem } = await StaffApi.getStaff({
      populate: [
        'staff_group:id,name',
        'roles',
        'staff_errors:id,staff_id,staff_error_id',
        'warehouses.warehouse:id,name',
      ],
      limit: pagination.pageSize,
      page: pagination.page,
      search: debouncedSearchTerm,
      sort,
      warehouse_id: selectedWarehouse !== -1 ? selectedWarehouse : undefined,
      staff_group_id: selectedGroup !== -1 ? selectedGroup : undefined,
      type: type,
    });
    setStaffs(
      data?.map((v: any) => ({
        ...v,
        label: v.name,
        value: v.id,
      }))
    );
    setPagination({
      ...pagination,
      total: totalPage * pagination.pageSize,
    });
    setLoading(false);
  };

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();

    setWarehouses(
      warehouses.concat(
        data?.map((v: any) => ({
          name: v.name,
          label: v.name,
          value: v.id,
        }))
      )
    );
  };

  const getAllStaffGroups = async () => {
    const data = await StaffGroupApi.getStaffGroup();

    setStaffGroups(
      data?.map((v: any) => ({
        name: v.name,
        label: v.name,
        value: v.id,
      }))
    );
  };

  const getAllStaffErrors = async () => {
    const data = await StaffErrorApi.getStaffError();
    setStaffErrors(
      data?.map((v: any) => ({
        name: v.name,
        label: v.name,
        value: v.id,
      }))
    );
  };

  const handleAddStaff = async (params: any, staffSelected: any) => {
    setSubmitLoading(true);
    await StaffApi.addStaff({
      ...params,
      arrayId: staffSelected,
    });
    await getAllStaffs();
    setSubmitLoading(false);
    notification.success({
      message: 'Add staff success',
    });
  };

  return (
    <div className="w-full target-management">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <div className="flex flex-col justify-start">
          <TitlePage title="Quản lý nhân viên" href="/user-goal" />
          <div className="flex mt-[8px]">
            <p className="text-medium font-medium mr-[5px]">
              Quản lý nhân viên
            </p>
            <p>/</p>
            <p className="text-medium font-medium text-[#384ADC] ml-[5px]">
              Danh sách nhân viên bán hàng
            </p>
          </div>
        </div>
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="mr-[12px] font-medium">Chọn kho</div>
            <Select
              placeholder="Chọn kho"
              options={warehouses}
              defaultValue={warehouses[0]}
              style={{ width: 248 }}
              onChange={(e) => {
                setSelectedWarehouse(e);
                setPagination({
                  ...pagination,
                  page: 1,
                });
              }}
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={143}
            color="white"
            icon={<Icon icon="add-1" size={24} color="white" />}
            onClick={() => setIsShowModalSettingStaff(true)}
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
          className="flex flex-col flex-1 w-[306px]"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập ID/ Tên nhân viên"
          value={searchPhrase}
          onChange={(e) => {
            setSearchPhrase(e.target.value);
            setPagination({
              ...pagination,
              page: 1,
            });
          }}
        />
        <div style={{ width: 306 }}>
          <Select
            prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
            placeholder="Tìm theo nhóm nhân viên"
            style={{ width: 306 }}
            onChange={(e) => {
              setSelectedGroup(e);
              setPagination({
                ...pagination,
                page: 1,
              });
            }}
            options={[
              {
                label: 'Tất cả nhóm',
                value: -1,
              },
            ].concat(staffGroups)}
          />
        </div>

        <Popover
          placement="bottomRight"
          content={content}
          trigger="click"
          overlayStyle={{ width: '180px' }}
          className="relative"
        >
          <Button width={129} height={45} className="p-0">
            <div className="w-[129px] flex justify-between p-[10px] items-center">
              <div className="flex justify-left">
                <Icon icon="setting" size={24} className="mr-[10px]" />
                Cài đặt
              </div>
              <Icon icon="arrow-down-1" size={14} />
            </div>
          </Button>
        </Popover>
      </div>
      <div className="relative">
        <Table
          columns={columns}
          // dataSource={staffs}
          dataSource={colsData}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                window.location.href = `/staff/${record.id}`;
              },
            };
          }}
          loading={loading}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
          }}
          scroll={{ x: 50 }}
        />
      </div>
      <ModalSettingGroup
        title="Cài đặt nhóm nhân viên bán hàng"
        isVisible={isShowModalSettingGroup}
        itemList={staffGroups}
        setItemList={setStaffGroups}
        handleReload={getAllStaffGroups}
        onClose={() => setIsShowModalSettingGroup(false)}
        onOpen={() => setIsShowModalSettingGroup(false)}
        submitLoading={submitLoading}
      />
      <ModalSettingFault
        title="Cài đặt lỗi nhân viên hay mắc"
        isVisible={isShowModalSettingFault}
        itemList={staffErrors}
        setItemList={setStaffErrors}
        handleReload={getAllStaffErrors}
        submitLoading={submitLoading}
        onClose={() => setIsShowModalSettingFault(false)}
        onOpen={() => setIsShowModalSettingFault(false)}
      />
      <ModalSettingStaff
        title="Thêm nhân viên bán hàng"
        isVisible={isShowModalSettingStaff}
        staffGroups={[
          {
            label: 'Tất cả nhóm',
            value: -1,
          },
        ].concat(staffGroups)}
        // staffs={staffs}
        warehouses={warehouses}
        handleSubmit={handleAddStaff}
        submitLoading={submitLoading}
        onClose={() => setIsShowModalSettingStaff(false)}
        onOpen={() => setIsShowModalSettingStaff(false)}
      />
    </div>
  );
};

export default StaffList;
