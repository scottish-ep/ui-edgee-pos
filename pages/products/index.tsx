/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message, notification, Popover, Switch, Table } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import type { ColumnsType } from 'antd/es/table';
// import get from "lodash/get";
import { format } from 'date-fns';
import Image from 'next/image';
import Tabs from '../../components/Tabs';
import TitlePage from '../../components/TitlePage/Titlepage';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/Input';
// import DatePicker from "../../components/DateRangePicker/DateRangePicker";
import DropdownStatus from '../../components/DropdownStatus';
import { StatusColorEnum, StatusEnum, StatusList } from '../../types';
// import defaultAvatar from "../../assets/default-avatar.svg";
import classNames from 'classnames';

import styles from '../../styles/ListProduct.module.css';

import { IsProduct, ProductMetricsProps } from './product.type';
import ItemApi from '../../services/items';
import ItemCategoryApi from '../../services/item-categories';
import WarehouseApi from '../../services/warehouses';
// import { concat } from "lodash";
import DatePicker from '../../components/DatePicker/DatePicker';
import InputRangePicker from '../../components/DateRangePicker/DateRangePicker';
import { useDebounce } from 'usehooks-ts';
// import NoImage from "../../assets/no-image.svg";
import ModalConfirm from '../../components/Modal/ModalConfirm/ModalConfirm';
import { CSVLink } from 'react-csv';
import { isArray, onCoppy } from '../../utils/utils';
import ModalProductCat from './Modal/ModalProductCat';

