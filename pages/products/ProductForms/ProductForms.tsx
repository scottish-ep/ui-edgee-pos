/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import ModalConfirm from '../../../components/Modal/ModalConfirm/ModalConfirm';
import { Popover } from 'antd';
import Select from '../../../components/Select/Select';
import TextArea from '../../../components/TextArea';
import DatePicker from '../../../components/DatePicker/DatePicker';
import TitlePage from '../../../components/TitlePage/Titlepage';
import Upload from '../../../components/Upload/Upload';
import type { ColumnsType } from 'antd/es/table';
import styles from '../../../styles/DetailCustomer.module.css';
import type {
  ProductAttributeProps,
  ProductDetailProps,
} from '../product.type';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Checkbox, Switch, Tag } from 'antd';
import CheckboxList from '../../../components/CheckboxList/CheckboxList';
import classNames from 'classnames';
import { Table, notification } from 'antd';
interface ProductFormProps {
  detail?: any;
  loading?: boolean;
  type_attr_list?: ProductAttributeProps[];
}
import { Form } from 'antd';
import ItemApi from '../../../services/items';
import ItemCategoryApi from '../../../services/item-categories';
import ItemSupplierApi from '../../../services/item-suppliers';
import ItemAttributeApi from '../../../services/item-attributes';
import ItemAttributeValueApi from '../../../services/item-attribute-values';
import WarehouseApi from '../../../services/warehouses';
import ImageApi from '../../../services/images';
import { isArray } from '../../../utils/utils';
import TextEditor from '../../../components/TextEditor/TextEditor';
import ItemSkuApi from '../../../services/item-skus';
import WarehouseTransferApi from '../../../services/warehouse-transfer-command';
import { get } from 'lodash';
import { format } from 'node:path/win32';
import WarehouseImportCommandApi from '../../../services/warehouse-import';
import CurrencyInput from 'react-currency-input-field';
import InputCurrency from '../../../components/InputCurrency/Input';

declare global {
  interface Window {
    // ?????? notice that "Window" is capitalized here
    loggedInUser: string;
  }
}

