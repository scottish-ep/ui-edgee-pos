/* eslint-disable react-hooks/exhaustive-deps */
import { Form, notification, Spin } from 'antd';
import { format } from 'date-fns';
import { itemSkuList } from '../../../../const/constant';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import Button from '../../../../components/Button/Button';
import Icon from '../../../../components/Icon/Icon';
import Select from '../../../../components/Select/Select';
import TextArea from '../../../../components/TextArea';
import TitlePage from '../../../../components/TitlePage/Titlepage';
import { warehouseStatusOption } from '../../../../const/constant';
import { CommandStatusEnum } from '../../../../enums/enums';
import ItemSkuApi from '../../../../services/item-skus';
import UserApi from '../../../../services/users';
import WarehouseTransferCommandApi from '../../../../services/warehouse-transfer-command';
import WarehouseApi from '../../../../services/warehouses';
import { IUser } from '../../../../types/users';
import { isArray } from '../../../../utils/utils';
import { IWareHousesDetail } from '../../warehouse.type';
import TransferWareHouseFormTable from './TransferWareHouseFormTable';

interface TransferWareHouseFormProps {
  detail?: IWareHousesDetail;
  listItemSku?: any[];
}

declare global {
  interface Window {
    loggedInUser: string;
  }
}

const TransferWareHouseForm: React.FC<TransferWareHouseFormProps> = ({
  detail,
  listItemSku,
}) => {
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [listStaff, setListStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemSkus, setItemSkus] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [listItemSkuInWarehouse, setListItemSkuInWarehouse] = useState<any[]>(
    []
  );
  const [selectedExportWarehouse, setSelectedExportWarehouse] = useState<any>();
  const [selectedImportWarehouse, setSelectedImportWarehouse] = useState<any>();

  const [form] = Form.useForm();
  const from_warehouse_id = Form.useWatch('from_warehouse_id', form);
  const to_warehouse_id = Form.useWatch('to_warehouse_id', form);
  let selectedUser = '';

  useEffect(() => {
    selectedUser = window.loggedInUser;
    console.log('type', typeof selectedUser);
  });

  useEffect(() => {
    if (from_warehouse_id) {
      setSelectedExportWarehouse(
        warehouseManagement.find((v) => v.id === from_warehouse_id)
      );
      getListItemSku();
    }
  }, [from_warehouse_id]);

  useEffect(() => {
    if (to_warehouse_id) {
      setSelectedImportWarehouse(
        warehouseManagement.find((v) => v.id === to_warehouse_id)
      );
    }
  }, [to_warehouse_id]);

  useEffect(() => {
    if (detail) {
      form.setFieldsValue(detail);
    } else {
      form.setFieldValue('created_user_id', parseInt(selectedUser));
    }
    listItemSku && setItemSkus(listItemSku);
  }, [detail, listItemSku]);

  useEffect(() => {
    setLoading(true);
    getListStaff();
    getListWarehouse();
    setLoading(false);
  }, []);

  const warehouseManagementList = [
    {
      value: '123',
      label: 'Kho t???ng Linh D????ng',
    },
    {
      value: '99',
      label: 'Kho Mai Linh',
    },
  ];

  const staffList = [
    {
      label: 'Nam',
      value: '123',
      id: '123',
    },
    {
      label: 'Nam',
      value: '123',
      id: '123',
    },
  ];
  const getListWarehouse = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setWareHouseManagement(listWarehouse);
  };

  const getListStaff = async () => {
    setLoading(true);
    const result = await UserApi.getListStaff();
    const newListStaff = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.id,
          id: item.id,
        }))
      : [];
    setListStaff(newListStaff);
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    if (!data.created_user_id) {
      notification.error({
        message: 'Vui l??ng ch???n nh??n vi??n x??? l??!',
      });
      setLoading(false);
      return;
    }
    if (!from_warehouse_id) {
      notification.error({
        message: 'Vui l??ng ch???n kho chuy???n!',
      });
      setLoading(false);
      return;
    }

    if (!to_warehouse_id) {
      notification.error({
        message: 'Vui l??ng ch???n kho nh???p!',
      });
      setLoading(false);
      return;
    }

    if (from_warehouse_id === to_warehouse_id) {
      notification.error({
        message: 'Kho chuy???n v?? kho nh???p ph???i kh??c nhau!',
      });
      setLoading(false);
      return;
    }

    if (itemSkus.length === 0) {
      notification.error({
        message: 'Tr?????ng s???n ph???m l?? b???t bu???c ????? t???o phi???u chuy???n kho!',
      });
      setLoading(false);
      return;
    }

    for (let item of itemSkus) {
      if (item.quantity_transfer > item.warehouse_item.quantity) {
        notification.error({
          message:
            'Kh??ng th??? nh???p s??? l?????ng s???n ph???m v?????t qu?? s??? l?????ng c?? th??? chuy???n!',
        });
        setLoading(false);
        return;
      }
      if (!item.quantity_transfer || item.quantity_transfer === 0) {
        notification.error({
          message: 'Kh??ng th??? ????? tr???ng s??? l?????ng chuy???n!',
        });
        setLoading(false);
        return;
      }
    }

    if (!detail) {
      const result = await WarehouseTransferCommandApi.createTransferCommand({
        transferCommand: {
          ...data,
          to_warehouse_id,
          from_warehouse_id,
          status: data.status ? data.status : CommandStatusEnum.CREATED,
        },
        transferCommandItems: itemSkus,
      });
      if (result) {
        notification.success({
          message: 'Th??m phi???u chuy???n kho th??nh c??ng!',
        });
      }
      window.location.href = `/warehouses/transfer-ho/update/${result.id}`;
      setLoading(false);
    } else {
      const result = await WarehouseTransferCommandApi.updateTransferCommand(
        {
          transferCommand: {
            ...data,
            command_id: detail.id,
          },
          transferCommandItems: itemSkus,
        },
        detail.id
      );
      if (result.success) {
        notification.success({
          message: 'C???p nh???t phi???u chuy???n kho th??nh c??ng!',
        });
      } else {
        notification.error({
          message: 'C???p nh???t phi???u chuy???n kho th??nh c??ng!',
        });
      }
      setLoading(false);
    }
  };

  // Hanle Item sku
  const getListItemSku = async () => {
    setLoading(true);
    const data: any = await ItemSkuApi.getItemSku({
      warehouse_id: from_warehouse_id,
    });
    setItemSkus(listItemSku || []);
    const itemIds = listItemSku?.map((v) => v.id);
    const listItemSkus =
      isArray(data.data) &&
      data.data.filter((item: any) => !itemIds?.includes(item.id));
    const formatListItemSkus = listItemSkus.map((item: any) => {
      if (!itemIds?.includes(item.id)) {
        return {
          ...item,
          label: item.name,
          value: item.id + item.name,
          warehouse_item: item?.warehouse_item
            ? {
                ...item?.warehouse_item,
              }
            : {
                quantity: 0,
              },
        };
      }
    });
    setListItemSkuInWarehouse(formatListItemSkus);
    setLoading(false);
  };

  const handleDeleteProduct = (id: string | number) => {
    setItemSkus((prevProductList) =>
      prevProductList.filter((product) => product.id !== id)
    );
  };

  const handleChangeValue = (
    id: string | number,
    key: string,
    value: string
  ) => {
    setItemSkus((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === id) {
          return { ...product, [key]: Number(value) };
        }

        return product;
      })
    );
  };

  const handleAddProduct = (item: any) => {
    const newItem = {
      ...item,
      quantity_transfer: null,
      weight_transfer: null,
    };
    setItemSkus(itemSkus.concat(newItem));
  };

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <TitlePage
          href="/warehouse/transfer-commands"
          title={detail ? 'Chi ti???t phi???u chuy???n kho' : 'T???o phi???u chuy???n kho'}
        />
        <div className="flex gap-x-2">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Tr???ng th??i</div>
            <Form.Item name="status">
              <Select
                // disabled={detail?.status === "CREATED" ? false : true}
                placeholder="Ch???n tr???ng th??i"
                style={{ width: 162 }}
                options={
                  !detail
                    ? warehouseStatusOption.filter(
                        (item) => item.value !== CommandStatusEnum.CANCELED
                      )
                    : warehouseStatusOption
                }
                loading={loading}
                defaultValue={CommandStatusEnum.CREATED}
              />
            </Form.Item>
          </div>
          <Button
            variant="secondary"
            width={148}
            style={{ fontWeight: 'bold' }}
            onClick={() => form.submit()}
            // loading={loading}
          >
            L??U (F12)
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex gap-x-3">
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              M?? chuy???n kho:
            </span>
            <span className="text-medium font-medium text-[#2E2D3D]">
              {detail?.code || '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              Th???i ??i???m t???o:
            </span>
            <span className="text-mediu(m font-medium text-[#2E2D3D]">
              {detail?.created_at
                ? format(new Date(detail.created_at), 'dd/MM/yyyy')
                : '-'}
            </span>
          </div>
          <Form.Item name="created_user_id">
            <Select
              label="Nh??n vi??n x??? l??"
              placeholder="Ch???n nh??n vi??n x??? l??"
              // options={listStaff}
              options={staffList}
              loading={loading}
              // value={parseInt(selectedUser)}
              disabled
            />
          </Form.Item>
          <Form.Item name="note">
            <TextArea
              label="Ghi ch??"
              className="!h-[179px]"
              placeholder="Nh???p ghi ch??"
            />
          </Form.Item>
        </div>
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <Form.Item name="from_warehouse_id">
            <Select
              disabled={detail ? true : false}
              label="Ch???n kho chuy???n"
              placeholder="Ch???n kho chuy???n"
              // options={warehouseManagement}
              options={warehouseManagementList}
              loading={loading}
            />
          </Form.Item>
          <div className="flex flex-col justify-between gap-y-1 p-2 bg-[#F5F5F6] border border-[#DADADD] rounded h-[82px]">
            <div className="flex gap-x-3">
              <span className="text-[#1D1C2D] text-medium font-semibold">
                {selectedExportWarehouse?.name || '--'}
                Kho t???ng Linh D????ng
              </span>
              <span className="border border-[#DADADD]"></span>
              <span className="text-[#1D1C2D] text-medium font-semibold">
                {selectedExportWarehouse?.phone_number || '--'}
                0987.987.456
              </span>
            </div>
            <p className="text-[#4B4B59] text-medium">
              S??? nh?? 40, ???????ng Ph???m Quang L???ch, t??? 21, ph?????ng Ti???n Phong, th??nh
              ph??? Th??i B??nh, Th??i B??nh
              {selectedExportWarehouse && selectedExportWarehouse.address
                ? `${selectedExportWarehouse?.address}, ${selectedExportWarehouse?.ward_info?.prefix} ${selectedExportWarehouse?.ward_info?.name}, ${selectedExportWarehouse?.district_info?.prefix} ${selectedExportWarehouse?.district_info?.name}, ${selectedExportWarehouse?.district_info?.name}`
                : '--'}
            </p>
          </div>
          <Form.Item name="to_warehouse_id">
            <Select
              label="Ch???n kho nh???p"
              placeholder="Ch???n kho nh???p"
              // options={warehouseManagement}
              options={warehouseManagementList}
              loading={loading}
            />
          </Form.Item>
          <div className="flex flex-col justify-between gap-y-1 p-2 bg-[#F5F5F6] border border-[#DADADD] rounded h-[82px]">
            <div className="flex gap-x-3">
              <span className="text-[#1D1C2D] text-medium font-semibold">
                {selectedImportWarehouse?.name || '--'}
                Kho t???ng Linh D????ng
              </span>
              <span className="border border-[#DADADD]"></span>
              <span className="text-[#1D1C2D] text-medium font-semibold">
                {selectedImportWarehouse?.phone_number || '--'}
                0987.987.456
              </span>
            </div>
            <p className="text-[#4B4B59] text-medium">
              S??? nh?? 40, ???????ng Ph???m Quang L???ch, t??? 21, ph?????ng Ti???n Phong, th??nh
              ph??? Th??i B??nh, Th??i B??nh
              {selectedImportWarehouse && selectedImportWarehouse.address
                ? `${selectedImportWarehouse?.address}, ${selectedImportWarehouse?.ward_info?.prefix} ${selectedImportWarehouse?.ward_info?.name}, ${selectedImportWarehouse?.district_info?.prefix} ${selectedImportWarehouse?.district_info?.name}, ${selectedImportWarehouse?.district_info?.name}`
                : '--'}
            </p>
          </div>
        </div>
      </div>
      {/* Filter */}
      <div className="flex gap-x-2 mt-4 mb-3">
        <Select
          showSearch
          onChange={(e, value) => handleAddProduct(value)}
          clearIcon={<Icon icon="cancel" size={16} />}
          prefix={<Icon icon="personalcard" size={24} />}
          options={listItemSkuInWarehouse}
          placeholder="Nh???p m?? s???n ph???m / t??n s???n ph???m"
          loading={loading}
        />
        <Button
          variant="neural_200"
          width={196}
          icon={<Icon icon="barcode" size={24} />}
        >
          Qu??t m?? v???ch (F1)
        </Button>
      </div>
      {/* Table */}
      <TransferWareHouseFormTable
        handleChangeValue={(id, key, value) =>
          handleChangeValue(id, key, value)
        }
        loading={loading}
        itemSkus={itemSkuList}
        handleDeleteProduct={(id) => handleDeleteProduct(id)}
      />
    </Form>
  );
};

export default TransferWareHouseForm;
