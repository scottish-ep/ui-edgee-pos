/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useDebounce } from 'usehooks-ts';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { statusList } from '../../../utils/utils';
import { orderList } from '../../../utils/utils';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import Tabs from '../../../components/Tabs';
import TitlePage from '../../../components/TitlePage/Titlepage';
import {
  orderCheckCommandColor,
  orderStatus,
  warehouses,
  warehouseStatusColor,
} from '../../../const/constant';
import styles from '../../../styles/DetailCustomer.module.css';
import { StatusEnum } from '../../../types';
import { OrderEnum, OrderEnumId, OrderStatus } from '../../../enums/enums';
import InputRangePicker from '../../../components/DateRangePicker/DateRangePicker';
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

const ListOrderInApp = () => {
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

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getListStaff();
    getListTransportCompany();
  }, []);

  const statusOrderInApp = [
    {
      label: 'T???o m???i',
      value: 1,
      is_show_order_list: true,
      index: 0,
    },
    {
      label: 'Ch??? ????? h??ng',
      value: 4,
      is_show_order_list: true,
      index: 1,
    },
    {
      label: 'Ch??? x??? l??',
      value: 3,
      is_show_order_list: true,
      index: 1,
    },
    {
      label: '???? ????? h??ng',
      value: 5,
      is_show_order_list: true,
      index: 2,
    },
    {
      label: '???? x??? l??',
      value: 6,
      is_show_order_list: true,
      index: 2,
    },
    {
      label: 'X??c nh???n',
      value: 2,
      is_show_order_list: true,
      index: 3,
    },
    {
      label: '???? in',
      value: 7,
      is_show_order_list: true,
      index: 4,
    },
    {
      label: '??ang giao',
      value: 8,
      is_show_order_list: true,
      index: 5,
    },
    {
      label: '???? nh???n',
      value: 9,
      is_show_order_list: true,
      index: 6,
    },
    {
      label: '??ang ho??n',
      value: 10,
      is_show_order_list: true,
      index: 7,
    },
    {
      label: 'Ho??n 1 ph???n',
      value: 11,
      is_show_order_list: true,
      index: 8,
    },
    {
      label: 'Ho??n to??n b???',
      value: 12,
      is_show_order_list: true,
      index: 9,
    },
    {
      label: 'Hu???',
      value: 14,
      is_show_order_list: true,
      index: 10,
    },
  ];

  useEffect(() => {
    getListOrder();
  }, [filter, debouncedSearchTerm, pagination.page, pagination.pageSize]);

  const getListStaff = async () => {
    const result = await UserApi.getListStaff();
    const newListStaff = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.name,
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

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'M?? ????n h??ng', key: 'order_id' },
    { label: 'M?? v???n chuy???n', key: 'delivery_id' },
    { label: 'Tr???ng th??i', key: 'status_name' },
    { label: 'S??? l???n in', key: 'number_printed' },
    { label: 'T??n Kh??ch h??ng', key: 'customer_name' },
    { label: '?????a ch???', key: 'address_full' },
    { label: 'T???ng ti???n s???n ph???m', key: 'total_product_cost' },
    { label: 'T???ng kh???i l?????ng', key: 'weight' },
    { label: 'Ti???n thu COD', key: 'total_cod' },
    { label: 'Ti???n chuy???n kho???n', key: 'total_transfer' },
    { label: 'Th???i gian t???o', key: 'created_at_order' },
    { label: 'Ng?????i t???o', key: 'user_create' },
    { label: 'Th???i gian in ????n', key: 'printed_order_at' },
  ];

  const getListOrder = async () => {
    setLoading(true);
    const data = await OrderApi.getOrderInApp({
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
        total_cod: item.total_order_value - item.total_transfer,
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
    console.log('.raw', rawStatus);
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
      label: 'Tr???ng th??i',
      value: 'order_status_id',
    },
    {
      label: 'S??? l???n in',
      value: 'printed',
    },
    {
      label: 'Kh??ch h??ng',
      value: 'customer',
    },
    {
      label: '?????a ch??? GH',
      value: 'address',
    },
    {
      label: 'Th???',
      value: 'tags',
    },
    {
      label: 'Gi??? h??ng',
      value: 'items',
    },
    {
      label: 'T???ng ti???n SP',
      value: 'total_product_cost',
    },
    {
      label: 'T???ng ti???n COD',
      value: 'total_pay',
    },
    {
      label: 'Chuy???n kho???n',
      value: 'total_transfer',
    },
    {
      label: 'TG t???o ????n',
      value: 'created_at',
    },
    {
      label: 'TG in ????n',
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

  // export const data: IsProduct[] = Array(50)
  //   .fill({
  //     delivery_code: 1123,
  //     order_status_id: 7,
  //     name: 'Tester',
  //     phone: '08527271',
  //     total_product_cost: 10000,
  //     total_pay: 10000,
  //     total_cost: 10000,
  //     total_transfer: 10000,
  //     created_at: Date.now(),
  //     user: {
  //       name: 'test',
  //     },
  //     address: '2 Hoang Thi Loan',
  //     ward: {
  //       prefix: 'Phuong',
  //       name: ' 10',
  //     },
  //     district: {
  //       prefix: 'Quan',
  //       name: '9',
  //     },
  //     province: {
  //       name: 'Sai Gon',
  //     },
  //     order_check_command_item: {
  //       item_status: 'Ch??a ?????i so??t',
  //     },
  //     order_item_skus: [
  //       {
  //         item_sku: {
  //           item: {
  //             name: 'test',
  //           },
  //           weight: 13,
  //           item_attribute_values: [
  //             {
  //               value: 13,
  //             },
  //           ],
  //         },
  //         quantity: 13,
  //       },
  //     ],
  //   })
  //   .map((item, index) => ({ ...item, order_id: `${index++}` }));

  const columns: ColumnsType<IsProduct> = [
    {
      title: 'M?? ????n h??ng',
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
              N??? kh??ch
            </div>
          )}
        </span>
      ),
    },
    {
      title: 'M?? v???n chuy???n',
      width: 190,
      dataIndex: 'delivery_id',
      key: 'delivery_id',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div
            className="text-[#384ADC] font-semibold"
            onClick={(e) => {
              record.delivery_code && onCoppy(e, record.delivery_code);
            }}
          >
            {record.delivery_code}
          </div>
        );
      },
    },
    {
      title: <span className="dragHandler">Tr???ng th??i</span>,
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
      title: 'S??? l???n in',
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
      title: 'Kh??ch h??ng',
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
            onClick={(e: any) => {
              get(record, 'phone') && onCoppy(e, record?.phone);
            }}
          >
            {get(record, 'phone') ? get(record, 'phone') : ''}
          </div>
        </div>
      ),
    },
    {
      title: '?????a ch??? GH',
      width: 220,
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      render: (_, record) => {
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
            {fullAddress}
          </div>
        );
      },
    },
    // {
    //   title: "Th???",
    //   width: 110,
    //   dataIndex: "tags",
    //   key: "tags",
    //   align: "center",
    //   render: (_, record) => (
    //     <div className="flex flex-col items-center">--</div>
    //   ),
    // },
    {
      title: 'Gi??? h??ng',
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
                s???n ph???m
              </span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'T???ng ti???n SP',
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
            ? parseFloat(record.total_product_cost).toLocaleString() + '??'
            : 0}
        </div>
      ),
    },
    {
      title: 'T???ng tr???ng l?????ng',
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
      title: 'Ti???n thu COD',
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
          {record.payment_method_id == 2
            ? parseFloat(record.total_cost)?.toLocaleString() + '??'
            : 0}
        </div>
      ),
    },
    {
      title: 'Chuy???n kho???n',
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
            ? parseFloat(record.total_transfer).toLocaleString() + '??'
            : 0}
        </div>
      ),
    },
    {
      title: 'TG t???o ????n',
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
      title: <span className="dragHandler">TG in ????n</span>,
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
        message: 'C?? l???i !!!',
        description: 'Vui l??ng ch???n ????n h??ng ????? c???p nh???t',
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
        message: 'C???p nh???t ????n h??ng th??nh c??ng!',
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
        message: 'C?? l???i !!!',
        description: 'Vui l??ng ch???n ????n h??ng ????? xo??',
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
        message: 'X??a ????n h??ng th??nh c??ng!',
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
        message: 'C?? l???i !!!',
        description: 'Vui l??ng ch???n ????n h??ng ????? in!',
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
          'Ch??? c?? th??? in ????n h??ng c?? tr???ng th??i X??c nh???n, ???? in ho???c ???? ????? h??ng!',
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
          message: 'In ????n th??nh c??ng!',
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
          label="C???p nh???t tr???ng th??i"
          placeholder="Ch???n"
          style={{ width: 200 }}
          options={statusOrderInApp}
          onChange={(e) => setSelectStatus(e)}
        />
      </div>
      <div className="flex flex-row justify-between gap-[12px]">
        {/* <Button
          variant="danger-outlined"
          width={150}
          icon={<Icon icon="trash" size={24} color="#EF4444" />}
          onClick={() => handleDelete()}
        >
          X??a ????n h??ng
        </Button> */}
        <Button
          onClick={() => handleOnChangeStatus()}
          variant="primary"
          color="white"
          width={200}
        >
          C???p nh???t
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
        message: 'Xo?? th??? n??? kh??ch th??nh c??ng!',
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
              message: '????n v??? v???n chuy???n l?? b???t bu???c!',
            },
          ]}
        >
          <Select
            label="Ch???n ?????n v??? v???n chuy???n"
            placeholder="Ch???n ????n v??? v???n chuy???n"
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
              message: 'T??i kho???n c???a ????n v??? v???n chuy???n l?? b???t bu???c!',
            },
          ]}
          className="mt-[24px]"
        >
          <Select
            label="Ch???n t??i kho???n"
            placeholder="Ch???n t??i kho???n"
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
          Hu???
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
      <div className="flex flex-wrap justify-between gap-x-[24px] mb-[12px] flex-wrap gap-y-[12px]">
        <TitlePage title="????n h??ng" />
        <div className="flex justify-center gap-[8px]">
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
              C???p nh???t ????n
            </Button>
          </Popover>
          <Button
            variant="outlined"
            width={113}
            icon={<Icon icon="printer" size={24} />}
            onClick={() => handleRemoveNeedReturnTag()}
          >
            Xo?? n??? kh??ch
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
              In ????n
            </Button>
          </Popover>
          <CSVLink
            headers={headers}
            data={orderExport}
            filename={'don-hang.csv'}
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
      <div className="flex items-center flex-wrap gap-[8px] justify-start">
        <Input
          width={458}
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nh???p ID/ T??n kh??ch h??ng/S??T/ M?? v???n chuy???n/ M?? s???n ph???m"
          onChange={(e: any) => {
            setSearchKey(e.target.value);
          }}
        />
        {/* <Button variant="outlined" width={148}>
          Ghim t??m ki???m
        </Button> */}
        <InputRangePicker
          placeholder={['Ng??y b???t ?????u', 'Ng??y k???t th??c']}
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
          S??? ????n h??ng ??ang ch???n:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <Tabs
        countTotal={pagination.total}
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
                window.location.href = `/orders/order-in-app/${record.order_id}`;
              },
            };
          }}
          scroll={{ x: 50 }}
        />
        <div className={classNames('flex items-center', styles.total_wrapper)}>
          <div className={styles.row_total}>
            T???ng COD:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyCOD ? totalMoneyCOD.toLocaleString() + '??' : '--'}
            </span>
          </div>
          <div className={styles.row_total}>
            T???ng ti???n trong gi??? h??ng:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyProduct
                ? totalMoneyProduct.toLocaleString() + '??'
                : '--'}
            </span>
          </div>
          <div className={styles.row_total}>
            Ti???n chuy???n kho???n:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {totalMoneyTransfer
                ? totalMoneyTransfer.toLocaleString() + '??'
                : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrderInApp;
