import {
  Form,
  message,
  notification,
  Popover,
  Radio,
  Switch,
  Table,
  Tag,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { format } from 'date-fns';
import { get, isArray } from 'lodash';
import moment from 'moment';
import Image from 'next/image';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useRef, useState } from 'react';
// import DefaultAvatar from '../../assets/big-default-avatar.svg';
import Button from '../../components/Button/Button';
import DatePicker from '../../components/DatePicker/DatePicker';
import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/Input';
import ModalConfirm from '../../components/Modal/ModalConfirm/ModalConfirm';
import Select from '../../components/Select/Select';
import TextArea from '../../components/TextArea/TextArea';
import TitlePage from '../../components/TitlePage/Titlepage';
import { OrderEnum } from '../../enums/enums';
import CustomerTagApi from '../../services/customer-tags';
import CustomerApi from '../../services/customers';
import ImageApi from '../../services/images';
import styles from '../../styles/DetailCustomer.module.css';
import { IUser } from '../../types/users';
import { calcWithPoints, formatCustomer } from '../../utils/utils';
import ModalAddress from './ModalAddCustomer/ModalAdress';
// import YellowStart from '../../../public/images/yellow-star.svg';
import TableEmpty from '../../components/TableEmpty';
import ReviewManagementApi from '../../services/reviews';

interface DataType {
  id?: string | number;
  img?: string;
  created_at: string;
  name?: string;
  status?: string;
  order_type?: number;
  order_status?: any;
  price?: number;
  href?: string;
  total_cost: number;
  order_id: string;
  [x: string]: any;
}

interface TagProps extends CustomTagProps {
  id?: string;
}

