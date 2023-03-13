/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { notification, Popover, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { actionList, moduleList, systemLogList } from '../../../const/constant';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import TableEmpty from '../../../components/TableEmpty';
import { ActionSystemLogEnum, ISystemLog } from '../system.type';
import Select from '../../../components/Select/Select';
import ModalRemove from '../../../components/ModalRemove/ModalRemove';
import PaginationCustom from '../../../components/PaginationCustom';
import UserActivityLogApi from '../../../services/user-activity-logs';
import { useDebounce } from 'usehooks-ts';
import { get } from 'lodash';
import { handleDirect, isArray, onCoppy } from '../../../utils/utils';
import { ModuleLogAction } from '../../../enums/enums';
import { RangePickerProps } from 'antd/lib/date-picker';
import DateRangePickerCustom from '../../../components/DateRangePicker/DateRangePickerCustom';
import queryString from 'query-string';
import { uuid } from 'uuidv4';
import OrderApi from '../../../services/orders';
import ItemApi from '../../../services/items';

const SystemLogList = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 10,
  };

  const router = useRouter();
  let locationSearch: any;
  useEffect(() => {
    locationSearch = queryString.parse(location.search);
    console.log('location', locationSearch);
  });

  const [systemLogs, setSystemLogList] = useState<ISystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [filter, setFilter] = useState<any>({});
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchUser, setSearchUser] = useState('');
  const debouncedSearchUser = useDebounce(searchUser, 1000);
  const [module, setModule] = useState<string | undefined>(undefined);
  const [action, setAction] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [isChangePage, setIsChangePage] = useState<string>('');
  const [record, setRecord] = useState<any>({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isShowModalReturnSystemLog, setIsShowModalReturnSystemLog] =
    useState(false);

  useEffect(() => {
    setSearchKey(String(locationSearch?.order_id || ''));
    getData({
      paramsUrl: [
        String(locationSearch?.user || ''),
        String(locationSearch?.moduleType ? 'Đơn hàng' : ''),
      ],
      searchKey: String(locationSearch?.order_id || ''),
    });
  }, []);

  useEffect(() => {
    if (
      debouncedSearchTerm ||
      isChangePage ||
      debouncedSearchUser ||
      dateTo ||
      action ||
      module
    ) {
      let params = [
        String(locationSearch?.user || ''),
        String(locationSearch?.moduleType ? 'Đơn hàng' : ''),
      ];
      if (debouncedSearchUser) {
        params = [
          searchUser,
          String(locationSearch?.moduleType ? 'Đơn hàng' : ''),
        ];
      }
      if (module) {
        params = [searchUser || String(locationSearch?.user || ''), module];
      }
      getData({
        searchKey,
        action,
        dateFrom,
        dateTo,
        page: page,
        limit: pageSize,
        paramsUrl: params,
      });
    }
  }, [
    debouncedSearchTerm,
    page,
    pageSize,
    debouncedSearchUser,
    dateTo,
    action,
    module,
  ]);

  const getData = async (params: any) => {
    setLoading(true);
    const data = await UserActivityLogApi.getList(params);
    setSystemLogList(data.data);
    console.log('system', systemLogList);
    setTotalItems(data.totalLogs);
    setLoading(false);
  };

  const colData: ISystemLog[] = Array(10)
    .fill({
      action: 'CREATED',
      title: 'Thu',
      user: {
        name: 'Trean Huyen',
      },
      created_at: Date.now(),
      description: {
        text: 'Xóa sản phẩm',
        id: 'BHV001 | Bàn chải đánh răng điện',
      },
      module: "Đơn hàng",
      name: 'Ngọc Linh',
      updatedAt: Date.now(),
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<ISystemLog> = [
    {
      title: 'Nhân viên',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (_, record: any) => (
        <span
          className="text-medium text-[#384ADC] font-semibold"
          onClick={(e) => {
            get(record, 'user.name') && onCoppy(e, get(record, 'user.name'));
          }}
        >
          {get(record, 'user.name')}
        </span>
      ),
    },
    {
      title: 'Module',
      width: 130,
      dataIndex: 'module',
      key: 'module',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#1D1C2D] font-medium"
          onClick={(e) => {
            record.module && onCoppy(e, record.module);
          }}
        >
          {record.module || '--'}
        </span>
      ),
    },
    {
      title: 'Tác vụ',
      width: 250,
      dataIndex: 'action',
      key: 'action',
      align: 'left',
      render: (_, record) => (
        <span
          className="text-medium font-medium text-[#8B5CF6]"
          onClick={(e) => {
            record.action && onCoppy(e, record.action);
          }}
        >
          {record.action ? ModuleLogAction[record.action] : '--'}
        </span>
      ),
    },
    {
      title: 'Nội dung',
      width: 250,
      dataIndex: 'content',
      key: 'content',
      align: 'left',
      render: (_, record) => {
        const description =
          record.description && isArray(record.description)
            ? JSON.parse(record.description)
            : [];
        const ContentLog = description ? (
          <div className="td_items_skus">
            {description.map((item: any, index: any) => (
              <div key={index}>
                {item.title}:{' '}
                <span className="text-[#EF4444]">
                  {item.oldValue && item.oldValue}
                </span>{' '}
                <span>{item.oldValue && ' -> '}</span>
                <span className="text-[#10B981]">
                  {item.newValue && item.newValue}
                </span>
              </div>
            ))}
          </div>
        ) : null;
        return isArray(description) ? (
          <Popover
            className="flex flex-row items-start"
            placement="bottomLeft"
            content={ContentLog}
            trigger="hover"
          >
            <div
              className="inline-block"
              onClick={(e) => {
                record.title && onCoppy(e, record.title);
              }}
            >
              <span className="text-[#1D1C2D] font-medium text-medium">
                {record.title}
              </span>
            </div>
          </Popover>
        ) : (
          <div
            className="inline-block"
            onClick={(e) => {
              record.title && onCoppy(e, record.title);
            }}
          >
            <span className="text-[#1D1C2D] font-medium text-medium">
              {record.title}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      width: 200,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-medium text-[#1D1C2D]"
          onClick={(e) => {
            record.created_at &&
              onCoppy(
                e,
                format(
                  new Date(get(record, 'created_at')),
                  'dd/MM/yyyy - HH:mm'
                )
              );
          }}
        >
          {get(record, 'created_at')
            ? format(new Date(get(record, 'created_at')), 'dd/MM/yyyy - HH:mm')
            : ''}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      width: 100,
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) =>
        record.action === ActionSystemLogEnum.DELETED && (
          <span
            className="text-medium font-medium text-[#384ADC]"
            onClick={() => {
              setIsShowModalReturnSystemLog(true);
              setRecord(record);
            }}
          >
            Hoàn tác
          </span>
        ),
    },
  ];

  const onDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings?.[0]);
      setDateTo(dateStrings?.[1]);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  const handleRevertAction = async () => {
    setConfirmLoading(true);
    const res = await UserActivityLogApi.deleteLogs(record.id);
    if (record?.order_id) {
      if (res) {
        await OrderApi.updateMany({
          arrayId: [record.order_id],
          is_revert: true,
        });
        notification.success({
          message: 'Hoàn tác thành công',
        });
      }
    }
    if (record?.item_id) {
      if (res) {
        ItemApi.updateShowItem(record.item_id, {
          is_revert: true,
        });
        notification.success({
          message: 'Hoàn tác thành công',
        });
      }
    }
    setConfirmLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Nhật ký hoạt động" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
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
              {/*  */}
            </a>
          </Button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <div className="w-[20%]">
          <Input
            width="100%"
            prefix={<Icon icon="search" color="#FF970D" size={24} />}
            placeholder="Nhập thông tin tìm kiếm"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="w-[20%]">
          <Input
            width="100%"
            prefix={<Icon icon="personalcard" size={24} />}
            placeholder="Nhập tên nhân viên"
            value={searchUser || String(locationSearch?.user || '')}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
        <div className="w-[20%]">
          <Select
            prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
            placeholder="Tìm theo module"
            width="100%"
            options={moduleList}
            onChange={(val) => setModule(val)}
            value={
              module || (locationSearch?.moduleType ? 'Đơn hàng' : undefined)
            }
          />
        </div>
        <div className="w-[20%]">
          <Select
            prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
            placeholder="Tìm theo tác vụ"
            width="100%"
            onChange={(val) => setAction(val)}
            options={actionList}
            value={action}
          />
        </div>
        <div className="flex-1">
          <DateRangePickerCustom width="100%" onChange={onDateChange} />
        </div>
      </div>
      <Table
        rowKey={(record: any) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        loading={loading}
        columns={columns}
        // dataSource={systemLogs}
        dataSource={colData}
        pagination={false}
        scroll={{ x: 50 }}
        onRow={(record) => {
          return {
            onClick: () => handleDirect(record),
          };
        }}
      />

      <PaginationCustom
        total={totalItems}
        defaultPageSize={pageSize}
        current={page}
        onChangePage={(page) => {
          setPage(page);
          setIsChangePage(uuid());
        }}
        onChangePageSize={(pageSize) => {
          setPageSize(pageSize);
          setIsChangePage(uuid());
        }}
      />

      <ModalRemove
        isVisible={isShowModalReturnSystemLog}
        onClose={() => setIsShowModalReturnSystemLog(false)}
        onOpen={() => setIsShowModalReturnSystemLog(false)}
        titleBody="Xác nhận hoàn tác?"
        content="Hệ thống sẽ khôi phục lại dữ liệu này về trạng thái trước đây."
        textButtonSubmit="XÁC NHẬN"
        colorButtonSubmit="secondary"
        onOk={handleRevertAction}
        loading={confirmLoading}
      />
    </div>
  );
};

export default SystemLogList;
