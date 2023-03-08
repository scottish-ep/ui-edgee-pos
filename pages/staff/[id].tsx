import { notification, Popover, Radio, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { format } from 'date-fns';
import { omit } from 'lodash';
import get from 'lodash/get';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/Input';
import ModalRemove from '../../components/ModalRemove/ModalRemove';
import Select from '../../components/Select/Select';
import TableEmpty from '../../components/TableEmpty';
import TitlePage from '../../components/TitlePage/Titlepage';
import Upload from '../../components/Upload/Upload';
import { warehouseStatusColor } from '../../const/constant';
import { OrderStatus } from '../../enums/enums';
import ImageApi from '../../services/images';
import OrderApi from '../../services/orders';
import PermissionApi from '../../services/permission';
import StaffErrorRelationApi from '../../services/staff-error-relations';
import StaffErrorApi from '../../services/staff-errors';
import StaffGroupApi from '../../services/staff-groups';
import StaffApi from '../../services/staffs';
import TargetApi from '../../services/targets';
import WarehouseApi from '../../services/warehouses';
import styles from '../../styles/ListProduct.module.css';
import { getMin, isArray, onCoppy } from '../../utils/utils';
import { IsProduct } from '../products/product.type';
import ModalEditFault from './Modal/modal-edit-fault';
import type { IFaultDetailProps, ITartgetManageProps } from './staff.type';
const StaffDetail = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const checkValidnumber = (number: any) => {
    if (Number.isNaN(number) || Number.isFinite(number)) {
      return 0;
    }
    return number;
  };
  const columns: ColumnsType<ITartgetManageProps> = [
    {
      title: 'Tên chỉ tiêu',
      width: 117,
      dataIndex: 'name',
      align: 'center',
      render: (value, record) => {
        return <p className="text-medium font-medium">{value}Hoan thanh bai tap</p>;
      },
    },
    {
      title: 'Chỉ tiêu đơn hàng / KPI',
      width: 301,
      align: 'center',
      dataIndex: 'total_order',
      render: (_, record: any) => {
        return (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-[61%] flex items-center justify-between">
              <div className="w-[135px] h-[6px] rounded-lg relative bg-slate-200">
                <div
                  className="h-[6px] rounded-lg absolute bg-sky-500"
                  style={{
                    width: `${getMin(
                      (parseFloat(record.total_order || 0) /
                        parseFloat(record.total_order_handle || 1)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-medium font-medium text-[#0EA5E9]">
                {(parseFloat(record.total_order || 0) /
                  parseFloat(record.total_order_handle || 1)) *
                  100}
                %
              </div>
            </div>
            <div className="w-[28%] flex justify-around text-[#909098]">
              <span className="font-medium text-[#FF970D]">
                {parseFloat(record.total_order || 0)}
              </span>
              <span className="text-medium font-medium text-[#F0F0F1]">/</span>
              <span className="font-medium text-[#909098]">
                {parseFloat(record.total_order_handle || 0).toLocaleString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Chỉ tiêu doanh thu / KPI',
      width: 301,
      align: 'center',
      dataIndex: 'total_revenue',
      render: (_, record: any) => {
        return (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-[61%] flex items-center justify-between">
              <div className="w-[135px] h-[6px] rounded-lg relative bg-slate-200">
                <div
                  className="h-[6px] rounded-lg absolute bg-green-500"
                  style={{
                    width: `${getMin(
                      (parseFloat(record.total_order_price || 0) /
                        parseFloat(record.total_revenue || 1)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-medium font-medium text-[#10B981]">
                {(parseFloat(record.total_order_price || 0) /
                  parseFloat(record.total_revenue || 1)) *
                  100}
                %
              </div>
            </div>
            <div className="w-[50%] flex justify-around text-[#909098]">
              <span className="font-medium text-[#FF970D]">
                {parseFloat(record.total_order_price || 0).toLocaleString()}
              </span>
              <span className="text-medium font-medium text-[#F0F0F1]">/</span>
              <span className="font-medium text-[#909098]">
                {parseFloat(record.total_revenue || 0).toLocaleString()}
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  const columnErrorDetails: ColumnsType<IFaultDetailProps> = [
    {
      title: 'Tên lỗi',
      width: 336,
      dataIndex: 'name',
      align: 'left',
      render: (_, record) => {
        return <p className="font-medium  text-medium">{record.error.name}</p>;
      },
    },
    {
      title: 'Số lần vi phạm',
      width: 120,
      dataIndex: 'fault',
      align: 'center',
      render: (_, record) => {
        return (
          <p className="font-medium  text-medium">{record.number_violations}</p>
        );
      },
    },
    {
      title: 'Cập nhật cuối',
      width: 150,
      dataIndex: 'update',
      align: 'center',
      render: (_, record) => {
        return (
          <p className="font-normal text-medium">
            {format(new Date(record.updated_at), 'dd/MM/yyyy HH:mm')}
          </p>
        );
      },
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_, record) => {
        return (
          <div className="flex justify-between w-[60px]">
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsShowEditFault(true);
                setErrorRecord(record);
              }}
            >
              <Icon icon="edit-2" size={24} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                handleDelete(record);
              }}
            >
              <Icon icon="trash" size={24} />
            </div>
          </div>
        );
      },
    },
  ];

  const [isShowEditFault, setIsShowEditFault] = useState(false);
  const [staff, setStaff] = useState<any>({
    name: 'tester',
    phone: '010202011',
    email: 'a@gmail.com',
    sex: 'male',
    birthday: '19/02/2300',
    role_id: 1,
    staff_group_id: 2,
    warehouse_id: 3,
    is_blocked: false,
  });
  const [errorRecord, setErrorRecord] = useState<any>();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowBlockModal, setIsShowBlockModal] = useState(false);
  const [staffGroups, setStaffGroups] = useState<any[]>([]);
  const [listError, setListError] = useState<any[]>([]);
  const [staffErrors, setStaffErrors] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState([]);
  const [record, setRecord] = useState({});
  let pathNameArr = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [titleBody, setTitleBody] = useState('');
  const [content, setContent] = useState('');
  const [textButtonSubmit, setTextButtonSubmit] = useState('');
  const [colorButtonSubmit, setColorButtonSubmit] = useState<any>();
  const [roles, setRoles] = useState<any[]>([]);
  const [targets, setTagets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [total, setTotal] = useState<any>({
    order: 0,
    revenue: 0,
  });

  const getStaffDetail = async () => {
    const { data } = await StaffApi.getStaffDetail(id, {
      populate: [
        'staff_group:id,name',
        'user_role:id,name',
        'staff_errors:id,staff_id,staff_error_id,number_violations,updated_at,note',
        'staff_errors.error:id,name',
        'warehouses.warehouse:id,name',
      ],
    });
    const targetList = await TargetApi.getTargetListByStaff({
      staff_id: id,
      staff_group_id: data.staff_group_id,
    });
    let rawTotal = {
      order: 0,
      revenue: 0,
    };
    targetList.map((item: any) => {
      rawTotal.order += parseFloat(item.total_order);
      rawTotal.revenue += parseFloat(item.total_order_price);
    });
    setTagets(targetList);
    setTotal(rawTotal);
    setStaff({
      ...data,
      warehouse_id: data?.warehouses[0]?.warehouse.id,
      role_id: data?.user_role?.id,
    });
  };

  const getStaffErrorList = async () => {
    const data = await StaffErrorRelationApi.getStaffErrorRelation({
      populate: ['error'],
      staff_id: id,
    });
    setStaffErrors(data);
  };

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();

    setWarehouses(
      data?.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    );
  };

  const getAllStaffGroups = async () => {
    const data = await StaffGroupApi.getStaffGroup();

    setStaffGroups(
      data?.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    );
  };

  const getErrorList = async () => {
    const data = await StaffErrorApi.getStaffError();
    setListError(
      data?.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    );
  };

  const getRoles = async () => {
    const result = await PermissionApi.list();
    const roles = result.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setRoles(roles);
  };

  const getListOrder = async () => {
    const data = await OrderApi.getList({
      created_user_id: id,
    });
    setPagination({
      ...pagination,
      total: isArray(data) ? data.length : 0,
    });
    let rawData: any[] = [];
    isArray(data) && data.map((item: any) => {});
    setOrders(data);
  };

  useEffect(() => {
    if (id) {
      // setLoading(true);
      // getStaffDetail();
      // getStaffErrorList();
      // getListOrder();
      // setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getAllWarehouses();
    getAllStaffGroups();
    getErrorList();
    getRoles();
  }, []);

  const handleDelete = (record: any) => {
    setTitleBody('Xác nhận xóa lỗi này?');
    setErrorRecord(record);
    setIsShowDeleteModal(true);
  };

  const handleChange = (value: any, name: string) => {
    setStaff({
      ...staff,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    const data = omit(staff, [
      'staff_group',
      'warehouses',
      'id',
      'staff_errors',
      'user_role',
    ]);
    try {
      const dataReturn = await StaffApi.updateStaff(id, { ...data });
      console.log('dataReturn', dataReturn);
      if (get(dataReturn, 'data.success')) {
        notification.success({
          message: 'Cập nhật thông tin thành công',
        });
      } else {
        notification.error({
          message: get(dataReturn, 'data.message'),
        });
      }
    } catch (error: any) {
      // notification.error({
      //   message: error?.message,
      // });
    }
  };

  const handleUploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    try {
      const data = await ImageApi.upload(file);
      // setAvatar(data.url);
      handleChange(data.url, 'avatar');
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  if (loading) {
    return <div>Loading</div>;
  }

  const onSaveFault = async () => {
    try {
      if (errorRecord.id) {
        await StaffErrorRelationApi.updateStaffErrorRelation(errorRecord.id, {
          ...errorRecord,
          staff_id: id,
        });
        await getStaffErrorList();
        setIsShowEditFault(false);
        setErrorRecord(false);
        notification.success({
          message: 'Cập nhật lỗi thành công!',
        });
      } else {
        await StaffErrorRelationApi.createStaffErrorRelations({
          ...errorRecord,
          staff_id: id,
        });
        await getStaffErrorList();
        setIsShowEditFault(false);
        setErrorRecord(false);
        notification.success({
          message: 'Tạo lỗi thành công!',
        });
      }
    } catch (error: any) {
      notification.success({
        message: error.message,
      });
    }
  };

  const onComfirmDeleteStaffError = async () => {
    try {
      await StaffErrorRelationApi.deleteStaffErrorRelations(errorRecord.id);
      await getStaffErrorList();
      notification.success({
        message: 'Xóa lỗi thành công!',
      });
    } catch (error: any) {
      notification.error({
        message: error.message,
      });
    }
    return;
  };

  const handleBlockStaff = (e: any) => {
    if (e) {
      setTitleBody('Xác nhận chặn người dùng này?');
      setContent('Người dùng sẽ không thể truy cập hệ thống khi bị chặn');
      setColorButtonSubmit('danger');
      setTextButtonSubmit('Chặn');
    } else {
      setTitleBody('Xác nhận bỏ chặn người dùng này?');
      setContent('Người dùng sẽ được truy cập và thao tác trong hệ thống');
      setTextButtonSubmit('Bỏ chặn');
      setColorButtonSubmit('secondary');
    }
    handleChange(e, 'is_blocked');
    setIsShowBlockModal(true);
  };

  const colsData: IsProduct[] = Array(20)
    .fill({
      need_return_money: true,
      name: 'tester',
      phone: '01202000',
      order_item_skus: [
        {
          item_sku: {
            item: {
              name: 'Tester',
            },
            sku_code: 'XO10202',
          },
          quantity: 23,
        },
        {
          item_sku: {
            item: {
              name: 'Tester',
            },
            sku_code: 'XO10202',
          },
          quantity: 23,
        },
      ],
      order_item_skus_count: 103,
      total_product_cost: 20,
      total_order_value: 10000,
      total_transfer: 1002,
      created_at: Date.now(),
      user: {
        name: 'Test1',
      },
    })
    .map((item, index) => ({
      ...item,
      order_status_id: index++,
      order_id: index++,
    }));

  const targetData: ITartgetManageProps[] = Array(5).fill({
    value: 'Hoan thanh 10 bai tap',
    total_order: '10',
    total_order_handle: '20',
    total_order_price: '100',
    total_revenue: '2000',
  });

  const errorData: IFaultDetailProps[] = Array(5).fill({
    error: {
      name: "Di tre",
    },
    number_violations: 2,
    updated_at: Date.now(),

  })

  const orderColumns: ColumnsType<IsProduct> = [
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
      title: 'Trạng thái',
      width: 170,
      dataIndex: 'order_status_id',
      key: 'order_status_id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => {
        const statusSelected = warehouseStatusColor.find(
          (item: any) => item.id === record.order_status_id
        );
        return (
          <div
            className={classNames(
              `text-[${statusSelected?.value}] font-medium`
            )}
            onClick={(e) => {
              statusSelected && onCoppy(e, OrderStatus[statusSelected.label]);
            }}
          >
            {statusSelected && OrderStatus[statusSelected.label]}
          </div>
        );
      },
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
                const inforItem = `${get(orderItemSku, 'item_sku.item.name')} | 
                ${get(orderItemSku, 'item_sku.sku_code')} x${get(
                  orderItemSku,
                  'quantity'
                )}`;
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
      title: 'Tiền thu COD',
      width: 150,
      dataIndex: 'total_pay',
      key: 'total_pay',
      align: 'center',
      render: (_, record: any) => (
        <div
          onClick={(e) => {
            record.total_order_value - record.total_transfer &&
              onCoppy(e, record.total_order_value - record.total_transfer);
          }}
        >
          {record.total_order_value - record.total_transfer
            ? (
                record.total_order_value - record.total_transfer
              ).toLocaleString() + 'đ'
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
      render: (_, record) => (
        <div
          onClick={(e) => {
            record.total_transfer && onCoppy(e, record.total_transfer);
          }}
        >
          {record.total_transfer
            ? record.total_transfer.toLocaleString() + 'đ'
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
  ];

  const handleDirectOrder = (record: any) => {
    if (record.order_type == 1) {
      window.location.href = `/order-management/edit/order-online/${record.id}`;
      return;
    }
    window.location.href = `/order-management/edit/order-offline/${record.id}`;
    return;
  };

  return (
    <div className="w-full p-[12px] bg-gray-100 rounded-lg staff-detail">
      <TitlePage
        title="Thông tin nhân viên"
        href="/targets/list-staff"
        className="mb-[12px] "
      />
      <div className="flex justify-between mb-[12px] mt-[12px] gap-[15px]">
        <div className="flex flex-col bg-white rounded-lg p-[12px] w-4/12 h-max">
          <div className="flex justify-between mb-[12px] mb-[24px]">
            <div className="w-[72px] relative">
              <Upload
                customRequest={handleUploadImage}
                listType="picture-card"
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  if (file.type.startsWith('image')) {
                    return true;
                  }

                  return false;
                }}
              >
                {staff?.avatar ? (
                  <Image
                    src={staff.avatar}
                    alt="avatar"
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <Image
                    src={require('../../assets/big-default-avatar.svg')}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 100,
                    }}
                    alt="default-avatar"
                  />
                )}
              </Upload>
            </div>
            <div className="w-[240px] flex justify-end mb-[12px]">
              <Button
                variant="secondary"
                width={116}
                text="LƯU"
                onClick={onSubmit}
              />
            </div>
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Họ và tên</p>
            <Input
              width={285}
              onChange={(e: any) => handleChange(e.target.value, 'name')}
              value={staff?.name}
            />
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Số điện thoại</p>
            <Input
              width={285}
              value={staff?.phone}
              onChange={(e: any) => handleChange(e.target.value, 'phone')}
            />
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Email</p>
            <Input
              width={285}
              value={staff?.email}
              onChange={(e: any) => handleChange(e.target.value, 'email')}
            />
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Giới tính</p>
            <Radio.Group
              className="w-[286px]"
              value={staff?.sex}
              onChange={(e: any) => handleChange(e.target.value, 'sex')}
            >
              <div className="mr-[95px]">
                <Radio value="male">Nam</Radio>
              </div>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Sinh nhật</p>
            <Input
              width={285}
              placeholder="ngày/tháng/năm"
              value={staff?.birthday}
              onChange={(e: any) => handleChange(e.target.value, 'birthday')}
            />
          </div>
          <div className="w-full my-[24px] bg-slate-200 h-[1px]"></div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Chức vụ</p>
            <div>
              <Select
                width={285}
                value={staff?.role_id}
                options={roles}
                onChange={(e: any) => handleChange(e, 'role_id')}
              />
            </div>
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Nhóm</p>
            <div>
              <Select
                width={285}
                value={staff?.staff_group_id}
                options={staffGroups}
                onChange={(e: any) => handleChange(e, 'staff_group_id')}
              />
            </div>
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium">Trực thuộc</p>
            <div>
              <Select
                width={285}
                value={staff?.warehouse_id}
                options={warehouses}
                onChange={(e: any) => handleChange(e, 'warehouse_id')}
              />
            </div>
          </div>
          <div className="flex justify-between mb-[12px] items-center">
            <p className="text-medium font-medium text-[#EF4444]">
              Chặn nhân viên này
            </p>
            <div className="w-[285px]">
              <Switch
                checked={staff?.is_blocked}
                onChange={(e: any) => handleBlockStaff(e)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-8/12">
          <div className="bg-white rounded-lg p-[12px]">
            <p className="text-medium font-medium">Chỉ tiêu </p>
            <Table 
             columns={columns}
              //dataSource={targets} 
              dataSource={targetData}
             />
            <div className="flex justify-start my-[8px]">
              <p className="text-medoium font-medium mr-[5px]">Tổng đơn hàng</p>
              <p className="text-medoium font-medium text-[#384ADC] mr-[5px]">
                {total.order}
              </p>
              <p>|</p>
              <p className="text-medoium font-medium mx-[5px]">
                Tổng doanh thu:
              </p>
              <p className="text-medoium font-medium text-[#384ADC] mr-[5px]">
                {total.revenue.toLocaleString()} đ
              </p>
            </div>
          </div>
          <div className="bg-white flex flex-col p-[12px]">
            <div className="w-full">
              <div className="flex justify-between w-full mb-[12px] items-center">
                <p className="text-medium font-medium">Chi tiết lỗi</p>
                <Button
                  variant="outlined"
                  width={114}
                  height={45}
                  icon={<Icon icon="add-1" size={24} />}
                  text="Thêm lỗi"
                  onClick={() => setIsShowEditFault(true)}
                />
              </div>
              <Table
               columns={columnErrorDetails}
              //  dataSource={staffErrors}
              dataSource={errorData}
               />
              <ModalEditFault
                title="Thêm lỗi"
                listError={listError}
                isVisible={isShowEditFault}
                staff_id={id}
                errorRecord={errorRecord}
                setErrorRecord={setErrorRecord}
                onSaveFault={onSaveFault}
                onClose={() => {
                  setIsShowEditFault(false);
                  setErrorRecord(false);
                }}
              />
              <ModalRemove
                isVisible={isShowBlockModal}
                onClose={() => {
                  setIsShowBlockModal(false);
                  handleChange(!staff.is_blocked, 'is_blocked');
                }}
                titleBody={titleBody}
                content={content}
                onOk={onSubmit}
                textButtonSubmit={textButtonSubmit}
                colorButtonSubmit={colorButtonSubmit}
              />
              <ModalRemove
                isVisible={isShowDeleteModal}
                onClose={() => setIsShowDeleteModal(false)}
                titleBody="Xác nhận xóa lỗi này?"
                onOk={onComfirmDeleteStaffError}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <Table
          rowKey={(record: any) => record.id}
          loading={loading}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: e.current || 1,
              pageSize: e.pageSize || 10,
            });
          }}
          columns={orderColumns}
          // dataSource={[...orders]}
          dataSource={colsData}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
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
                handleDirectOrder(record);
              },
            };
          }}
          scroll={{ x: 50 }}
        />
      </div>
    </div>
  );
};
export default StaffDetail;