const TagRender = (props: TagProps) => {
  const { label, value, closable, onClose, id } = props;
  const [itemList, setItemList] = useState([{ id: '10', value: 'Nhom 1' }]);
  const [name, setName] = useState<any>('');
  const onNameChange = (event: any) => {
    setName(event.target.value);
  };
  const handleAdd = (e: any) => {
    setItemList((current: any) => [
      ...current,
      { id: Math.floor(Math.random() * 10000000).toString(), value: value },
    ]);
  };
  const handleClear = () => {
    setName('');
  };
  const handleDelete = (id: string) => {
    setItemList((prevItemList) =>
      prevItemList.filter((product) => product.id !== id)
    );
  };
  const addInput = (e: any) => {
    handleAdd(e);
    handleClear();
  };

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const DetailsCustomer = (props: DataType) => {
  // const urlParams = new URLSearchParams(window.location.search);
  // const id = urlParams.get("id");
  let pathNameArr: any = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];

  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
  });
  const [listSource, setListSource] = useState<
    {
      label: string;
      value: string | number;
      id: number | string;
    }[]
  >([]);


  const [listOrder, setListOrder] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>();
  const [listAddress, setListAddress] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [noteBad, setNoteBad] = useState('');
  const [isBad, setIsBad] = useState(false);
  const [isBlock, setIsBlock] = useState(false);

  const [loading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowAddress, setIsShowAddress] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isShowModalDeleteAddress, setIsShowModalDeleteAddress] =
    useState(false);
  const [isShowModalDeleteReview, setIsShowModalDeleteReview] = useState(false);
  const [isShowModalConfirmBlock, setIsShowModalConfirmBlock] = useState(false);
  const [isShowModalConfirmReport, setIsShowModalConfirmReport] =
    useState(false);
  const [isShowEditAddress, setIsShowEditAddress] = useState(false);
  const [idAddressSelect, setIdAddessSelected] = useState(-1);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>({});
  const [listTag, setListTag] = useState<any[]>([]);

  const [totalMoneyBuy, setTotalMoneyBuy] = useState(0);
  const [order, setOrder] = useState<any>({
    PRINTED: 0,
    SUCCESSRECEIVE: 0,
    RETURNAPARTIAL: 0,
    RETURN: 0,
  });
  const [widthProgress, setWidthProgress] = useState(0);
  const [avatar, setAvatar] = useState('');

  const [reviews, setReviews] = useState<any[]>([]);
  const [currenReviewId, setCurrenReviewId] = useState<any>(-1);
  const [paginationReview, setPaginationReview] = useState({
    current: 1,
    page: 1,
    total: 0,
    pageSize: 5,
  });
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getDetailCustomers();
    getListSource();
    getListAddress();
    getListOrder();
    getListTag();

    window.addEventListener('keydown', (e) => {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 123) {
        form.submit();
        e.preventDefault();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationReview.page,
    paginationReview.pageSize,
    paginationReview.current,
  ]);

  const getReview = async () => {
    setLoadingReview(true);
    const { data, totalReviews, totalPage } = await ReviewManagementApi.list({
      customer_id: id,
    });
    let rawData: any[] = [];
    isArray(data) &&
      data.map((item: any) => {
        let name = get(item, 'item_sku.item.name');
        if (get(item, 'item_sku.item.item_category')) {
          name += ' - ' + get(item, 'item_sku.item.item_category.name');
        }
        isArray(item.item_sku.item_attribute_values) &&
          item.item_sku.item_attribute_values.map((v: any) => {
            name = name + ' - ' + v.value;
          });
        rawData.push({
          id: item.id,
          name: name,
          star: item.star,
          is_show: item.is_show,
          images: item.images,
          content: item.content,
          tags: item.tags,
          user: item.user,
          created_at: item.created_at,
        });
      });
    setReviews(rawData);
    setPagination({
      ...pagination,
      total: totalReviews,
    });
    setLoadingReview(false);
  };

  const getListSource = () => {
    const url = '/api/v2/customer-sources/list';
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        const newListSource = isArray(result)
          ? result.map((item: IUser) => ({
              label: item.name,
              value: item.id,
              id: item.id,
            }))
          : [];
        setListSource(newListSource);
      })
      .catch((error) => console.log(error));
  };

  const getListTag = async () => {
    const data = await CustomerTagApi.list();
    if (data) {
      const rawListTag = isArray(data)
        ? data.map((item) => ({
            label: item.label,
            value: item.id,
            id: item.id,
          }))
        : [];
      setListTag(rawListTag);
    }
  };

  const getListAddress = () => {
    if (id) {
      const url =
        '/api/v2/customer-addresses/list?' +
        new URLSearchParams({
          customer_id: id,
        });
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const result = get(res, 'data.data');
          const rawProvinces = get(res, 'data.provinces').map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawDistricts = get(res, 'data.districts').map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawWards = get(res, 'data.wards').map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawAddresses = get(res, 'data.data').map((item: any) => {
            const itemProvince = rawProvinces.find(
              (province: any) => province.id == item.province_id
            );
            const itemDistrict = rawDistricts.find(
              (district: any) => district.id == item.district_id
            );
            const itemWard = rawWards.find(
              (ward: any) => ward.id == item.ward_id
            );
            const fullAddress =
              item.address +
              ', ' +
              itemWard.prefix +
              ' ' +
              itemWard.name +
              ', ' +
              itemDistrict.prefix +
              ' ' +
              itemDistrict.name +
              ' ' +
              itemProvince.name;
            return {
              ...item,
              full_address: fullAddress,
            };
          });
          setListAddress(rawAddresses);
          setProvinces(rawProvinces);
          setDistricts(rawDistricts);
          setWards(rawWards);
        })
        .catch((error) => console.log(error));
    }
  };

  const getListOrder = () => {
    if (id) {
      const url =
        '/api/v2/orders/list?' +
        new URLSearchParams({
          customer_id: id,
        });
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const result = res.data;
          let rawTotalMoney = 0;
          let printed_order_number = 0;
          let received_order_number = 0;
          let refunded_order_number = 0;
          let partial_refund_order_number = 0;

          result.map((item: any) => {
            if (
              [OrderEnum.PICKUP_RECEIVED, OrderEnum.RETURN_PARTIAL].includes(
                item.order_status?.name_en
              )
            ) {
              rawTotalMoney = rawTotalMoney + parseInt(item.total_cost);
            }

            if (item.order_status?.name_en == OrderEnum.PRINT_OK) {
              printed_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.PICKUP_RECEIVED) {
              received_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.PICKUP_RETURNED) {
              refunded_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.RETURN_PARTIAL) {
              partial_refund_order_number += 1;
            }
          });
          setOrder({
            PRINTED: printed_order_number,
            SUCCESSRECEIVE: received_order_number,
            RETURNAPARTIAL: refunded_order_number,
            RETURN: partial_refund_order_number,
          });
          setTotalMoneyBuy(rawTotalMoney);
          setListOrder(result);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const getDetailCustomers = () => {
    const url = `/api/v2/customers/detail/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let result = formatCustomer(res.data);
        let resultfake = {
          id: 3,
          name: 'thuhoai884@gmail.com',
          phone_number: null,
          email: 'thuhoai884@gmail.com',
          sex: null,
          status_tag: null,
          type_id: null,
          note: null,
          class_id: null,
          address: null,
          ward_id: null,
          created_at: '2022-10-19T07:59:05.000000Z',
          updated_at: '2022-11-09T04:44:17.000000Z',
          city_id: null,
          district_id: null,
          avatar: null,
          facebook_user_id: null,
          customer_level_id: 1,
          birthday: '1970-01-01',
          users_id: 4,
          is_taken_by: 467,
          source_id: null,
          age_id: null,
          age: null,
          company_id: 1,
          points: '0',
          deleted_at: null,
          is_block: 0,
          note_block: null,
          is_bad: false,
          note_bad: null,
          customer_tag_id: null,
          customer_id: null,
          is_in_app: true,
          percent_return: '0',
          create_user: null,
          user: {
            id: 4,
            name: 'thuhoai884@gmail.com',
            email: 'thuhoai884@gmail.com',
            verified_at: null,
            created_at: '2022-10-19T07:59:05.000000Z',
            updated_at: '2022-10-19T07:59:05.000000Z',
            avatar: null,
            otp: 223153,
            phone: '',
            customer_id: 3,
            deleted_at: null,
            role_id: null,
            warehouse_ids: null,
            staff_group_id: 1,
            staff_code: null,
            birthday: null,
            sex: null,
            address: null,
            is_blocked: false,
          },
          customer_level: {
            id: 1,
            name: 'Kh??ch h??ng m???i',
            note: 'User m???i t???o account tr??n App v?? ch??a c?? l???ch s??? mua h??ng',
            created_at: '2022-08-12T03:00:03.000000Z',
            updated_at: '2022-08-12T03:00:06.000000Z',
            icon: 'https://bach-hoa-viet.s3.ap-southeast-1.amazonaws.com/j5RCp7SPGi0OqSF7yHuC5znbV5wG9J10d9rdP36a.svg',
            company_id: 1,
            from: '0',
            to: '0',
            color: '#384ADC',
          },
          customer_tag_relations: [],
        };
        setCustomer(result);
        setCustomer(1000);
        setAvatar(result.avatar);
        setIsBlock(result.is_block || false);
        setIsBad(result.is_bad || false);
        setNote(result.note);
        setNoteBad(result.note_bad);
        if (result.points && result.points > 0) {
          let rawWidth = calcWithPoints(result.points);
          setWidthProgress(rawWidth);
        }
        result.birthday = result.birthday
          ? moment(new Date(result.birthday))
          : null;

        console.log('result', result);
        form.setFieldsValue(result);
        if (!result?.source_id && result.is_in_app == true) {
          form.setFieldValue('source_id', 1);
        }
      })
      .catch((error) => console.log(error));
  };

  const renderLevel = (points: any) => {
    if (parseFloat(points) == 0) {
      return <div className="font-semibold text-[#0EA5E9]">KH m???i</div>;
    } else if (parseFloat(points) <= 100) {
      return <div className="font-semibold text-[#F97316]">?????ng</div>;
    } else if (parseFloat(points) <= 500) {
      return <div className="font-semibold text-[#909098]">B???c</div>;
    } else if (parseFloat(points) <= 1000) {
      return <div className="font-semibold text-[#EAB308]">V??ng</div>;
    } else if (parseFloat(points) <= 2000) {
      return <div className="font-semibold text-[#8B5CF6]">Kim c????ng</div>;
    } else if (parseFloat(points) > 2000) {
      return <div className="font-semibold text-[#5B6B95]">B???ch kim</div>;
    }
  };

  const renderOrderWarning = () => {
    const orders = listOrder.filter(
      (item) =>
        ![
          OrderEnum.PICKUP_RECEIVED,
          OrderEnum.RETURN_PARTIAL,
          OrderEnum.PICKUP_RETURNED,
          OrderEnum.CANCELLED,
          OrderEnum.DELETED,
        ].includes(item.order_status?.name_en)
    );

    if (orders.length > 0) {
      return (
        <div className="font-semibold text-red-500">
          Kh??ch h??ng n??y c?? {orders.length} ????n ??? tr???ng th??i ch??a ho??n th??nh
        </div>
      );
    } else {
      return '';
    }
  };
  const columnsData: DataType[] = Array(4).fill({
    order_id: 1,
    created_at: Date.now(),
    total_cost: 10000,
    order_item_sku: [],
    order_status: {
      is_online: true,
      name: "Test"
    },
  });
  const columns: ColumnsType<DataType> = [
    {
      title: 'M?? ????n h??ng',
      width: 150,
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <div className="cursor-pointer text-[#384ADC] font-medium text-medium">
          {record.order_id}
        </div>
      ),
    },
    {
      title: 'Th???i gian t???o',
      width: 190,
      dataIndex: 'time',
      key: 'time',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <div className="font-medium text-medium">
          <span>{format(new Date(record.created_at), 'HH:mm')} - </span>
          <span>{format(new Date(record.created_at), 'dd/MM/yyyy')}</span>
        </div>
      ),
    },
    // {
    //   title: "S???n ph???m",
    //   width: 246,
    //   dataIndex: "name",
    //   key: "name",
    //   align: "left",
    //   render: (_, record) => (
    //     <div className="font-medium text-medium">
    //       {
    //         // record.name
    //       }
    //     </div>
    //   ),
    // },
    {
      title: 'Gi?? tr??? ????n h??ng',
      width: 200,
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      render: (_, record) => (
        <div className="font-medium text-medium">
          {record.total_cost ? record.total_cost.toLocaleString() : 0} ??
        </div>
      ),
    },
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
              <span>{record?.order_item_skus?.length} s???n ph???m</span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'K??nh b??n',
      width: 200,
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
      render: (_, record) => (
        <div className="font-medium text-medium">
          {record?.order_status?.is_online ? 'Online' : 'T???i qu???y'}
        </div>
      ),
    },
    {
      title: 'Tr???ng th??i',
      width: 160,
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      render: (_, record) => (
        <div className="text-[#8B5CF6] font-medium text-medium">
          {record.order_status?.name}
        </div>
      ),
    },
  ];

  const popeverActionAddress = (
    <div className="w-[148px] flex flex-col detail-customer">
      <div
        className="w-full flex justify-start mb-[8px] cursor-pointer"
        onClick={() => {
          setIsShowEditAddress(true);
          setIdAddessSelected(-1);
        }}
      >
        <Icon icon="edit-2" size={24} />
        <p className="text-medium font-medium ml-[5px]">Ch???nh s???a</p>
      </div>
      <div
        className="cursor-pointer w-full flex justify-start"
        onClick={() => {
          setIsShowModalDeleteAddress(true);
          setIdAddessSelected(-1);
        }}
      >
        <Icon icon="trash" size={24} />
        <p className="text-medium font-medium ml-[5px] text-[#EF4444]">
          X??a ?????a ch???
        </p>
      </div>
    </div>
  );

  const fakeReview = Array(3).fill({
    created_at: Date.now(),
    name: 'Test',
    star: 1,
    images: [
      {
        item: require('../../public/yellow-star.svg'),
      },
    ],
    is_show: 0,
    id: 1,
  });

  const reviewColumns: ColumnsType<any> = [
    {
      title: 'TH???I GIAN',
      width: 150,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          <span>{format(new Date(record.created_at), 'HH:mm')}</span>
          <span>{format(new Date(record.created_at), 'dd/MM/yyyy')}</span>
        </div>
      ),
    },
    {
      title: 'SP ????NH GI??',
      width: 200,
      dataIndex: 'user',
      key: 'user',
      align: 'left',
      render: (_, record: any) => <div>{record.name}</div>,
    },
    {
      title: '????NH GI??',
      width: 100,
      dataIndex: 'start',
      key: 'start',
      align: 'left',
      render: (_, record: any) => (
        <div className="flex items-center gap-[4px]">
          {record.star}
          <span>
            {/* <Image src={'../../public/yellowstart.svg'} fill alt="" /> */}
          </span>
        </div>
      ),
    },
    {
      title: 'CHI TI???T',
      width: 210,
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      render: (_, record: any) => {
        return (
          <div>
            <div className="mb-[8px]">{record.content}</div>
            <div className="flex flex-wrap gap-[8px] mb-[8px]">
              {isArray(record.images) &&
                record.images.map((item: any, index: any) => {
                  return (
                    <Image
                      key={index}
                      src={item}
                      alt="image"
                      style={{ width: 71, height: 71 }}
                    />
                  );
                })}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {isArray(record.tags) &&
                record.tags.map((tag: any, index: any) => {
                  return (
                    <div className={styles.tag} key={index}>
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      },
    },
    {
      title: 'TR???NG TH??I',
      width: 100,
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      render: (_, record: any) => (
        <div
          className="font-semibold text-[#384ADC] cursor-pointer"
          onClick={() => {
            console.log('record', record);
          }}
        >
          {record.is_show == 0 ? 'Hi???n' : '???n'}
        </div>
      ),
    },
    {
      title: 'THAO T??C',
      width: 170,
      dataIndex: 'action',
      key: 'action',
      align: 'left',
      render: (_, record) => (
        <div
          className="cursor-pointer w-full flex justify-start"
          onClick={() => {
            setIsShowModalDeleteReview(true);
            setCurrenReviewId(record.id);
          }}
        >
          <Icon icon="trash" size={24} />
          <p className="text-medium font-medium ml-[5px] text-[#EF4444]">X??a</p>
        </div>
      ),
    },
  ];

  const deleteReview = async () => {
    setIsShowModalDeleteReview(false);
    setLoadingReview(true);
    const data = await ReviewManagementApi.deleteReview(currenReviewId);
    if (data) {
      notification.success({
        message: 'Xo?? ????nh gi?? th??nh c??ng!',
      });
      const newReviews = reviews.filter(
        (review) => review.id != currenReviewId
      );
      setReviews(newReviews);
    } else {
      notification.success({
        message: 'Xo?? ????nh gi?? th???t b???i!',
      });
    }
    setLoadingReview(false);
    setCurrenReviewId(-1);
  };

  const handleSubmit = (data: any) => {
    const url = `/api/v2/customers/update/${id}`;
    const body = {
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      birthday: data.birthday,
      sex: data.sex,
      source_id: data.source_id,
      customer_tags: data.customer_tags,
      avatar: avatar,
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
            message: 'C???p nh???t kh??ch h??ng th??nh c??ng!',
          });
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
  };

  const handleDeleteCustomer = () => {
    console.log('delete');
    const url = `/api/v2/customers/delete/${id}`;
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log('data return', data);
        if (data.success) {
          notification.success({
            message: 'X??a th??nh c??ng!',
          });
          window.location.href = '/customer/customer-list';
        } else {
          notification.error({
            message: data.message,
          });
          console.log('error');
        }
      });
    // setIsShowModalNotice(true);
  };

  const handleBlockUser = (checked: any, event: any) => {
    console.log(
      '???? ~ file: DetailCustomer.tsx:536 ~ handleBlockUser ~ checked',
      checked
    );
    if (!checked) {
      if (isBad) {
        message.error('B???n ph???i b??? b??o x???u tr?????c khi b??? ch???n!');
        return null;
      }
    }
    setIsShowModalConfirmBlock(true);
  };

  const handleReportUser = (checked: any, event: any) => {
    setIsShowModalConfirmReport(true);
  };

  const handleBlock = () => {
    const url = `/api/v2/customers/update/${id}`;
    const body = {
      is_block: !isBlock ? 1 : 0,
      note: note,
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
        setIsBlock(!isBlock);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsShowModalConfirmBlock(false);
  };

  const handleReport = () => {
    const url = `/api/v2/customers/update/${id}`;
    let body: any = {
      is_bad: !isBad,
      note_bad: noteBad,
    };
    if (!isBad == true) {
      setIsBlock(true);
      body = {
        ...body,
        is_block: 1,
      };
    }

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log('data return', data);
        setIsBad(!isBad);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsShowModalConfirmReport(false);
  };

  const createCustomerAddress = async (data: any) => {
    const response = await CustomerApi.createAddress({
      ...data,
      customer_id: id,
      is_default: false,
    });
    if (response) {
      const itemProvince = provinces.find(
        (province) => province.id == data.province_id
      );
      const itemDistrict = districts.find(
        (district) => district.id == data.district_id
      );
      const itemWard = wards.find((ward) => ward.id == data.ward_id);
      const fullAddress =
        data.address +
        ', ' +
        itemWard.prefix +
        ' ' +
        itemWard.name +
        ', ' +
        itemDistrict.prefix +
        ' ' +
        itemDistrict.name +
        ' ' +
        itemProvince.name;
      setListAddress(
        listAddress.concat({
          ...data,
          id: response.id,
          full_address: fullAddress,
        })
      );
    }
  };

  const deleteCustomerAddress = async () => {
    const result = await CustomerApi.deleteAddress(selectedAddress.id);
    if (result) {
      const newListAddress = listAddress.filter(
        (item) => item.id != selectedAddress.id
      );
      setListAddress(newListAddress);
      setSelectedAddress({});
      setIsShowModalDeleteAddress(false);
      notification.success({
        message: 'X??a ?????a ch??? th??nh c??ng !',
      });
    }
  };

  const updateAddress = async (data: any) => {
    const result = await CustomerApi.updateAddress(selectedAddress.id, data);
    if (result) {
      let newListAddress = listAddress;
      const indexSelected = listAddress.findIndex(
        (item) => item.id === selectedAddress.id
      );
      const itemProvince = provinces.find(
        (province) => province.id == data.province_id
      );
      const itemDistrict = districts.find(
        (district) => district.id == data.district_id
      );
      const itemWard = wards.find((ward) => ward.id == data.ward_id);
      const fullAddress =
        data.address +
        ', ' +
        itemWard.prefix +
        ' ' +
        itemWard.name +
        ', ' +
        itemDistrict.prefix +
        ' ' +
        itemDistrict.name +
        ' ' +
        itemProvince.name;
      newListAddress[indexSelected] = {
        ...data,
        id: selectedAddress.id,
        full_address: fullAddress,
      };
      setListAddress(newListAddress);
      setSelectedAddress({});
      setIsShowEditAddress(false);
      notification.success({
        message: 'C???p nh???t ?????a ch??? th??nh c??ng!',
      });
    }
  };

  const data = {
    name: 'tran Huyen',
    phone_number: "0854634162",
    email: "tran@gmail.com",
    date: "",
    sex: "Nam",
    list: [
     {
      label: "Test 1",
      value: "test-1",
      id: "1"
     },
     {
      label: "test 2",
      value: "test2",
      id: "2"
     }
    ]
  };

  const handleUploadImage = async (options: any) => {
    const { file } = options;

    try {
      const data = await ImageApi.upload(file);
      setAvatar(data.url);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={data}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-[32px]">
        <TitlePage href="/customers" title="Kh??ch h??ng" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="danger-outlined"
            width={113}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => {
              setIsShowModalConfirm(true);
            }}
          >
            X??a KH
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            variant="secondary"
            width={187}
          >
            L??U (F12)
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between gap-[12px]">
          <div className="flex flex-col flex-1">
            <div
              className={styles.table}
              style={{ marginBottom: 0, height: '100%' }}
            >
              <div className={styles.row}>
                <div className={styles.row_label}>???nh ?????i di???n</div>
                <div className="flex flex-1">
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
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="avatar"
                        style={{
                          width: 75,
                          height: 75,
                          borderRadius: 100,
                        }}
                      />
                    ) : (
                      // <DefaultAvatar />
                      <div className="rounded-[50%] overflow-hidden">
                        <Image
                          src={require('../../public/yellow-star.svg')}
                          width={75}
                          height={75}
                          alt=""
                        />
                      </div>
                    )}
                  </Upload>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>
                  H??? v?? t??n <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'H??? v?? t??n l?? b???t bu???c!',
                    },
                  ]}
                >
                  <Input width="100%" value={data.name} />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>
                  S??? ??i???n tho???i <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: 'S??? ??i???n tho???i l?? b???t bu???c!',
                    },
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      message: 'S??? ??i???n tho???i kh??ng h???p l???',
                    },
                  ]}
                >
                  <Input type="phone-number" width="100%" value={data.phone_number} />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Gi???i t??nh</div>
                <div className="flex flex-1">
                  <div style={{ width: 296 }}>
                    <Form.Item name="sex">
                      <Radio.Group defaultValue={data.sex}>
                        <div className="mr-[95px]">
                          <Radio value="Male">Nam</Radio>
                        </div>
                        <Radio value="Female">N???</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Sinh nh???t</div>
                <Form.Item className="flex flex-1" name="birthday">
                  <DatePicker width="100%" placeholder="Ng??y/th??ng/n??m" />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Email</div>
                <Form.Item
                  className="flex flex-1"
                  name="email"
                  rules={[
                    {
                      pattern: new RegExp(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      ),
                      message: '?????a ch??? email kh??ng h???p l???',
                    },
                  ]}
                >
                  <Input type="email" width="100%" placeholder="Nh???p email" value={data.email}/>
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Ch???n ngu???n</div>
                <Form.Item className="flex flex-1" name="source_id">
                  <Select
                    placeholder="Ch???n ngu???n"
                    style={{ width: '100%' }}
                    // options={listSource}
                    options={data.list}
                  />
                </Form.Item>
              </div>
              <div className={classNames(styles.row, 'mt-[24px]')}>
                <div className={styles.row_label}>Ng?????i t???o</div>
                <div className="flex flex-1 flex-row">
                  <div className="text-medium font-medium max-w-max mr-[5px]  ">
                    Tran Huyen
                    {get(customer, 'create_user.name')}
                  </div>
                  <div className="text-medium font-normal">
                    {get(customer, 'created_at') && (
                      <div>
                        {format(
                          new Date(get(customer, 'created_at')),
                          'dd/MM/yyyy'
                        )}
                        -
                        <span>
                          {format(
                            new Date(
                              get(customer, 'created_at') ||
                                get(customer, 'user.created_at')
                            ),
                            'HH:mm'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div
                  className={classNames(
                    'text-[#4B4B59] font-semibold mb-[6px]',
                    styles.row_label
                  )}
                >
                  <span className="ml-[8px]">Th???</span>
                </div>
                <Form.Item className="flex flex-1" name="customer_tags">
                  <Select
                    options={listTag}
                    placeholder="Ch???n lo???i kh??ch h??ng"
                    mode="multiple"
                    style={{ width: '100%' }}
                    // tokenSeparators={[","]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className={styles.table}>
              <div
                className="flex items-center justify-between pt-[17px] mb-[12px] mb-[31px]"
                style={{ width: '85%' }}
              >
                <div className="text-medium font-medium">C???p ????? kh??ch h??ng</div>
                <div className="text-medium font-semibold max-w-max text-[#EAB308]">
                  {renderLevel(get(customer, 'points'))}
                </div>
                <div className="text-medium font-semibold">
                  ({get(customer, 'points')} ??i???m)
                </div>
              </div>
              <div className="mb-[21px]" style={{ height: 41 }}>
                <div className={styles.point_level}>
                  <div
                    className={styles.bg_point}
                    style={{
                      width: `${widthProgress}%`,
                    }}
                  />
                  <div
                    className={classNames(
                      'font-semibold text-[#0EA5E9]',
                      styles.new_level
                    )}
                  >
                    KH m???i
                  </div>
                  <div
                    className={classNames(
                      'font-semibold text-[#F97316]',
                      styles.brozen_level
                    )}
                  >
                    ?????ng
                  </div>
                  <div
                    className={classNames(
                      'font-semibold text-[#909098]',
                      styles.silver_level
                    )}
                  >
                    B???c
                  </div>
                  <div
                    className={classNames(
                      'font-semibold text-[#EAB308]',
                      styles.gold_level
                    )}
                  >
                    V??ng
                  </div>
                  <div
                    className={classNames(
                      'font-semibold text-[#8B5CF6]',
                      styles.diomand_level
                    )}
                  >
                    Kim c????ng
                  </div>
                  <div
                    className={classNames(
                      'font-semibold text-[#5B6B95]',
                      styles.platinum_level
                    )}
                  >
                    B???ch kim
                  </div>
                  <div
                    className={classNames(
                      styles.new_level,
                      styles.dots,
                      styles.new_level,
                      get(customer, 'points')
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.brozen_level,
                      styles.dots,
                      get(customer, 'points') > 0
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.silver_level,
                      styles.dots,
                      get(customer, 'points') > 100
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.gold_level,
                      styles.dots,
                      get(customer, 'points') > 500
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.diomand_level,
                      styles.dots,
                      get(customer, 'points') > 1000
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.platinum_level,
                      styles.dots,
                      get(customer, 'points') > 2000
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center mb-[12px] mb-[31px]">
                <div className={styles.row_left_table}>
                  T???ng ti???n h??ng ???? mua
                </div>
                <div className={styles.row_left}>
                  {totalMoneyBuy.toLocaleString()} ?? 1000 ??
                </div>
              </div>
              <div className="flex flex-row mb-[25px]">
                <div className={styles.order_printed} />
                <div className={styles.order_receive} />
                <div className={styles.order_return} />
                <div className={styles.order_return_part} />
              </div>
              <div className="flex flex-row justify-between mb-[20px]">
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, 'bg-[#6366F1]')} />
                  <div>
                    ???? in{' '}
                    <span className="text-[#6366F1] font-semibold">
                      {' '}
                      {order.PRINTED}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, 'bg-[#10B981]')} />
                  <div>
                    ???? nh???n{' '}
                    <span className="text-[#10B981] font-semibold">
                      {' '}
                      {order.SUCCESSRECEIVE}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, 'bg-[#F97316]')} />
                  <div>
                    ???? ho??n{' '}
                    <span className="text-[#F97316] font-semibold">
                      {' '}
                      {order.RETURNAPARTIAL}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, 'bg-[#EAB308]')} />
                  <div>
                    Ho??n 1 ph???n{' '}
                    <span className="text-[#EAB308] font-semibold">
                      {' '}
                      {order.RETURN}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-[12px] mb-[31px]">
                <div className={styles.row_left_table}>T???ng s??? ????n h??ng</div>
                <div className={styles.row_left}>{listOrder.length}</div>
              </div>
              <div className="flex flex-row justify-start">
                <div className={styles.row_left_table}>Ti???n n??? kh??ch</div>
                <div className="w-1/2">
                  <div className="font-semibold">
                    0 ??{' '}
                    <span
                      className="ml-[8px] cursor-pointer text-medium font-medium text-[#384ADC]"
                      onClick={() =>
                        (window.location.href = '/debts/Modall/ModalDebtDetail')
                      }
                    >
                      Xem chi ti???t
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(styles.table, 'flex flex-row gap-[12px]')}
            >
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-[12px]">
                  <div
                    className="text-medium font-medium "
                    style={{ width: '80%', maxWidth: 243, height: 30 }}
                  >
                    {!isBlock ? (
                      <span>Ch???n kh??ch h??ng n??y?</span>
                    ) : (
                      <div className="rounded-[4px] bg-[#EF4444] h-[30px] text-[#FFF] flex flex-1 justify-center items-center font-medium text-medium">
                        <Icon icon="danger-1" size={16} className="mr-[5px]" />
                        Kh??ch h??ng b??? ch???n online
                      </div>
                    )}
                  </div>
                  <Switch
                    className="button-switch"
                    checked={isBlock}
                    onChange={(checked, event) =>
                      handleBlockUser(checked, event)
                    }
                  />
                </div>
                {/*bughere*/}
                {/* <TextArea
                  rows={4}
                  value={note}
                  onChange={(e: any) => setNote(e.target.value)}
                >
                  Nh???p ghi ch??
                </TextArea> */}
              </div>
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-[12px]">
                  <div
                    className="text-medium font-medium"
                    style={{ height: 30, width: '70%', maxWidth: 170 }}
                  >
                    {!isBad ? (
                      <span>B??o x???u kh??ch h??ng n??y?</span>
                    ) : (
                      <div className="rounded-[4px] bg-[#8B5CF6] h-[30px] text-[#FFF] flex justify-center items-center font-medium text-medium">
                        Kh??ch h??ng x???u
                      </div>
                    )}
                  </div>
                  <Switch
                    className="button-switch"
                    checked={isBad}
                    onChange={(checked, event) =>
                      handleReportUser(checked, event)
                    }
                  />
                </div>
                {/*bughere*/}
                {/* <TextArea
                  rows={4}
                  value={noteBad}
                  onChange={(e: any) => setNoteBad(e.target.value)}
                >
                  Nh???p ghi ch??
                </TextArea> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-[12px]">
          <div style={{ width: 500 }}>
            <div className={styles.table}>
              <div className="flex justify-between w-full">
                <p className="text-medium font-medium mb-[12px]">
                  ?????a ch??? nh???n h??ng
                </p>
                <p
                  className="text-medium font-medium text-[#384ADC] cursor-pointer"
                  onClick={() => {
                    setIsEdit(false);
                    setIsShowAddress(true);
                  }}
                >
                  Th??m m???i
                </p>
              </div>

              {isArray(listAddress) &&
                listAddress.map((item, index) => (
                  <div className={styles.address} key={index}>
                    <div className="flex w-full justify-between">
                      <div className="flex gap-[12px]">
                        <div className="text-medium font-medium">
                          {item.full_name}
                        </div>
                        <div>|</div>
                        <div className="text-medium font-medium">
                          {item.phone_number}
                        </div>
                      </div>
                      <div>
                        <Popover
                          placement="bottomLeft"
                          content={popeverActionAddress}
                          className="detail-customer"
                          trigger="click"
                          overlayStyle={{
                            width: '160px',
                            padding: '0px',
                          }}
                          open={idAddressSelect == item.id}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                            }}
                            className="flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              setIsEdit(true);
                              setSelectedAddress(item);
                              setIdAddessSelected(
                                idAddressSelect == item.id ? -1 : item.id
                              );
                            }}
                          >
                            <Icon icon="toolbar" color="black" size={24} />
                          </div>
                        </Popover>
                      </div>
                    </div>
                    <div>{item.full_address}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-1">
            <Table
              columns={columns}
              // dataSource={[...listOrder]}
              dataSource={columnsData}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10],
              }}
              // loading={loading}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (record.order_type === 1) {
                      window.open(
                        `/order-management/edit/order-online/${record.id}`,
                        '_blank'
                      );
                    } else if (record.order_type === 2) {
                      window.open(
                        `/order-management/edit/order-offline/${record.id}`,
                        '_blank'
                      );
                    } else if (record.order_type === 3) {
                      window.open(
                        `/order-management/edit/order-in-app/${record.id}`,
                        '_blank'
                      );
                    }
                  },
                };
              }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-[12px]">
          <div className={styles.table}>
            <Table
              loading={loadingReview}
              columns={reviewColumns}
              // dataSource={[...reviews]}
              dataSource={fakeReview}
              locale={
                !loadingReview
                  ? {
                      emptyText: <TableEmpty />,
                    }
                  : { emptyText: <></> }
              }
              scroll={{ x: 50 }}
              pagination={{
                current: paginationReview.current,
                total: paginationReview.total,
                defaultPageSize: paginationReview.pageSize,
                showSizeChanger: true,
                pageSizeOptions: [5, 10],
              }}
              onChange={(e) => {
                setPaginationReview({
                  ...pagination,
                  current: e.current || 1,
                  page: e.current || 1,
                  pageSize: e.pageSize || 5,
                });
              }}
            />
          </div>
        </div>
      </div>
      <ModalAddress
        provinces={provinces}
        districts={districts}
        wards={wards}
        title="?????a ch??? nh???n h??ng"
        isEdit={isEdit}
        isVisible={isShowAddress}
        onClose={() => setIsShowAddress(false)}
        onOpen={(data) => {
          createCustomerAddress(data);
          setIsShowAddress(false);
        }}
      />
      {/* Modal update Address */}
      <ModalAddress
        provinces={provinces}
        districts={districts}
        wards={wards}
        title="?????a ch??? nh???n h??ng"
        isEdit={isEdit}
        data={selectedAddress}
        isVisible={isShowEditAddress}
        onClose={() => setIsShowEditAddress(false)}
        onOpen={(data) => {
          updateAddress(data);
          setIsShowEditAddress(false);
        }}
      />
      {/* Modal delete customer */}
      <ModalConfirm
        titleBody="X??a th??ng tin kh??ch h??ng?"
        content={
          <div className="text-center">
            M???i d??? li???u c???a kh??ch h??ng n??y <br />
            s??? b??? xo?? kh???i h??? th???ng.
            <br />
            {renderOrderWarning()}
          </div>
        }
        onOpen={handleDeleteCustomer}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
      {/* Modal delete address customer */}
      <ModalConfirm
        titleBody="X??a ?????a ch??? kh??ch h??ng?"
        onOpen={deleteCustomerAddress}
        onClose={() => setIsShowModalDeleteAddress(false)}
        isVisible={isShowModalDeleteAddress}
      />
      <ModalConfirm
        titleBody="X??a ????nh gi?? kh??ch h??ng?"
        onOpen={deleteReview}
        onClose={() => setIsShowModalDeleteReview(false)}
        isVisible={isShowModalDeleteReview}
      />
      <ModalConfirm
        titleConfirm={isBlock ? 'B??? ch???n' : 'Ch???n'}
        titleBody={isBlock ? 'B??? ch???n kh??ch h??ng?' : 'Ch???n kh??ch h??ng?'}
        content={
          <div>
            <div className="text-center mb-[12px]">
              B???n c?? ch???c ch???n mu???n {isBlock ? 'b??? ch???n' : 'ch???n'} kh??ch h??ng
              n??y kh??ng?
            </div>
            <TextArea
              rows={4}
              onChange={(e: any) => setNote(e.target.value)}
              value={note}
            >
              Nh???p ghi ch??
            </TextArea>
          </div>
        }
        onOpen={() => handleBlock()}
        onClose={() => setIsShowModalConfirmBlock(false)}
        isVisible={isShowModalConfirmBlock}
      />
      <ModalConfirm
        titleConfirm={isBad ? 'B??? b??o x???u' : 'B??o x???u'}
        titleBody={isBad ? 'B??? b??o x???u kh??ch h??ng?' : 'B??o x???u kh??ch h??ng?'}
        content={
          <div>
            <div className="text-center mb-[12px]">
              B???n c?? ch???c ch???n mu???n {isBad ? 'b??? b??o x???u' : 'b??o x???u'} kh??ch
              h??ng n??y kh??ng?
            </div>
            <TextArea
              rows={4}
              onChange={(e: any) => setNoteBad(e.target.value)}
              value={noteBad}
            >
              Nh???p ghi ch??
            </TextArea>
          </div>
        }
        onOpen={() => handleReport()}
        onClose={() => setIsShowModalConfirmReport(false)}
        isVisible={isShowModalConfirmReport}
      />
    </Form>
  );
};

export default DetailsCustomer;