const ListProduct = (props: any) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [items, setItems] = useState<IsProduct[]>([]);
  const [itemExport, setItemExport] = useState<any[]>([]);

  const [productTypeList, setProductTypeList] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [listDisabledId, setListDisabledId] = useState<number[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchPhrase, 1000);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [createdAtFrom, setCreatedAtFrom] = useState(null);
  const [createdAtTo, setCreatedAtTo] = useState(null);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isShowModalProductCat, setIsShowModalProductCat] = useState(true);

  const [optionPrint, setOptionPrint] = useState<any[]>([
    {
      label: 'QR Code',
      value: 'qr_code',
    },
    {
      label: 'BAR Code',
      value: 'bar_code',
    },
    {
      label: 'C??? hai',
      value: 'both',
    },
  ]);
  const [selectedOptionPrint, setSelectedOptionPrint] = useState('both');

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: pageSize,
    defaultCurrent: page,
  });
  const [metrics, getMetrics] = useState<ProductMetricsProps>({
    totalCanSell: 0,
    totalAlreadySell: 0,
    totalRemain: 0,
  });
  const [warehouses, setWarehouses] = useState([
    {
      label: 'T???t c??? kho',
      value: '',
    },
  ]);

  useEffect(() => {
    const element = document.getElementById('loading__animation');
    if (element) {
      element.remove();
    }
    getAllProducts();
  }, [
    page,
    pageSize,
    selectedCategory,
    debouncedSearchTerm,
    selectedWarehouse,
    createdAtFrom,
    createdAtTo,
  ]);

  useEffect(() => {
    getAllProductTypes();
    getProductMetrics();
    getAllWarehouses();
  }, []);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getAllProducts = async () => {
    setLoading(true);
    const { data, totalPage, totalItem } = await ItemApi.getItem({
      limit: pageSize,
      page: page,
      item_category_id: selectedCategory,
      search: debouncedSearchTerm,
      warehouse_id: selectedWarehouse,
      created_at_from: createdAtFrom,
      created_at_to: createdAtTo,
    });
    let rawItemExport = data.map((item: any) => {
      return {
        ...item,
        status_show: StatusList.find(
          (status) =>
            status.value === (item?.is_show ? item.status : StatusEnum.HIDDEN)
        )?.name,
      };
    });
    setItems(data);
    setItemExport(rawItemExport);
    setPagination({
      total: totalItem,
      pageSize: pageSize,
      defaultCurrent: page,
    });
    setLoading(false);
  };

  const getAllProductTypes = async () => {
    const { data } = await ItemCategoryApi.getItemCategory();
    const rawProductCategory = [
      {
        label: 'Ch???n',
        value: '',
        id: '',
      },
    ];
    data.map((item: any) =>
      rawProductCategory.push({
        label: item.label,
        value: item.label,
        id: item.value,
      })
    );

    setProductTypeList(rawProductCategory);
  };

  const typeList = [
    {
      label: 'Chon',
      value: 'select',
    },
    {
      label: 'Thoi trang',
      value: 'fashion',
    },
    {
      label: 'Suc khoe',
      value: 'health',
    },
  ];
  const getProductMetrics = async () => {
    const { totalCanSell, totalAlreadySell, totalRemain } =
      await ItemApi.getProductMetrics();
    getMetrics({ totalCanSell, totalAlreadySell, totalRemain });
  };

  const getAllWarehouses = async () => {
    const data = await WarehouseApi.getWarehouse();

    setWarehouses(
      warehouses.concat(
        data.map((v: any) => ({
          label: v.name,
          value: v.id,
        }))
      )
    );
  };

  const handleShowProduct = (status: any, data: any) => {
    setListDisabledId(listDisabledId.concat(data.id));
    ItemApi.updateShowItem(data.id, {
      is_show: status,
    });
    let newListDisabledId = listDisabledId.filter(
      (item: any) => item.id != data.id
    );
    setListDisabledId(newListDisabledId);
  };

  const headers = [
    { label: 'M?? s???n ph???m', key: 'code' },
    { label: 'T??n s???n ph???m', key: 'name' },
    { label: 'Danh m???c', key: 'category' },
    { label: 'T???ng nh???p', key: 'numberSale' },
    { label: 'M???u m??', key: 'models' },
    { label: 'C?? th??? b??n', key: 'numberSale' },
    { label: 'Ng??y t???o', key: 'createdAt' },
    { label: 'Tr???ng th??i', key: 'status_show' },
  ];

  const listProduct: IsProduct[] = Array(50)
    .fill({
      is_show: 'true',
      code: '1676455402',
      image: require('../../public/t-shirt.svg'),
      name: '??o thun basic cotton ',
      category: 'Th???i trang',
      numberSale: 500,
      models: 3,
      createdAt: '15/02/2023',
      status: 'CAN_SALES',
    })
    .map((item: any, index: any) => ({
      ...item,
      id: index + 1,
    }));

  const columns: ColumnsType<IsProduct> = [
    {
      title: 'Hi???n',
      width: 82,
      key: 'id',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return (
          <Switch
            disabled={listDisabledId.includes(record.id)}
            className="button-switch"
            defaultChecked={record.is_show}
            onChange={(e) => {
              record.is_show = e;
              handleShowProduct(e, record);
            }}
          />
        );
      },
    },
    {
      title: 'M?? s???n ph???m',
      width: 150,
      dataIndex: 'code',
      key: 'name',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span
          className="text-[#384ADC] font-semibold"
          onClick={(e) => {
            record.code && onCoppy(e, record.code);
          }}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: 'T??n s???n ph???m',
      width: 260,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (_, record) => (
        <div
          className="flex justify-start items-center"
          // onClick={(e) => {
          //   window.location.href = `/products/${record.id}`;
          // }}
        >
          <div className="mr-[8px] w-[40px] h-[40px] max-w-[40px] max-h-[40px] relative">
            {record.image ? (
              <Image
                className="min-w-[40px] min-h-[40px]"
                src={record.image}
                fill
                alt=""
              />
            ) : (
              // <NoImage className="w-[40px] h-[40px]" />
              <div></div>
            )}
          </div>
          <span className="font-medium">{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Danh m???c',
      width: 132,
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.category}</span>
      ),
    },
    {
      title: 'T???ng nh???p',
      width: 200,
      dataIndex: 'numberSale',
      key: 'numberSale',
      align: 'center',
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.numberSale}</span>
      ),
    },
    {
      title: 'M???u m??',
      width: 100,
      dataIndex: 'models',
      key: 'models',
      align: 'center',
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.models}</span>
      ),
    },
    {
      title: 'C?? th??? b??n',
      width: 132,
      dataIndex: 'numberSale',
      key: 'numberSale',
      align: 'center',
      render: (_, record) => (
        <span className="font-medium text-[#1D1C2D]">{record.numberSale}</span>
      ),
    },
    {
      title: 'Ng??y t???o',
      width: 132,
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (_, record) => (
        <div className="font-medium text-[#1D1C2D]">{record.createdAt}</div>
      ),
    },
    {
      title: 'Tr???ng th??i',
      width: 185,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (_, record) =>
        record?.status && (
          <span
            className={`font-semibold text-[${
              record?.is_show
                ? StatusColorEnum[record.status]
                : StatusColorEnum[StatusEnum.HIDDEN]
            }]`}
            onClick={(e) => {
              window.location.href = `/products/${record.id}`;
              setIsShowModalProductCat(true);
            }}
          >
            {
              StatusList.find(
                (status) =>
                  status.value ===
                  (record?.is_show ? record.status : StatusEnum.HIDDEN)
              )?.name
            }
          </span>
        ),
    },
  ];

  const handlePrintCode = () => {
    const arrStr = encodeURIComponent(JSON.stringify(selectedRowKeys));
    window.open(
      `/order-management/list/print-code?arrayId=` +
        arrStr +
        `&option_print=${selectedOptionPrint}`
    );
  };

  const handleConfirmDelete = async () => {
    setIsShowModalConfirm(false);
    setIsShowModalProductCat(false);
    const { data } = await ItemApi.deleteManyItems(
      selectedRowKeys
      // window.loggedInUser
    );
    if (data) {
      notification.success({
        message: 'X??a s???n ph???m th??nh c??ng',
      });
      getAllProducts();
    }
  };

  const handleChangeDates = (dates: any) => {
    if (dates) {
      setCreatedAtFrom(dates[0].format('YYYY-MM-DD'));
      setCreatedAtTo(dates[1].format('YYYY-MM-DD'));
    } else {
      setCreatedAtFrom(null);
      setCreatedAtTo(null);
    }
  };

  

  const handleChooseCodePrint = (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>Ch???n m?? code in ????n</div>
      <div className="flex flex-row justify-between">
        <Select
          width={150}
          options={optionPrint}
          value={selectedOptionPrint}
          onChange={(e) => setSelectedOptionPrint(e)}
        />
        <Button
          variant="outlined"
          width={130}
          icon={<Icon icon="printer" size={24} />}
          onClick={() => handlePrintCode()}
        >
          In
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Qu???n l?? s???n ph???m" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center"></div>
          <Popover
            placement="bottomLeft"
            content={handleChooseCodePrint}
            className="detail-customer"
            trigger="click"
            overlayStyle={{
              padding: '16px',
            }}
          >
            <Button
              variant="outlined"
              width={113}
              icon={<Icon icon="printer" size={24} />}
            >
              In m?? code
            </Button>
          </Popover>
          <CSVLink
            headers={headers}
            data={itemExport}
            filename={'san-pham.csv'}
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
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = '/products/create')}
          >
            Th??m m???i
          </Button>
          <Button
            variant="danger-outlined"
            width={153}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => setIsShowModalConfirm(true)}
          >
            X??a
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex flex-col flex-1 w-[306px]"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Nh???p m?? s???n ph???m/ T??n s???n ph???m"
          value={searchPhrase}
          onChange={(e) => {
            setSearchPhrase(e.target.value);
            setPage(1);
          }}
        />
        {/*<Button variant="outlined" width={148}>
          Ghim t??m ki???m
        </Button>*/}

        <InputRangePicker
          placeholder={['Ng??y t???o b???t ?????u', 'Ng??y t???o k???t th??c']}
          width={356}
          prevIcon={<Icon size={24} icon="calendar" />}
          onChange={(dates: any) => handleChangeDates(dates)}
        />
        <div style={{ width: 306 }}>
          <Select
            allowClear
            showSearch
            filterOption={(iv, op: any) =>
              op.value
                .toLocaleLowerCase()
                .includes((iv || '').toLocaleLowerCase())
            }
            clearIcon={<Icon icon="cancel" size={16} />}
            prefix={<Icon icon="category" size={24} color="#5F5E6B" />}
            placeholder="T??m theo danh m???c s???n ph???m"
            options={typeList}
            onChange={(e, option: any) => {
              console.log('e', e);
              console.log('option', option);
              setSelectedCategory(option.id);
            }}
          />
        </div>

        {/*<DatePicker width={306} />*/}
      </div>
      {isArray(selectedRowKeys) && (
        <div className="mb-[12px]">
          S??? s???n ph???m ??ang ch???n:{' '}
          <span className="text-[#384ADC] font-semibold">
            {selectedRowKeys.length}
          </span>
        </div>
      )}
      <div className="relative">
        <Table
          rowKey={(record: any) => record.id}
          loading={loading}
          onChange={(e) => {
            console.log('e', e);
            setPageSize(e.pageSize || 10);
            setPage(e.current || 1);
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={listProduct}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          scroll={{ x: 50 }}
        />
        <div className={classNames('flex items-center', styles.total_wrapper)}>
          <div className={styles.row}>
            C?? th??? b??n:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {/* {metrics?.totalCanSell ?? 0}  */}
              4999 ??
            </span>
          </div>
          <div className={styles.row}>
            T???ng ti???n ???? b??n:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {/* {metrics?.totalAlreadySell ?? 0}*/}
              4999 ??
            </span>
          </div>
          <div className={styles.row}>
            Ti???n h??ng c??n l???i:
            <span className="font-medium text-[#384ADC]">
              {' '}
              {/* {metrics?.totalRemain ?? 0}  */}
              4999 ??
            </span>
          </div>
        </div>
      </div>
      <ModalConfirm
        titleBody="X??a th??ng tin s???n ph???m?"
        content={
          <div className="text-center">
            M???i d??? li???u c???a s???n ph???m n??y <br />
            s??? b??? xo?? kh???i h??? th???ng
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
      <ModalProductCat
        title="Ghim t??m ki???m"
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalProductCat(false)}
        isVisible={isShowModalProductCat}
      />
    </div>
  );
};

export default ListProduct;
