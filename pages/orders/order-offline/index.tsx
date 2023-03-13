/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useDebounce } from 'usehooks-ts';
import Button from '../../../components/Button/Button';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import { orderList } from '../../../utils/utils';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import Tabs from '../../../components/Tabs';
import TitlePage from '../../../components/TitlePage/Titlepage';
import { statusList } from '../../../utils/utils';
import {
  orderCheckCommandColor,
  orderStatus,
  warehouses,
  warehouseStatusColor,
} from '../../../const/constant';
import styles from '../../../styles/DetailCustomer.module.css'
import { StatusEnum } from '../../../types';
import { OrderEnum, OrderEnumId, OrderStatus } from '../../../enums/enums';
import CheckboxList from '../../../components/CheckboxList/CheckboxList';
import UserApi from '../../../services/users';
import { IUser } from '../../../types/users';
import { isArray, onCoppy } from '../../../utils/utils';
import OrderApi from '../../../services/orders';
import { Form, message, notification, Popover, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IsProduct } from '../../products/product.type';
import classNames from 'classnames';
import TableEmpty from '../../../components/TableEmpty';
import { get } from 'lodash';
import { format } from 'date-fns';
import Item from 'antd/lib/list/Item';
import { CSVLink } from 'react-csv';
import TransportCompanyApi from '../../../services/transport-company';