const ProductForms: React.FC<ProductFormProps> = ({
  detail,
  loading = false,
  type_attr_list = [],
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOnApp, setIsOnApp] = useState(false);
  const [isSamePrice, setIsSamePrice] = useState(false);
  const [productTypeList, setProductTypeList] = useState([]);
  const [productAttributes, setProductAttributes] = useState<any[]>([]);
  const [productSuppliers, setProductSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([
    {
      label: 'T???t c??? kho',
      value: '',
    },
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState([
    {
      label: 'T???t c??? kho',
      value: '',
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemAttributes, setItemAttributes] = useState<any[]>([]);
  const [selectedItemAttributes, setSelectedItemAttributes] = useState<any[]>(
    []
  );
  const [newItemAttributeCode, setNewItemAttributeCode] = useState<string>('');
  const [newItemAttributeValue, setNewItemAttributeValue] =
    useState<string>('');
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [saleOffline, setSaleOffline] = useState(false);
  const [saleOnline, setSaleOnline] = useState(false);
  const [saleInApp, setSaleInApp] = useState(false);
  const [disabledTransfer, setDisableTransfer] = useState(false);
  const [searchAttribute, setSearchAttribute] = useState('');
  const [searchAttributeValue, setSearchAttributeValue] = useState('');
  const [fileTemp, setFileTemp] = useState<any>();

  const [form] = Form.useForm();
  const [syncForm] = Form.useForm();
  const [transferForm] = Form.useForm();
  const channels = Form.useWatch('channels', form);
  const [priceChannel, setPriceChannel] = useState<any>({
    ONLINE: 0,
    OFFLINE: 0,
    IN_APP: 0,
  });

  useEffect(() => {
    getAllProductAttributes();
    getAllWarehouses();
    getAllProductTypes();
    getAllProductSuppliers();

    window.addEventListener('keydown', (e) => {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 123) {
        form.submit();
        e.preventDefault();
      }
    });
  }, []);

  useEffect(() => {
    if (detail) {
      isArray(detail.item_skus) && setCombinations(detail.item_skus);
      if (detail.manufactured_date) {
        detail.manufactured_date = moment(detail.manufactured_date);
      }
      if (detail.expired_date) {
        detail.expired_date = moment(detail.expired_date);
      }
      if (
        detail.item_warehouse_relations &&
        detail.item_warehouse_relations.length
      ) {
        detail.warehouse_id = detail.item_warehouse_relations.map(
          (v: any) => v.warehouse_id
        );
      }
      if (detail.channels && detail.channels.length) {
        setIsOnApp(detail.channels.indexOf('IN_APP') == -1 ? false : true);
      }
      form.setFieldsValue(detail);
      setIsSamePrice(detail.same_price_channel);
      getDetailAttributes();

      if (detail.images && detail.images.length) {
        const list: any = detail.images.map((v: any) => ({
          url: v,
        }));
        setFileList(list);
      }
    } else {
      form.setFieldsValue({
        warehouse_id: selectedWarehouse,
      });
    }
  }, [detail]);

  const getAllProductTypes = async () => {
    const { data } = await ItemCategoryApi.getItemCategory();
    setProductTypeList(data);
    const selected = data.filter(
      (v: any) => v.value === detail?.item_category_id
    );
    setSelectedCategory(selected?.length ? selected[0] : null);
  };

  const getAllProductAttributes = async () => {
    const { data } = await ItemAttributeApi.getItemAttribute();
    const rawAttributes = data.map((item: any) => ({
      label: item.label,
      value: item.label,
      id: item.value,
    }));
    setProductAttributes(rawAttributes);
  };

  const getAllProductSuppliers = async () => {
    const { data } = await ItemSupplierApi.getItemSupplier();
    setProductSuppliers(data);
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

  const getDetailAttributes = async () => {
    const { data } = await ItemAttributeApi.getItemAttributeDetailByItem(
      detail.id
    );
    setItemAttributes(data.attributes);
    if (isArray(data.attributes)) {
    }
    setSelectedItemAttributes(data.selectedAttributes);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
  };

  const handleDeleteProduct = (id: string) => {
    let newSelectItemAttributes: any = [];
    itemAttributes.filter((product: any) => {
      if (product.id !== id) {
        newSelectItemAttributes[product.id] = product.typeAttribute;
      }
    });
    setItemAttributes((prevList) =>
      prevList.filter((product: any) => product.id !== id)
    );
    setSelectedItemAttributes(newSelectItemAttributes);
    handleAddVariant(true, newSelectItemAttributes);
  };

  const handleChange = (value: string) => {
    if (value.indexOf('IN_APP') != -1) {
      setIsOnApp(true);
    } else {
      setIsOnApp(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleConfirmDelete = async () => {
    setIsShowModalConfirm(false);
    const { data } = await ItemApi.deleteManyItems(
      [detail.id],
      window.loggedInUser
    );
    if (data) {
      notification.success({
        message: 'Th??nh c??ng',
        description: data,
        placement: 'top',
        icon: <Icon icon={'checked-approved'} size={24} />,
      });
      window.location.href = '/product/items';
    }
  };

  const handleAddNewItemAttributeValue = async (attribute_id: any) => {
    const { data } = await ItemAttributeValueApi.addItemAttributeValue({
      item_attribute_id: attribute_id,
      value: newItemAttributeValue,
      code: newItemAttributeCode,
    });
    if (data) {
      notification.success({
        message: 'Th??nh c??ng',
        description: 'Th??m thu???c t??nh th??nh c??ng!',
        placement: 'top',
        icon: <Icon icon={'checked-approved'} size={24} />,
      });
      let currentItemAttribute: any = selectedItemAttributes;
      currentItemAttribute[attribute_id] = currentItemAttribute[
        attribute_id
      ].concat({
        label: data.value,
        value: data.id,
      });
      let newItemAttributes: any[] = itemAttributes;
      const id = itemAttributes.findIndex(
        (item: any) => item.id == attribute_id
      );
      if (id !== -1) {
        newItemAttributes[id]['typeAttribute'] =
          currentItemAttribute[attribute_id];
      }
      setItemAttributes((itemAttributes) => newItemAttributes);
      setSelectedItemAttributes(
        (selectedItemAttributes) => currentItemAttribute
      );
      detail && getDetailAttributes();
      handleAddVariant();
    }
  };

  const handleOnChangeItemAttribute = async (
    value: any,
    newProductAttributes = productAttributes
  ) => {
    const isSelected = itemAttributes?.length
      ? itemAttributes.filter((v: any) => v.id == value)
      : [];
    if (isSelected.length) {
      notification.error({
        message: 'C?? l???i x???y ra',
        description: 'Thu???c t??nh ???? t???n t???i',
        placement: 'top',
      });
      return;
    }

    const { data } = await ItemAttributeValueApi.getItemAttributeValue({
      filter: {
        item_attribute_id: value,
      },
    });
    const selected: any = newProductAttributes?.length
      ? newProductAttributes.filter((v: any) => v.id == value)
      : [];
    if (selected.length) {
      const newAttribute: any = {
        attribute: selected[0].label,
        id: selected[0].id,
        typeAttribute: data,
      };

      let currentItemAttribute: any = selectedItemAttributes;
      currentItemAttribute[selected[0].id] = data;
      setSelectedItemAttributes(currentItemAttribute);
      setItemAttributes(itemAttributes.concat(newAttribute));
      handleAddVariant();
    }
  };

  const handleSelectItemAttributeValue = async (value: any, record: any) => {
    const selected: any =
      isArray(record.typeAttribute) && record.typeAttribute?.length
        ? record.typeAttribute.filter((v: any) => value.includes(v.value))
        : [];

    if (selected) {
      let currentItemAttribute: any = selectedItemAttributes;
      currentItemAttribute[record.id] = selected;
      setItemAttributes([...itemAttributes]);
    }
    handleAddVariant();
  };

  const handleAddVariant = async (
    isDelete?: boolean,
    newSelectItemAttributes?: any
  ) => {
    if (selectedItemAttributes.length == 0) {
      notification.error({
        message: 'Ch??a ch???n gi?? tr??? thu???c t??nh',
      });
    }
    const noAttribute = selectedItemAttributes.filter(
      (v: any) => v && v.length == 0
    );
    if (noAttribute.length) {
      notification.error({
        message: 'Ch??a ch???n gi?? tr??? thu???c t??nh',
      });
    }
    let combinations;
    if (isDelete) {
      combinations = getAllCombinations(newSelectItemAttributes);
      if (newSelectItemAttributes.length === 0) {
        setCombinations((combinations) => []);
        return;
      }
    } else {
      combinations = getAllCombinations(selectedItemAttributes);
    }
    let result: any = [];
    for (let i = 0; i < combinations.length; i++) {
      let combination = combinations[i];
      combination = Object.keys(combination).map((key) => [
        Number(key),
        combination[key],
      ]);
      const attributes = combination.map((v: any, k: any) => ({
        label: v[1].label,
        value: v[1].value,
        attribute_id: v[0],
      }));
      result.push({
        id: i,
        sku_code: '',
        price: 0,
        import_price: 0,
        weight: 0,
        is_show: true,
        attributes: attributes,
      });
    }
    setCombinations(result);
  };

  const getProducts = (arrays: any) => {
    if (arrays.length === 0 || !arrays) {
      return [[]];
    }

    let results: any = [];

    getProducts(arrays.slice(1)).forEach((product: any) => {
      arrays[0].forEach((value: any) => {
        results.push([value].concat(product));
      });
    });

    return results;
  };

  const getAllCombinations = (attributes: any) => {
    let attributeNames = Object.keys(attributes);
    let attributeValues = attributeNames.map((name) => attributes[name]);

    return getProducts(attributeValues).map((product: any) => {
      let obj: Array<any> = [];
      attributeNames &&
        attributeNames.forEach((name: any, i: any) => {
          obj[name] = product[i];
        });
      return obj;
    });
  };

  const handleSaveProduct = () => {
    const formValue = form.getFieldsValue();
    // console.log("formValue", formValue);
    // console.log("combinations", combinations);
    // return;
    form
      .validateFields()
      .then(async () => {
        if (isOnApp) {
          if (fileList.length == 0) {
            notification.error({
              message: 'C?? l???i x???y ra',
              description: 'H??nh ???nh s???n ph???m l?? b???t bu???c v???i K??nh b??n l?? App',
              placement: 'top',
            });
            return;
          }
          if (
            !formValue.description ||
            formValue.description == '<p><br></p>'
          ) {
            notification.error({
              message: 'C?? l???i x???y ra',
              description: 'M?? t???/N???i dung l?? b???t bu???c v???i K??nh b??n l?? App',
              placement: 'top',
            });
            return;
          }
        }
        if (!isArray(formValue.channels)) {
          notification.error({
            message: 'Vui l??ng ch???n k??nh b??n!',
          });
          return;
        }
        if (formValue.warehouse_id) {
          const valueLabel = get(formValue.warehouse_id, '[0].label');
          if (valueLabel) {
            const arrayWarehouseId: any = [];
            warehouses.map((v: any) => {
              if (v.value) {
                arrayWarehouseId.push(v.value);
              }
            });
            formValue.warehouse_id = arrayWarehouseId;
          }
        }
        if (detail) {
          const { data } = await ItemApi.updateItem(detail.id, {
            ...formValue,
            images: fileList,
            itemSkus: combinations,
            same_price_channel: formValue.same_price_channel
              ? formValue.same_price_channel
              : false,
            user_id: window.loggedInUser,
          });
          if (data) {
            notification.success({
              message: 'Th??nh c??ng',
              description: 'L??u th??nh c??ng',
              placement: 'top',
              icon: <Icon icon={'checked-approved'} size={24} />,
            });
          }
        } else {
          if (selectedItemAttributes.length && combinations.length) {
            const { data } = await ItemApi.addItem({
              ...formValue,
              management_type: 'normal',
              images: fileList,
              item_attribute_ids: Object.keys(selectedItemAttributes),
              itemAttributes: combinations,
              itemSkus: combinations,
              same_price_channel: formValue.same_price_channel
                ? formValue.same_price_channel
                : false,
              user_id: window.loggedInUser,
            });

            if (data) {
              notification.success({
                message: 'Th??nh c??ng',
                description: 'T???o th??nh c??ng',
                placement: 'top',
                icon: <Icon icon={'checked-approved'} size={24} />,
              });
              window.location.href = `/product/items/edit/${data.id}`;
            }
          } else {
            const { data } = await ItemApi.addItem({
              ...formValue,
              management_type: 'normal',
              images: fileList,
              item_attribute_ids: Object.keys(selectedItemAttributes),
              itemAttributes: combinations,
              itemSkus: combinations,
              user_id: window.loggedInUser,
            });
            if (data) {
              notification.success({
                message: 'T???o s???n ph???m th??nh c??ng!',
              });
              window.location.href = `/product/items/edit/${data.id}`;
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeImage = async (e: any) => {
    setFileList(
      fileList.filter((v: any) => !v.status || v.status !== 'removed')
    );
  };

  useEffect(() => {
    if (fileTemp) {
      setFileList([...fileList, { url: fileTemp }]);
    }
  }, [fileTemp]);
  const handleUploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    try {
      const data = await ImageApi.upload(file);
      setFileTemp(data.url);
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const handleDeleteSku = (record: any) => {
    const newRecord = combinations.filter((v: any) => v.id !== record.id);
    setCombinations(newRecord);
  };

  const handleSyncSku = () => {
    syncForm
      .validateFields()
      .then(() => {
        const formValue = syncForm.getFieldsValue();
        const newCombination = combinations.map((v: any) => {
          return {
            ...v,
            price_offline: formValue.price ? formValue.price : v.price_offline,
            price_online: formValue.price ? formValue.price : v.price_online,
            price_in_app: formValue.price ? formValue.price : v.price_in_app,
            weight: formValue.weight ? formValue.weight : v.weight,
          };
        });
        setCombinations([...newCombination]);
      })
      .catch((err) => {});
  };

  const handleTransferWarehouse = () => {
    if (!disabledTransfer) {
      transferForm
        .validateFields()
        .then(async () => {
          const formValue = transferForm.getFieldsValue();
          if (formValue.from_warehouse_id == formValue.to_warehouse_id) {
            notification.error({
              message: 'C?? l???i x???y ra',
              description: 'Kho nh???p v?? kho chuy???n kh??ng ???????c gi???ng nhau',
              placement: 'top',
            });
            return;
          }
          setDisableTransfer(true);
          const data = await WarehouseTransferApi.createTransferCommand({
            transferCommand: {
              from_warehouse_id: formValue.from_warehouse_id,
              to_warehouse_id: formValue.to_warehouse_id,
              created_user_id: window.loggedInUser,
              status: 'M???i',
            },
            transferCommandItems: combinations.map((v: any) => ({
              item_id: v.item_id,
              id: v.id,
              quantity_transfer: 0,
              weight_transfer: 0,
            })),
          });
          if (data) {
            window.open('/warehouse/transfer-commands/update/' + data.id);
          }
          setDisableTransfer(false);
        })
        .catch((err) => {});
    }
  };

  const handleChangePrice = (e: any) => {
    if (isSamePrice) {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        import_price: e.target.value,
        price_offline: e.target.value,
        price_online: e.target.value,
        price_in_app: e.target.value,
      });
      const newCombination = combinations.map((v: any) => {
        return {
          ...v,
          import_price: e.target.value,
          price: e.target.value,
          price_offline: e.target.value,
          price_online: e.target.value,
          price_in_app: e.target.value,
        };
      });

      setCombinations([...newCombination]);
    }
  };

  const handleChangeSamePrice = (e: any) => {
    setIsSamePrice(e);
  };

  useEffect(() => {
    if (isSamePrice) {
      // alert("handle same price")
    }
  }, [isSamePrice]);

  const handleChangeItemSku = (e: any, record: any, keyName: any) => {
    if (keyName === 'is_minus_sell') {
      const exsitMinusSaleItem = combinations.find(
        (item) => item.is_minus_sell === true && item.id !== record.id
      );
      if (exsitMinusSaleItem || e === true) {
        form.setFieldValue('is_minus_sell', true);
      } else {
        form.setFieldValue('is_minus_sell', false);
      }
    }

    const newCombination = combinations.map((v: any) => {
      if (v.id === record.id) {
        let newValue = record;
        newValue[keyName] =
          keyName == 'is_show' ||
          keyName == 'is_minus_sell' ||
          keyName == 'price_in_app' ||
          keyName == 'price_online' ||
          keyName == 'price_offline'
            ? e
            : e.target.value;
        if (isSamePrice) {
          if (keyName === 'price_offline') {
            newValue['price_online'] = e;
            newValue['price_in_app'] = e;
          } else if (keyName === 'price_online') {
            newValue['price_offline'] = e;
            newValue['price_in_app'] = e;
          } else if (keyName === 'price_in_app') {
            newValue['price_online'] = e;
            newValue['price_offline'] = e;
          }
        }
        return newValue;
      } else return v;
    });
    setCombinations([...newCombination]);
  };

  const handleCheckAllSaleNegative = (value: any) => {
    combinations.map((item) => {
      handleChangeItemSku(value, item, 'is_minus_sell');
    });
  };

  const handleChangeWarehouse = (value: any) => {
    if (value.length > 1 && value.includes('')) {
      const selected: any[] = value.filter((v: any) => v !== '');
      setSelectedWarehouse(selected);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        warehouse_id: selected,
      });
    } else {
      if (value.length == 0) {
        const selected: any[] = [
          {
            label: 'T???t c??? kho',
            value: '',
          },
        ];
        setSelectedWarehouse(selected);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          warehouse_id: selected,
        });
      } else {
        setSelectedWarehouse(value);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          warehouse_id: value,
        });
      }
    }
  };

  const PopoverAddAttribute = (
    <div className="flex flex-col w-full">
      <div className="text-medium font-medium mb-[4px]">M??</div>
      <Input className="rounded-lg" placeholder="nh???p" />
      <div className="text-medium font-medium mb-[4px]">Thu???c t??nh</div>
      <Input className="rounded-lg" placeholder="nh???p" />
      <div className="flex justify-between w-full">
        <Button
          variant="outlined"
          className="mt-[32px]"
          text="Hu??? b???"
          width={134}
          height={45}
        />
        <div className="mt-[32px] bg-[#384ADC] text-[#fff] w-[134px] h-[45px] rounded-lg flex justify-center items-center cursor-pointer">
          Th??m m???i
        </div>
      </div>
    </div>
  );

  const PopoverAsync = (
    <Form form={syncForm} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Gi?? b??n</div>
          <Form.Item name="price" className="d-none">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nh???p gi?? b??n"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">??</p>
              }
            />
          </Form.Item>
          <InputCurrency
            width={154}
            placeholder="Nh???p gi?? b??n"
            onValueChange={(e: any) => {
              syncForm.setFieldValue('price', e);
            }}
            defaultValue={0}
            inputMode="decimal"
            suffixInput="??"
          />
        </div>
        <div className="flex justify-between w-full items-center ">
          <div className="text-medium font-medium mb-[4px]">Tr???ng l?????ng SP</div>
          <Form.Item
            name="weight"
            rules={[
              {
                pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+/),
                message: 'Tr???ng l?????ng SP kh??ng h???p l???',
              },
            ]}
          >
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nh???p tr???ng l?????ng"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">kg</p>
              }
            />
          </Form.Item>
        </div>
        {/* <div>
          <Select placeholder="Ch???n k??nh ?????ng b???" options={productAttributes} />
        </div> */}
        <div
          className="mt-[16px] bg-[#384ADC] text-[#fff] w-[297px] h-[39px] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleSyncSku}
        >
          ?????ng b???
        </div>
      </div>
    </Form>
  );

  const PopoverTranserWarehouse = (
    <Form form={transferForm} className="w-full">
      <div className="flex flex-col w-full">
        <div className="text-medium font-medium mb-[8px]">Ch???n kho chuy???n</div>
        <Form.Item
          name="from_warehouse_id"
          rules={[
            {
              required: true,
              message: 'Kho chuy???n l?? b???t bu???c!',
            },
          ]}
        >
          <Select
            className="rounded-lg mb-[8px]
            mb-[8px]"
            defaultValue={warehouses[0]}
            options={warehouses}
          />
        </Form.Item>
        <div className="text-medium font-medium mb-[8px]">Ch???n kho nh???p</div>
        <Form.Item
          name="to_warehouse_id"
          rules={[
            {
              required: true,
              message: 'Kho nh???p l?? b???t bu???c!',
            },
          ]}
        >
          <Select
            className="rounded-lg mb-[8px]
            mb-[8px]"
            defaultValue={warehouses[0]}
            options={warehouses}
          />
        </Form.Item>
        <div
          className="mt-[16px] bg-[#384ADC] text-[#fff] w-full h-[39px] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleTransferWarehouse}
        >
          Chuy???n kho
        </div>
      </div>
    </Form>
  );
  //Fake Data
  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
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

  const wareHouseList = [
    {
      label: 'Tat ca',
      value: 'all',
    },
    {
      label: 'Kho chinh',
      value: 'main-store',
    },
    {
      label: 'Kho hang in app',
      value: 'in-app-store',
    },
  ];

  const columnAttributes: ColumnsType<ProductAttributeProps> = [
    {
      title: 'Thu???c t??nh',
      width: 148,
      dataIndex: 'attribute',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-left w-48">
          {!detail && (
            <div
              className="mr-[20px] cursor-pointer"
              onClick={() => handleDeleteProduct(record.id)}
            >
              <Icon icon="cancel" size={24} />
            </div>
          )}

          <span className="text-sm text-[#4B4B59] font-medium pd-[9px]">
            {record.attribute}
          </span>
        </div>
      ),
    },
    {
      title: 'Gi?? tr???',
      width: 551,
      dataIndex: 'typeAttribute',
      align: 'left',
      render: (_, record: any) => {
        return (
          <span className="w-full flex items-center justify-between text-sm text-[#4B4B59] font-medium pd-[9px]">
            <span className="w-11/12">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                showArrow
                style={{ width: '100%' }}
                disabled={detail ?? false}
                value={productAttrList}
                // value={
                //   !detail
                //     ? [...selectedItemAttributes[record.id]]
                //     : selectedItemAttributes[record.id]
                // }
                // onChange={(e) => handleSelectItemAttributeValue(e, record)}
                // options={!detail ? record?.typeAttribute : []}
              />
            </span>
            {!detail && (
              <Popover
                placement="bottomRight"
                content={
                  <div className="flex flex-col w-full">
                    <div className="text-medium font-medium mb-[4px]">
                      Thu???c t??nh
                    </div>
                    <Input
                      className="rounded-lg"
                      placeholder="nh???p"
                      onChange={(e) => setNewItemAttributeValue(e.target.value)}
                      value={newItemAttributeValue}
                    />
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outlined"
                        className="mt-[32px]"
                        text="Hu??? b???"
                        width={134}
                        height={45}
                      />
                      <div
                        className="mt-[32px] bg-[#384ADC] text-[#fff] w-[134px] h-[45px] rounded-lg flex justify-center items-center cursor-pointer"
                        onClick={() =>
                          handleAddNewItemAttributeValue(record.id)
                        }
                      >
                        Th??m m???i
                      </div>
                    </div>
                  </div>
                }
                title="Th??m ki???u thu???c t??nh m???i"
                trigger="click"
                overlayStyle={{
                  width: '309px',
                }}
              >
                <Button width={24} height={24} className="p-0">
                  <Icon icon="add-square-1" size={24} />
                </Button>
              </Popover>
            )}
          </span>
        );
      },
    },
  ];

  const itemSkuShowList: ProductDetailProps[] = [
    {
      is_show: true,
      sku_code: '555501S',
      item_attribute_values: [{ lable: 'Xanh', value: 'blue' }],
      price_offline: 55000,
      price_online: 55000,
      price_in_app: 55000,
      weight: 5,
      is_minus_sell: true,
    },
    {
      is_show: true,
      sku_code: '555501S',
      item_attribute_values: [{ lable: 'Xanh', value: 'blue' }],
      price_offline: 55000,
      price_online: 55000,
      price_in_app: 55000,
      weight: 5,
      is_minus_sell: true,
    },
    {
      is_show: true,
      sku_code: '555501S',
      item_attribute_values: [{ lable: 'Xanh', value: 'blue' }],
      price_offline: 55000,
      price_online: 55000,
      price_in_app: 55000,
      weight: 5,
      is_minus_sell: true,
    },
  ];

  const arrayColumnItemSkuShow = [
    'show',
    'sku',
    'import_price',
    'price',
    'weight',
    'negative',
    'action',
  ]
    .concat(
      isArray(itemAttributes) && itemAttributes.length > 0 ? 'attributes' : ''
    )
    .concat(channels)
    .concat(detail ? 'inventory' : '');
  const columnSkusCreate: ColumnsType<ProductDetailProps> = [
    {
      title: 'Hi???n',
      width: 82,
      key: 'id',
      dataIndex: 'show',
      fixed: 'left',
      align: 'center',
      render: (_, record: any) => {
        return (
          <Switch
            checked={record.is_show}
            className="button-switch"
            onChange={(e) => {
              handleChangeItemSku(e, record, 'is_show');
            }}
          />
        );
      },
    },
    {
      title: 'M?? SKU',
      fixed: 'left',
      width: 145,
      dataIndex: 'sku',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record?.sku_code || '--'}
        </span>
      ),
    },
    {
      title: 'M???u m??',
      width: 350,
      dataIndex: 'attributes',
      align: 'center',
      render: (_, record) => {
        return (
          <div
            className="flex justify-center items-center px-[12px] py-[7px] rounded-lg"
            style={{ border: '1px solid #DADADD' }}
          >
            {!detail ? (
              <div className="text-medium font-medium text-[#4B4B59]">
                {record?.attributes?.map((v: any) => v.label).join(' - ')}
              </div>
            ) : (
              <div>
                {record?.item_attribute_values
                  ?.map((v: any) => v.value)
                  .join(' - ')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Gi?? b??n t???i qu???y',
      width: 200,
      dataIndex: 'OFFLINE',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Gi?? b??n offline"
              value={record?.price_offline}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, 'price_offline')
              }
              suffixInput="??"
            />
          </div>
        );
      },
    },
    {
      title: 'Gi?? b??n online',
      width: 200,
      dataIndex: 'ONLINE',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Gi?? b??n online"
              value={record?.price_online}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, 'price_online')
              }
              suffixInput="??"
            />
          </div>
        );
      },
    },
    {
      title: 'Gi?? b??n t???i app',
      width: 200,
      dataIndex: 'IN_APP',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Gi?? b??n t???i app"
              value={record?.price_in_app}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, 'price_in_app')
              }
              suffixInput="??"
            />
          </div>
        );
      },
    },
    {
      title: 'Tr???ng l?????ng SP',
      width: 170,
      dataIndex: 'weight',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <Input
              placeholder="Nh???p tr???ng l?????ng"
              value={record?.weight}
              onChange={(e) => handleChangeItemSku(e, record, 'weight')}
              suffix={<span>kg</span>}
            />
          </div>
        );
      },
    },
    {
      title: 'B??n ??m',
      width: 100,
      dataIndex: 'negative',
      align: 'center',
      render: (_, record) => {
        return (
          <Checkbox
            checked={record.is_minus_sell}
            onChange={(e) => {
              handleChangeItemSku(e.target.checked, record, 'is_minus_sell');
            }}
          />
        );
      },
    },
    {
      title: 'T???n kho',
      width: 100,
      dataIndex: 'inventory',
      align: 'center',
      render: (_, record: any) => {
        let inventory = 0;
        isArray(get(record, 'warehouse_items')) &&
          get(record, 'warehouse_items').map((item: any) => {
            inventory += item.quantity;
          });
        return <div>{inventory}</div>;
      },
    },
    {
      title: 'Action',
      width: 100,
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          !detail && (
            <div
              className="cursor-pointer"
              onClick={() => handleDeleteSku(record)}
            >
              <Icon icon="cancel" size={24} />
            </div>
          )
        );
      },
    },
  ];

  const checkboxSettings = [
    {
      label: 'T???i qu???y',
      value: 'OFFLINE',
    },
    {
      label: 'Online',
      value: 'ONLINE',
    },
    {
      label: 'App',
      value: 'IN_APP',
    },
  ];

  const handleSaveItemSkus = () => {
    const formValue = form.getFieldsValue();
    ItemSkuApi.updateManyItemSku(detail.id, {
      itemSkus: combinations,
      channels: formValue.channels ? formValue.channels : [],
    });
    notification.success({
      message: 'Th??nh c??ng',
      description: 'L??u SKU th??nh c??ng!',
      placement: 'top',
      icon: <Icon icon={'checked-approved'} size={24} />,
    });
  };
  console.log('productattr', productAttributes);
  const productAttrList = [
    {
      label: 'GEL',
      value: 'gel',
      id: '81',
    },
    {
      label: 'GEL',
      value: 'gel',
      id: '81',
    },
    {
      label: 'GEL',
      value: 'gel',
      id: '81',
    },
  ];
  const itemAttrList: ProductAttributeProps[] = [
    {
      id: '1199',
      attribute: 'Test',
      typeAttribute: 'test',
    },
    {
      id: '12',
      attribute: 'Test1',
      typeAttribute: 'test1',
    },
  ];
  // console.log('item', itemAttributes)
  itemAttributes.map((item) => {
    console.log('items', item.typeAttribute);
  });
  const handleKeyDownAddAttribute = async (e: any) => {
    if (e.keyCode == 13 || e.which == 13) {
      const { data }: any = await ItemAttributeApi.addItemAttribute({
        name: searchAttribute,
      });

      const newProductAttributes = productAttributes.concat({
        label: data.name,
        id: data.id,
        value: data.name,
      });
      setProductAttributes(newProductAttributes);
      handleOnChangeItemAttribute(data.id, newProductAttributes);
    }
  };

  const handleKeyDownAddAttributeValue = (e: any, record: any) => {
    if (e.keyCode == 13 || e.which == 13) {
      handleAddNewItemAttributeValue(record.id);
    }
  };
  console.log('value type list', selectedCategory);

  const handleImportWarehouse = async () => {
    const body = {
      status: 'CREATED',
      expired_date: [null],
      import_price: combinations.map((item) => 0),
      manufactured_date: [null],
      quantities: combinations.map((item) => 0),
      total_package: combinations.map((item) => 0),
      warehouse_id: null,
      weight: combinations.map((item) => 0),
      total_package_price: combinations.map((item) => 0),
      user_id: window.loggedInUser,
      skus: combinations.map((item) => item.id),
    };
    const data = await WarehouseImportCommandApi.createImportCommand(body);
    if (data.success) {
      notification.success({
        message: 'T???o phi???u nh???p kho th??nh c??ng!',
        duration: 600,
      });
      window.location.href = `/warehouse/import-commands/update/${data.data.id}`;
    } else {
      notification.error({
        message: 'T???o phi???u nh???p kho th???t b???i!',
        duration: 600,
      });
    }
  };

  const handleSamePrice = (value: any) => {
    if (isSamePrice) {
      form.setFieldValue('price_offline', value);
      form.setFieldValue('price_online', value);
      form.setFieldValue('price_in_app', value);
      const newPriceChannel = {
        ONLINE: value,
        OFFLINE: value,
        IN_APP: value,
      };
      setPriceChannel((priceChannel: any) => newPriceChannel);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <TitlePage
          href="/products"
          title={detail ? 'Chi ti???t s???n ph???m' : 'T???o s???n ph???m'}
        />
        <div className="flex gap-x-2">
          {detail && (
            <Button
              variant="danger-outlined"
              width={153}
              icon={<Icon icon="trash" size={24} color="#EF4444" />}
              onClick={() => setIsShowModalConfirm(true)}
            >
              X??a s???n ph???m
            </Button>
          )}

          <Button
            variant="secondary"
            width={148}
            style={{ fontWeight: 'bold' }}
            onClick={handleSaveProduct}
          >
            L??U (F12)
          </Button>
        </div>
      </div>
      <Form form={form} onFinish={handleSaveProduct} className="w-full">
        <div className="flex gap-x-3">
          <div
            className="flex flex-col justify-between gap-[4px]"
            style={{ minWidth: '50%', maxWidth: '50%' }}
          >
            <div className="w-full bg-white rounded p-3">
              <div className={styles.row}>
                <div className={styles.row_left_table}>
                  T??n s???n ph???m <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'T??n s???n ph???m l?? b???t bu???c!',
                    },
                  ]}
                >
                  <Input placeholder="Nh???p t??n s???n ph???m" required={true} />
                </Form.Item>
              </div>
              {/* <div className="mb-[16px]">
                <div className="text-medium font-medium mb-[12px]">
                  M?? t???/N???i dung
                </div>
                <Form.Item name="description">
                  <TextEditor
                    onChange={(e) => console.log("editor", e)}
                    placeholder="Nh???p n???i dung"
                  />
                </Form.Item>
              </div> */}
              <div className={styles.row}>
                <div className={styles.row_left_table}>
                  Danh m???c <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="item_category_id"
                  rules={[
                    {
                      required: true,
                      message: 'Danh m???c l?? b???t bu???c!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Ch???n danh m???c s???n ph???m"
                    options={typeList}
                    value={selectedCategory}
                    // onChange={(e) => {
                    //   setSelectedCategory(e);
                    // }}
                  />
                </Form.Item>
              </div>
              <div className={classNames(styles.row, 'd-none')}>
                <div className={styles.row_left_table}>Kho thao t??c</div>
                <Form.Item className="flex flex-1" name="warehouse_id">
                  <Select
                    mode="multiple"
                    showArrow
                    options={wareHouseList}
                    maxTagCount="responsive"
                    tagRender={tagRender}
                    // onChange={handleChangeWarehouse}
                  />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className="text-medium font-medium mb-[30px]">
                  K??nh b??n
                </div>
                <div style={{ width: 285 }}>
                  <Form.Item name="channels">
                    <CheckboxList
                      options={checkboxSettings}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Item>
                  <div className="flex items-center gap-[5px] ml-[25px] mt-[15px]">
                    <Form.Item
                      name="same_price_channel"
                      valuePropName="checked"
                    >
                      <Switch
                        defaultChecked={
                          detail && detail?.same_price_channel
                            ? detail?.same_price_channel
                            : false
                        }
                        onChange={(e) => handleChangeSamePrice(e)}
                      />
                    </Form.Item>
                    <span>?????ng gi?? tr??n t???t c??? k??nh b??n</span>
                  </div>
                </div>
              </div>
              {!detail && (
                <div>
                  {channels &&
                    isArray(channels) &&
                    channels.includes('OFFLINE') &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Gi?? b??n t???i qu???y
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_offline"
                        >
                          <Input placeholder="Nh???p gi??" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nh???p gi??"
                          onValueChange={(e) => {
                            form.setFieldValue('price_offline', e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  OFFLINE: e,
                                });
                          }}
                          value={priceChannel.OFFLINE}
                          inputMode="decimal"
                          suffixInput="??"
                        />
                      </div>
                    )}
                  {channels &&
                    isArray(channels) &&
                    channels.includes('ONLINE') &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Gi?? b??n online
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_online"
                        >
                          <Input placeholder="Nh???p gi??" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nh???p gi??"
                          onValueChange={(e) => {
                            form.setFieldValue('price_online', e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  ONLINE: e,
                                });
                          }}
                          value={priceChannel.ONLINE}
                          inputMode="decimal"
                          suffixInput="??"
                        />
                      </div>
                    )}
                  {channels &&
                    isArray(channels) &&
                    channels.includes('IN_APP') &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Gi?? b??n t???i App
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_in_app"
                        >
                          <Input placeholder="Nh???p gi??" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nh???p gi??"
                          onValueChange={(e) => {
                            form.setFieldValue('price_in_app', e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  IN_APP: e,
                                });
                          }}
                          value={priceChannel.IN_APP}
                          inputMode="decimal"
                          suffixInput="??"
                        />
                      </div>
                    )}
                </div>
              )}
              <div className="mb-[16px]">
                <div className="text-medium font-medium mb-[12px]">
                  H??nh ???nh s???n ph???m
                </div>
                <Upload
                  customRequest={handleUploadImage}
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={true}
                  onChange={handleChangeImage}
                  multiple
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 w-1/2 gap-[4px]">
            <div className="w-full flex gap-[16px] bg-white rounded p-3 mb-[12px]">
              <div className="w-1/2">
                <div className="mb-[16px]">
                  <div className="text-medium font-medium mb-[4px]">
                    Th???i ??i???m t???o
                  </div>
                  <div className={styles.row_left_table}>
                    {/* {detail?.createdAt ? detail?.createdAt : ''} */}
                    20/02/2003
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <Form.Item name="note">
                  <TextArea
                    label="Ghi ch??"
                    placeholder="Nh???p n???i dung"
                    className="!h-[110px]"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full bg-white rounded p-3">
              <div className="flex justify-start mb-[24px] items-center">
                <Form.Item name="count_by_weight" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <span className="ml-[8px] text-medium font-medium">
                  T??nh ti???n theo c??n n???ng
                </span>
              </div>
              <div className={styles.row}>
                <div>
                  <Form.Item
                    name="notify_when_sold_out"
                    valuePropName="checked"
                  >
                    <Checkbox className="text-medium font-medium">
                      Th??ng b??o khi h???t h??ng
                    </Checkbox>
                  </Form.Item>
                </div>
                <Form.Item
                  name="notify_quantity"
                  className="flex flex-1"
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      message: 'S??? l?????ng kh??ng h???p l???',
                    },
                  ]}
                >
                  <Input
                    suffix={<div>S??? l?????ng</div>}
                    placeholder="S??? l?????ng: Nh???p"
                  />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <Form.Item name="is_minus_sell" valuePropName="checked">
                  <Checkbox
                    className="text-medium font-medium"
                    onChange={(e) =>
                      handleCheckAllSaleNegative(e.target.checked)
                    }
                  >
                    B??n ??m (v???n b??n khi h???t h??ng)
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
            <div className="p-[12px] bg-white rounded">
              <div className={styles.row}>
                <div className="text-[#384ADC] font-semibold text-medium">
                  Danh s??ch thu???c t??nh
                </div>
                {!detail && (
                  <div className="w-1/2 flex justify-end items-center">
                    <div className="text-medium font-medium mr-[24px]">
                      Th??m thu???c t??nh
                    </div>
                    <Select
                      showSearch
                      // onInputKeyDown={(e) => {
                      //   handleKeyDownAddAttribute(e);
                      // }}
                      // onSearch={(e) => setSearchAttribute(e)}
                      style={{ width: 175 }}
                      placeholder="Ch???n"
                      options={productAttrList}
                      disabled={detail ?? false}
                      // onChange={(e, option: any) => {
                      //   handleOnChangeItemAttribute(option.id);
                      // }}
                    />
                  </div>
                )}
              </div>
              <Table
                columns={columnAttributes}
                dataSource={itemAttrList}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </Form>
      <div className="w-full flex-col flex gap-[16px] bg-white rounded p-3 my-[12px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-[#384ADC] font-semibold text-medium min-w-[150px]">
            Danh s??ch m???u m??
          </div>
          <div className="flex gap-x-2 mt-4 mb-3 w-[795px] justify-end">
            <Popover
              placement="bottomRight"
              content={PopoverAsync}
              trigger="click"
              overlayStyle={{ width: '354px' }}
              className="relative"
            >
              <Button width={195} height={45} className="p-0">
                <div className="w-[200px] flex justify-between p-[10px] items-center">
                  <div className="flex justify-left">
                    <Icon icon="repeat" size={24} className="mr-[10px]" />
                    ?????ng b???
                  </div>
                  <Icon icon="arrow-down-1" size={14} />
                </div>
              </Button>
            </Popover>
            {detail && (
              <Button
                width={195}
                height={45}
                className="p-0"
                onClick={() => handleImportWarehouse()}
              >
                <div className="w-[200px] flex justify-between p-[10px] items-center">
                  <div className="flex justify-left">
                    <Icon icon="arrow-swap" size={24} className="mr-[10px]" />
                    Nh???p kho nhanh
                  </div>
                </div>
              </Button>
            )}
            {detail && (
              <Button
                variant="secondary"
                width={148}
                style={{ fontWeight: 'bold' }}
                onClick={handleSaveItemSkus}
              >
                L??u
              </Button>
            )}
          </div>
        </div>
        <div className="w-full">
          <Table
            loading={loading}
            columns={columnSkusCreate.filter((item: any) =>
              arrayColumnItemSkuShow.includes(item.dataIndex)
            )}
            dataSource={itemSkuShowList}
            pagination={false}
            scroll={{ x: 50 }}
          />
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
    </div>
  );
};

export default ProductForms;