const ListOrderOffline = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 20,
  };

  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<any>({});
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [tabStatus, setTabStatus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderExport, setOrdersExport] = useState<any[]>([]);
  const [totalMoneyCOD, setTotalMoneyCOD] = useState<number>();
  const [totalMoneyProduct, setTotalMoneyProduct] = useState<number>();
  const [totalMoneyTransfer, setTotalMoneyTransfer] = useState<number>();
  const [selectStatus, setSelectStatus] = useState();
  const [transportCompanies, setTransportCompanies] = useState<any[]>([]);
  const [userTransportCompanySelect, setUserTransportCompanySelect] = useState<
    any[]
  >([]);
  const [printForm] = Form.useForm();

  const [isShowPrintPopever, setIsShowPrintPopever] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(false);
  const [isShowChangeStatus, setIsShowChangeStatus] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);

  const statusOrderOffline = [
    {
      label: 'Đã in',
      value: 7,
      is_show_order_list: true,
      index: 4,
    },
    {
      label: 'Huỷ',
      value: 14,
      is_show_order_list: true,
      index: 10,
    },
  ];

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getListStaff();
    getListWarehouse();
    getListTransportCompany();
  }, []);

  useEffect(() => {
    getListOrder();
  }, [filter, debouncedSearchTerm, pagination.page, pagination.pageSize]);

  const getListStaff = async () => {
    const result = await UserApi.getListStaff();
    const newListStaff = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.name + item.id,
          id: item.id,
        }))
      : [];
    setListStaff(newListStaff);
  };

  const getListTransportCompany = async () => {
    const data = await TransportCompanyApi.getAllList({
      status: true,
    });
    const rawListTransportCompany = data.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id,
        transport_company_users: item.transport_company_users.map(
          (user: any) => {
            return {
              ...user,
              label: user.name,
              value: user.id,
            };
          }
        ),
      };
    });
    setTransportCompanies(rawListTransportCompany);
  };

  const getListWarehouse = () => {
    const url = '/api/v2/warehouses/list';
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        const listWarehouseManagement =
          isArray(result) &&
          result.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        setWareHouseManagement(listWarehouseManagement);
      })
      .catch((error) => console.log(error));
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Mã đơn hàng', key: 'order_id' },
    { label: 'Mã vận chuyển', key: 'delivery_id' },
    { label: 'Trạng thái', key: 'status_name' },
    { label: 'Số lần in', key: 'number_printed' },
    { label: 'Tên Khách hàng', key: 'customer_name' },
    { label: 'Địa chỉ', key: 'address_full' },
    { label: 'Tổng tiền sản phẩm', key: 'total_product_cost' },
    { label: 'Tổng khối lượng', key: 'weight' },
    { label: 'Tiền thu COD', key: 'total_cod' },
    { label: 'Tiền chuyển khoản', key: 'total_transfer' },
    { label: 'Thời gian tạo', key: 'created_at_order' },
    { label: 'Người tạo', key: 'user_create' },
    { label: 'Thời gian in đơn', key: 'printed_order_at' },
  ];

  const getListOrder = async () => {
    setLoading(true);
    const data = await OrderApi.getOrderOffline({
      ...filter,
      arrSearch: debouncedSearchTerm && debouncedSearchTerm.split(' '),
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    setPagination({
      ...pagination,
      total: data.totalOrders,
    });
    setOrders(data.orders);
    setTotalMoneyCOD(data.totalMoneyCOD);
    setTotalMoneyProduct(data.totalMoneyProduct);
    setTotalMoneyTransfer(data.totalMoneyTransfer);
    let rawExportOrders = data.orders.map((item: any) => {
      const fullAddress =
        get(item, 'address') +
        ', ' +
        get(item, 'ward.prefix') +
        ' ' +
        get(item, 'ward.name') +
        ', ' +
        get(item, 'district.prefix') +
        ' ' +
        get(item, 'district.name') +
        ', ' +
        get(item, 'province.name');
      const createTime =
        format(new Date(item.created_at), 'HH:mm') +
        format(new Date(item.created_at), 'dd/MM/yyyy');
      const printedTime =
        format(new Date(item.printed_at), 'HH:mm') +
        format(new Date(item.printed_at), 'dd/MM/yyyy');
      let weight = 0;
      isArray(item.order_item_skus) &&
        item.order_item_skus.map((item: any) => {
          weight +=
            (get(item, 'item_sku.weight') || 0) * parseFloat(item.quantity);
        });
      return {
        ...item,
        status_name: orderStatus.find(
          (status) => status.id === item.order_status_id
        )?.label,
        number_printed: item.order_status_id == 7 ? 1 : 0,
        customer_name: item.name,
        address_full: fullAddress,
        total_cod: item.total_pay,
        created_at_order: createTime,
        user_create: get(item, 'user.name'),
        printed_order_at: printedTime,
        weight: weight,
      };
    });
    setOrdersExport(rawExportOrders);

    const rawStatus = data.orderStatuses.map((item: any) => ({
      ...item,
      count: item.orders_count,
    }));
    setTabStatus(rawStatus);
    setLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [columnSelecteted, setColumnSelecteted] = useState([
    'order_id',
    'delivery_id',
    'order_status_id',
    'printed',
    'customer',
    'address',
    'tags',
    'items',
    'total_product_cost',
    'total_pay',
    'total_transfer',
    'created_at',
    'printed_at',
    'weight',
  ]);
  const checkboxSettings: {
    label: string;
    value: string;
  }[] = [
    {
      label: 'Trạng thái',
      value: 'order_status_id',
    },
    {
      label: 'Số lần in',
      value: 'printed',
    },
    {
      label: 'Khách hàng',
      value: 'customer',
    },
    {
      label: 'Địa chỉ GH',
      value: 'address',
    },
    {
      label: 'Thẻ',
      value: 'tags',
    },
    {
      label: 'Giỏ hàng',
      value: 'items',
    },
    {
      label: 'Tổng tiền SP',
      value: 'total_product_cost',
    },
    {
      label: 'Tổng tiền COD',
      value: 'total_pay',
    },
    {
      label: 'Chuyển khoản',
      value: 'total_transfer',
    },
    {
      label: 'TG tạo đơn',
      value: 'created_at',
    },
    {
      label: 'TG in đơn',
      value: 'printed_at',
    },
  ];

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

  const handleSearchByDate = (value: any) => {
    console.log('value', value);
    if (value) {
      const from = new Date(value[0]);
      const to = new Date(value[1]);
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

  const columns: ColumnsType<IsProduct> = [
    {
      title: 'Mã đơn hàng',
      width: 170,
      dataIndex: 'order_id',
      key: 'order_id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-[#384ADC] font-semibold"
          onClick={(e) => {
            record.order_id && onCoppy(e, record.order_id);
          }}
        >
          {record.order_id}
          {record.need_return_money == true && (
            <div className={classNames(styles.tag, 'mt-[4px]', styles.red_tag)}>
              Nợ khách
            </div>
          )}
        </span>
      ),
    },
    {
      title: 'Mã vận chuyển',
      width: 190,
      dataIndex: 'delivery_id',
      key: 'delivery_id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <div
          className="text-[#384ADC] font-semibold"
          onClick={(e) => {
            record.delivery_id && onCoppy(e, record.delivery_id);
          }}
        ></div>
      ),
    },
    {
      title: <span className="dragHandler">Trạng thái</span>,
      width: 170,
      dataIndex: 'order_status_id',
      key: 'order_status_id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => {
        const statusSelected = warehouseStatusColor.find(
          (item) => item.id === record.order_status_id
        );
        return (
          <div
            onClick={(e) => {
              statusSelected && onCoppy(e, OrderStatus[statusSelected.label]);
            }}
            className={styles.wrapper_status}
          >
            <div
              className={styles.popever_border}
              style={{
                backgroundColor: `${statusSelected?.value}`,
              }}
            />
            <span
              className={classNames(
                `text-[${statusSelected?.value}] z-2 font-bold`
              )}
            >
              {statusSelected && OrderStatus[statusSelected.label]}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Số lần in',
      width: 110,
      dataIndex: 'printed',
      key: 'printed',
      align: 'center',
      render: (_, record) => (
        <div
          onClick={(e) => {
            record.order_status_id && onCoppy(e, record.order_status_id);
          }}
        >
          {record.order_status_id == 7 ? 1 : 0}
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      width: 150,
      dataIndex: 'customer',
      key: 'customer',
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col items-start">
          <div
            className="text-[#384ADC] font-semibold"
            onClick={(e) => {
              get(record, 'name') && onCoppy(e, record?.name);
            }}
          >
            {get(record, 'name') ? get(record, 'name') : ''}
          </div>
          <div
            onClick={(e) => {
              get(record, 'phone') && onCoppy(e, get(record, 'phone'));
            }}
          >
            {get(record, 'phone') ? get(record, 'phone') : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ GH',
      width: 220,
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      render: (_, record: any) => {
        const fullAddress =
          get(record, 'address') +
          ', ' +
          get(record, 'ward.prefix') +
          ' ' +
          get(record, 'ward.name') +
          ', ' +
          get(record, 'district.prefix') +
          ' ' +
          get(record, 'district.name') +
          ', ' +
          get(record, 'province.name');
        return (
          <div
            className="flex flex-col items-start"
            onClick={(e) => {
              fullAddress && onCoppy(e, fullAddress);
            }}
          >
            {record.customer_id && fullAddress}
          </div>
        );
      },
    },
    // {
    //   title: "Thẻ",
    //   width: 110,
    //   dataIndex: "tags",
    //   key: "tags",
    //   align: "center",
    //   render: (_, record) => (
    //     <div className="flex flex-col items-center">--</div>
    //   ),
    // },
    {
      title: 'Giỏ hàng',
      width: 110,
      dataIndex: 'items',
      key: 'items',
      align: 'center',
      render: (_, record) => {
        const ContentItemSku = (
          <div className="td_items_skus">
            {isArray(record.order_item_skus) &&
              record.order_item_skus &&
              record.order_item_skus.map((orderItemSku, index) => {
                let inforItem = `${get(orderItemSku, 'item_sku.item.name')}`;
                isArray(get(orderItemSku, 'item_sku.item_attribute_values')) &&
                  get(orderItemSku, 'item_sku.item_attribute_values').map(
                    (itemSku: any) => {
                      inforItem += ` | ${itemSku.value}`;
                    }
                  );
                inforItem += ` x${get(orderItemSku, 'quantity')}`;
                return <p key={index}>{inforItem}</p>;
              })}
          </div>
        );
        return (
          <Popover
            className="flex flex-row items-start"
            placement="bottomLeft"
            content={ContentItemSku}
            trigger="hover"
          >
            <div>
              <span>
                {get(record, 'order_item_skus_count')
                  ? get(record, 'order_item_skus_count')
                  : 0}{' '}
                sản phẩm
              </span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'Tổng tiền SP',
      width: 150,
      dataIndex: 'total_product_cost',
      key: 'total_product_cost',
      align: 'center',
      render: (_, record: any) => (
        <div
          onClick={(e) => {
            record.total_product_cost && onCoppy(e, record.total_product_cost);
          }}
        >
          {record.total_product_cost
            ? parseFloat(record.total_product_cost).toLocaleString() + 'đ'
            : 0}
        </div>
      ),
    },
    {
      title: 'Tổng trọng lượng',
      width: 150,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (_, record: any) => {
        let weight = 0;
        isArray(record.order_item_skus) &&
          record.order_item_skus.map((item: any) => {
            weight +=
              (get(item, 'item_sku.weight') || 0) * parseFloat(item.quantity);
          });
        return <div>{weight}</div>;
      },
    },
    {
      title: 'Tiền khách đưa',
      width: 150,
      dataIndex: 'total_pay',
      key: 'total_pay',
      align: 'center',
      render: (_, record: any) => (
        <div
          onClick={(e) => {
            record.total_pay && onCoppy(e, record.total_pay);
          }}
        >
          {record.total_pay
            ? parseFloat(record.total_pay).toLocaleString() + 'đ'
            : 0}
        </div>
      ),
    },
    {
      title: 'Chuyển khoản',
      width: 150,
      dataIndex: 'total_transfer',
      key: 'total_transfer',
      align: 'center',
      render: (_, record: any) => (
        <div
          onClick={(e) => {
            record.total_transfer && onCoppy(e, record.total_transfer);
          }}
        >
          {record.total_transfer
            ? parseFloat(record.total_transfer).toLocaleString() + 'đ'
            : 0}
        </div>
      ),
    },
    {
      title: 'TG tạo đơn',
      width: 240,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col items-start">
          <div className="flex flex-row gap-x-1 text-medium text-[#1D1C2D]">
            <span>{format(new Date(record.created_at), 'HH:mm')} </span>
            <span>{format(new Date(record.created_at), 'dd/MM/yyyy')}</span>
          </div>
          <div className="text-medium font-semibold">
            {get(record, 'user') ? get(record, 'user.name') : ' '}
          </div>
        </div>
      ),
    },
    {
      title: <span className="dragHandler">TG in đơn</span>,
      width: 240,
      dataIndex: 'printed_at',
      key: 'printed_at',
      align: 'left',
      render: (_, record) => {
        const statusOrderCheckCommand = orderCheckCommandColor.find(
          (item) =>
            item.label === get(record, 'order_check_command_item.item_status')
        );
        return (
          <div className="flex flex-col items-start">
            {record.order_status_id === OrderEnumId.PRINT_OK &&
              record.printed_at && (
                <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
                  <span>
                    {format(new Date(record.printed_at), 'HH:mm')}
                    {' - '}
                    <span>
                      {format(new Date(record.printed_at), 'dd/MM/yyyy')}
                    </span>
                  </span>
                </div>
              )}
            <div className="text-medium font-semibold">
              {record.order_status_id === OrderEnumId.PRINT_OK &&
              get(record, 'user')
                ? get(record, 'user.name')
                : ' '}
            </div>
            {get(record, 'order_check_command_item.item_status') && (
              <span
                className={classNames(
                  `text-[${statusOrderCheckCommand?.value}] z-2 font-bold`
                )}
              >
                {get(record, 'order_check_command_item.item_status')}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const handleChangeTab = (e: any) => {
    if (e) {
      const tabSelect: any = orderStatus.find((item) => item.label === e);
      setFilter({
        ...filter,
        order_status_id: tabSelect.value,
      });
    } else {
      setFilter({
        ...filter,
        order_status_id: '',
      });
    }
  };

  const handleOnChangeStatus = async () => {
    setIsShowChangeStatus(false);
    console.log('selectedRowKeys', selectedRowKeys);
    if (!selectedRowKeys.length) {
      notification.error({
        message: 'Có lỗi !!!',
        description: 'Vui lòng chọn đơn hàng để cập nhật',
        placement: 'top',
      });
    }

    const data = await OrderApi.updateMany({
      arrayId: selectedRowKeys,
      order_status_id: selectStatus,
    });
    if (data.success) {
      getListOrder();
      setSelectedRowKeys([]);
      notification.success({
        message: 'Cập nhật đơn hàng thành công!',
      });
      if (selectStatus == 7) {
        selectedRowKeys.map((id) => {
          console.log('id', id);
          window.open(`/order-management/print/${id}`);
        });
      }
    } else {
      notification.error({
        message: data.message,
      });
      console.log('error');
    }
  };

  const handleDelete = async () => {
    setIsShowChangeStatus(false);
    console.log('selectedRowKeys', selectedRowKeys);
    if (!selectedRowKeys.length) {
      notification.error({
        message: 'Có lỗi !!!',
        description: 'Vui lòng chọn đơn hàng để xoá',
        placement: 'top',
      });
    }

    const data = await OrderApi.deleteMany(
      selectedRowKeys,
      window.loggedInUser
    );
    if (data.success) {
      getListOrder();
      setSelectedRowKeys([]);
      notification.success({
        message: 'Xóa đơn hàng thành công!',
      });
    } else {
      notification.error({
        message: data.message,
      });
      console.log('error');
    }
  };

  const handlePrint = async () => {
    const printFormValue = printForm.getFieldsValue();
    setIsShowChangeStatus(false);
    setIsShowPrintPopever(false);
    if (!selectedRowKeys.length) {
      notification.error({
        message: 'Có lỗi !!!',
        description: 'Vui lòng chọn đơn hàng để in!',
        placement: 'top',
      });
    }
    let existError = false;
    let newSelectedRowKeys: any[] = [];
    selectedRowKeys.map((id) => {
      const order: any = orders.find((item) => item.id == id);
      if (
        order.order_status_id == OrderEnumId.CONFIRMED ||
        order.order_status_id == OrderEnumId.STOCK_OK ||
        order.order_status_id == OrderEnumId.PRINT_WAITING ||
        order.order_status_id == OrderEnumId.PRINT_OK
      ) {
        newSelectedRowKeys.push(id);
      } else {
        existError = true;
      }
    });
    if (existError) {
      notification.error({
        message:
          'Chỉ có thể in đơn hàng có trạng thái Xác nhận, Đã in hoặc Đã đủ hàng!',
      });
    }

    if (isArray(newSelectedRowKeys)) {
      const data = await OrderApi.updateMany({
        arrayId: newSelectedRowKeys,
        order_status_id: orderStatus[6].value,
        transport_company_id: printFormValue.transport_company_id,
        transport_company_user_id: printFormValue.transport_company_user_id,
      });
      if (data.success) {
        getListOrder();
        setSelectedRowKeys([]);
        notification.success({
          message: 'In đơn thành công!',
        });
        newSelectedRowKeys.map((id) => {
          console.log('id', id);
          window.open(`/order-management/print/${id}`);
        });
      } else {
        notification.error({
          message: data.message,
        });
        console.log('error');
      }
    }
  };

  const popeverActionUpdateStatus = (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-row justify-between mb-[15px]">
        <Select
          label="Cập nhật trạng thái"
          placeholder="Chọn"
          style={{ width: 200 }}
          options={statusOrderOffline}
          onChange={(e) => setSelectStatus(e)}
        />
      </div>
      <div className="flex flex-row justify-between gap-[12px]">
        {/* <Button
          variant="danger-outlined"
          width={200}
          icon={<Icon icon="trash" size={24} color="#EF4444" />}
          onClick={() => handleDelete()}
        >
          Xóa đơn hàng
        </Button> */}
        <Button
          onClick={() => handleOnChangeStatus()}
          variant="primary"
          color="white"
          width={200}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );

  const handleRemoveNeedReturnTag = async () => {
    const data = await OrderApi.updateMany({
      arrayId: selectedRowKeys,
      remove_return_money_tag: true,
    });
    if (data.success) {
      getListOrder();
      setSelectedRowKeys([]);
      notification.success({
        message: 'Xoá thẻ nợ khách thành công!',
      });
    } else {
      notification.error({
        message: data.message,
      });
      console.log('error');
    }
  };

  const popeverPrintOrder = (
    <Form
      form={printForm}
      className="p-[16px]"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onFinish={handlePrint}
    >
      <div className="flex flex-col justify-between mb-[33px]">
        <Form.Item
          name="transport_company_id"
          rules={[
            {
              required: true,
              message: 'Đơn vị vận chuyển là bắt buộc!',
            },
          ]}
        >
          <Select
            label="Chọn đợn vị vận chuyển"
            placeholder="Chọn đơn vị vận chuyển"
            style={{ width: 293 }}
            options={transportCompanies}
            onChange={(e, item: any) =>
              setUserTransportCompanySelect(item.transport_company_users)
            }
          />
        </Form.Item>
        <Form.Item
          name="transport_company_user_id"
          rules={[
            {
              required: true,
              message: 'Tài khoản của đơn vị vận chuyển là bắt buộc!',
            },
          ]}
          className="mt-[24px]"
        >
          <Select
            label="Chọn tài khoản"
            placeholder="Chọn tài khoản"
            style={{ width: 293 }}
            options={userTransportCompanySelect}
            disabled={isArray(userTransportCompanySelect) ? false : true}
          />
        </Form.Item>
      </div>
      <div className="flex flex-row justify-between">
        <Button
          variant="danger-outlined"
          width={140}
          icon={<Icon icon="trash" size={24} color="#EF4444" />}
          onClick={() => {
            setIsShowPrintPopever(false);
          }}
        >
          Huỷ
        </Button>
        <Button variant="primary" color="white" width={140} htmlType="submit">
          In
        </Button>
      </div>
    </Form>
  );

  return (
    <div
      className="w-full list-order"
      onClick={() => {
        setIsShowChangeStatus(false);
        setIsShowPrintPopever(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-x-[24px] mb-[12px] flex-wrap gap-y-[12px]">
        <TitlePage title="Đơn hàng" />
        <div className="flex justify-center gap-[8px]">
          <Button
            variant="neural_200"
            color="white"
            width={127}
            onClick={() =>
              (window.location.href =
                '/orders/order-online/create')
            }
          >
            Online
          </Button>
          <Button
            variant="primary"
            width={127}
            onClick={() =>
              (window.location.href =
                '/orders/order-offline/create')
            }
          >
            Tại quầy
          </Button>
        </div>
        <div className="flex justify-center gap-[8px]">
          <div className="flex items-center">
            <div className="font-medium pd-[9px] mr-[12px] text-sm w-max">
              Chọn kho
            </div>
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
          <Popover
            placement="bottomLeft"
            content={popeverActionUpdateStatus}
            className="detail-customer"
            trigger="click"
            overlayStyle={{
              padding: '16px',
            }}
            open={isShowChangeStatus}
          >
            <Button
              onClick={(e) => {
                setIsShowChangeStatus(!isShowChangeStatus);
                e.stopPropagation();
              }}
              variant="outlined"
              width={148}
              icon={<Icon icon="refresh" size={24} />}
            >
              Cập nhật đơn
            </Button>
          </Popover>
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="printer" size={24} />}
            onClick={() => handleRemoveNeedReturnTag()}
          >
            Xoá nợ khách
          </Button>
          <Popover
            placement="bottomLeft"
            content={popeverPrintOrder}
            className="detail-customer"
            trigger="click"
            overlayStyle={{
              padding: '16px',
            }}
            open={isShowPrintPopever}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="printer" size={24} />}
              onClick={(e) => {
                setIsShowPrintPopever(true);
                e.stopPropagation();
              }}
            >
              In đơn
            </Button>
          </Popover>
          <CSVLink
            headers={headers}
            data={orderExport}
            filename={'don-hang.csv'}
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
      <div className="flex items-center flex-wrap gap-[8px] justify-start">
        <Input
          width={458}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nhập ID/ Tên khách hàng/SĐT/ Mã vận chuyển/ Mã sản phẩm"
          onChange={(e: any) => {
            setSearchKey(e.target.value);
          }}
        />
        {/* <Button variant="outlined" width={148}>
          Ghim tìm kiếm
        </Button> */}
        <Select
          allowClear
          showSearch
          clearIcon={<Icon icon="cancel" size={16} />}
          containerClassName={styles.wrapper_select}
          style={{ maxWidth: 306 }}
          prefix={<Icon icon="personalcard" size={24} />}
          options={listStaff}
          onChange={(e, option: any) => {
            setFilter({
              ...filter,
              created_user_id: e ? option.id : '',
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
              page: 1,
              total: 0,
              pageSize: pagination.pageSize || 10,
            });
            handleSearchByDate(value);
          }}
        />
        <Button
          variant="outlined"
          width={69}
          icon={<Icon icon="settings-1" size={24} />}
          onClick={() => setIsShowSettings(!isShowSettings)}
        />
        <div
          style={isShowSettings ? styleShowSlideToggle : styleHiddenSlideToggle}
          className={classNames(
            'w-full bg-[#FFFFFF] rounded-b',
            isShowSettings && 'my-[12px]'
          )}
        >
          <CheckboxList
            options={checkboxSettings}
            onChange={(e) =>
              setColumnSelecteted(
                e.concat(['order_id', 'delivery_id', 'phone_number'])
              )
            }
            value={columnSelecteted}
          />
        </div>
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          Số đơn hàng đang chọn:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs
        countTotal={pagination.total}
        // tabs={tabStatus}
        tabs={statusList}
        onClick={(e) => handleChangeTab(e)}
      />
      <div className="relative">
        <Table
          className="table-order"
          rowKey={(record: any) => record.id}
          loading={loading}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: e.current || 1,
              pageSize: e.pageSize || 20,
            });
          }}
          rowSelection={rowSelection}
          columns={columns.filter((e: any) => columnSelecteted.includes(e.key))}
          // dataSource={[...orders]}
          dataSource={orderList}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100, 200, 500, 1000],
          }}
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
                window.location.href = `/orders/order-offline/${record.order_id}`;
              },
            };
          }}
          scroll={{ x: 50 }}
        />
        <div className={classNames('flex items-center', styles.total_wrapper)}>
          <div className={styles.row_total}>
            Tổng tiền khách đưa:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyCOD ? totalMoneyCOD.toLocaleString() + 'đ' : '--'}
            </span>
          </div>
          <div className={styles.row_total}>
            Tổng tiền trong giỏ hàng:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyProduct
                ? totalMoneyProduct.toLocaleString() + 'đ'
                : '--'}
            </span>
          </div>
          <div className={styles.row_total}>
            Tiền chuyển khoản:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyTransfer
                ? totalMoneyTransfer.toLocaleString() + 'đ'
                : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrderOffline;
