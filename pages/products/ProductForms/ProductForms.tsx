/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useState, useEffect } from "react";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import ModalConfirm from "../../../components/Modal/ModalConfirm/ModalConfirm";
import { Popover } from "antd";
import Select from "../../../components/Select/Select";
import TextArea from "../../../components/TextArea";
import DatePicker from "../../../components/DatePicker/DatePicker";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Upload from "../../../components/Upload/Upload";
import type { ColumnsType } from "antd/es/table";
import styles from "../../../styles/DetailCustomer.module.css";
import type {
  ProductAttributeProps,
  ProductDetailProps,
} from "../product.type";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { Checkbox, Switch, Tag } from "antd";
import CheckboxList from "../../../components/CheckboxList/CheckboxList";
import classNames from "classnames";
import { Table, notification } from "antd";
interface ProductFormProps {
  detail?: any;
  loading?: boolean;
  type_attr_list?: ProductAttributeProps[];
}
import { Form } from "antd";
import ItemApi from "../../../services/items";
import ItemCategoryApi from "../../../services/item-categories";
import ItemSupplierApi from "../../../services/item-suppliers";
import ItemAttributeApi from "../../../services/item-attributes";
import ItemAttributeValueApi from "../../../services/item-attribute-values";
import WarehouseApi from "../../../services/warehouses";
import ImageApi from "../../../services/images";
import { isArray } from "../../../utils/utils";
import TextEditor from "../../../components/TextEditor/TextEditor";
import ItemSkuApi from "../../../services/item-skus";
import WarehouseTransferApi from "../../../services/warehouse-transfer-command";
import { get } from "lodash";
import { format } from "node:path/win32";
import WarehouseImportCommandApi from "../../../services/warehouse-import";
import CurrencyInput from "react-currency-input-field";
import InputCurrency from "../../../components/InputCurrency/Input";

declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
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
      label: "Tất cả kho",
      value: "",
    },
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState([
    {
      label: "Tất cả kho",
      value: "",
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemAttributes, setItemAttributes] = useState<any[]>([]);
  const [selectedItemAttributes, setSelectedItemAttributes] = useState<any[]>(
    [],
  );
  const [newItemAttributeCode, setNewItemAttributeCode] = useState<string>("");
  const [newItemAttributeValue, setNewItemAttributeValue] =
    useState<string>("");
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [saleOffline, setSaleOffline] = useState(false);
  const [saleOnline, setSaleOnline] = useState(false);
  const [saleInApp, setSaleInApp] = useState(false);
  const [disabledTransfer, setDisableTransfer] = useState(false);
  const [searchAttribute, setSearchAttribute] = useState("");
  const [searchAttributeValue, setSearchAttributeValue] = useState("");
  const [fileTemp, setFileTemp] = useState<any>();

  const [form] = Form.useForm();
  const [syncForm] = Form.useForm();
  const [transferForm] = Form.useForm();
  const channels = Form.useWatch("channels", form);
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

    window.addEventListener("keydown", (e) => {
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
          (v: any) => v.warehouse_id,
        );
      }
      if (detail.channels && detail.channels.length) {
        setIsOnApp(detail.channels.indexOf("IN_APP") == -1 ? false : true);
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
      (v: any) => v.value === detail?.item_category_id,
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
        })),
      ),
    );
  };

  const getDetailAttributes = async () => {
    const { data } = await ItemAttributeApi.getItemAttributeDetailByItem(
      detail.id,
    );
    setItemAttributes(data.attributes);
    if (isArray(data.attributes)) {
    }
    setSelectedItemAttributes(data.selectedAttributes);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
  };

  const handleDeleteProduct = (id: string) => {
    let newSelectItemAttributes: any = [];
    itemAttributes.filter((product: any) => {
      if (product.id !== id) {
        newSelectItemAttributes[product.id] = product.typeAttribute;
      }
    });
    setItemAttributes((prevList) =>
      prevList.filter((product: any) => product.id !== id),
    );
    setSelectedItemAttributes(newSelectItemAttributes);
    handleAddVariant(true, newSelectItemAttributes);
  };

  const handleChange = (value: string) => {
    if (value.indexOf("IN_APP") != -1) {
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
      window.loggedInUser,
    );
    if (data) {
      notification.success({
        message: "Thành công",
        description: data,
        placement: "top",
        icon: <Icon icon={"checked-approved"} size={24} />,
      });
      window.location.href = "/product/items";
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
        message: "Thành công",
        description: "Thêm thuộc tính thành công!",
        placement: "top",
        icon: <Icon icon={"checked-approved"} size={24} />,
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
        (item: any) => item.id == attribute_id,
      );
      if (id !== -1) {
        newItemAttributes[id]["typeAttribute"] =
          currentItemAttribute[attribute_id];
      }
      setItemAttributes((itemAttributes) => newItemAttributes);
      setSelectedItemAttributes(
        (selectedItemAttributes) => currentItemAttribute,
      );
      detail && getDetailAttributes();
      handleAddVariant();
    }
  };

  const handleOnChangeItemAttribute = async (
    value: any,
    newProductAttributes = productAttributes,
  ) => {
    const isSelected = itemAttributes?.length
      ? itemAttributes.filter((v: any) => v.id == value)
      : [];
    if (isSelected.length) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Thuộc tính đã tồn tại",
        placement: "top",
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
    newSelectItemAttributes?: any,
  ) => {
    if (selectedItemAttributes.length == 0) {
      notification.error({
        message: "Chưa chọn giá trị thuộc tính",
      });
    }
    const noAttribute = selectedItemAttributes.filter(
      (v: any) => v && v.length == 0,
    );
    if (noAttribute.length) {
      notification.error({
        message: "Chưa chọn giá trị thuộc tính",
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
        sku_code: "",
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
              message: "Có lỗi xảy ra",
              description: "Hình ảnh sản phẩm là bắt buộc với Kênh bán là App",
              placement: "top",
            });
            return;
          }
          if (
            !formValue.description ||
            formValue.description == "<p><br></p>"
          ) {
            notification.error({
              message: "Có lỗi xảy ra",
              description: "Mô tả/Nội dung là bắt buộc với Kênh bán là App",
              placement: "top",
            });
            return;
          }
        }
        if (!isArray(formValue.channels)) {
          notification.error({
            message: "Vui lòng chọn kênh bán!",
          });
          return;
        }
        if (formValue.warehouse_id) {
          const valueLabel = get(formValue.warehouse_id, "[0].label");
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
              message: "Thành công",
              description: "Lưu thành công",
              placement: "top",
              icon: <Icon icon={"checked-approved"} size={24} />,
            });
          }
        } else {
          if (selectedItemAttributes.length && combinations.length) {
            const { data } = await ItemApi.addItem({
              ...formValue,
              management_type: "normal",
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
                message: "Thành công",
                description: "Tạo thành công",
                placement: "top",
                icon: <Icon icon={"checked-approved"} size={24} />,
              });
              window.location.href = `/product/items/edit/${data.id}`;
            }
          } else {
            const { data } = await ItemApi.addItem({
              ...formValue,
              management_type: "normal",
              images: fileList,
              item_attribute_ids: Object.keys(selectedItemAttributes),
              itemAttributes: combinations,
              itemSkus: combinations,
              user_id: window.loggedInUser,
            });
            if (data) {
              notification.success({
                message: "Tạo sản phẩm thành công!",
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
      fileList.filter((v: any) => !v.status || v.status !== "removed"),
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
      console.log("Error: ", err);
      const error = new Error("Some error");
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
              message: "Có lỗi xảy ra",
              description: "Kho nhập và kho chuyển không được giống nhau",
              placement: "top",
            });
            return;
          }
          setDisableTransfer(true);
          const data = await WarehouseTransferApi.createTransferCommand({
            transferCommand: {
              from_warehouse_id: formValue.from_warehouse_id,
              to_warehouse_id: formValue.to_warehouse_id,
              created_user_id: window.loggedInUser,
              status: "Mới",
            },
            transferCommandItems: combinations.map((v: any) => ({
              item_id: v.item_id,
              id: v.id,
              quantity_transfer: 0,
              weight_transfer: 0,
            })),
          });
          if (data) {
            window.open("/warehouse/transfer-commands/update/" + data.id);
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
    if (keyName === "is_minus_sell") {
      const exsitMinusSaleItem = combinations.find(
        (item) => item.is_minus_sell === true && item.id !== record.id,
      );
      if (exsitMinusSaleItem || e === true) {
        form.setFieldValue("is_minus_sell", true);
      } else {
        form.setFieldValue("is_minus_sell", false);
      }
    }

    const newCombination = combinations.map((v: any) => {
      if (v.id === record.id) {
        let newValue = record;
        newValue[keyName] =
          keyName == "is_show" ||
          keyName == "is_minus_sell" ||
          keyName == "price_in_app" ||
          keyName == "price_online" ||
          keyName == "price_offline"
            ? e
            : e.target.value;
        if (isSamePrice) {
          if (keyName === "price_offline") {
            newValue["price_online"] = e;
            newValue["price_in_app"] = e;
          } else if (keyName === "price_online") {
            newValue["price_offline"] = e;
            newValue["price_in_app"] = e;
          } else if (keyName === "price_in_app") {
            newValue["price_online"] = e;
            newValue["price_offline"] = e;
          }
        }
        return newValue;
      } else return v;
    });
    setCombinations([...newCombination]);
  };

  const handleCheckAllSaleNegative = (value: any) => {
    combinations.map((item) => {
      handleChangeItemSku(value, item, "is_minus_sell");
    });
  };

  const handleChangeWarehouse = (value: any) => {
    if (value.length > 1 && value.includes("")) {
      const selected: any[] = value.filter((v: any) => v !== "");
      setSelectedWarehouse(selected);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        warehouse_id: selected,
      });
    } else {
      if (value.length == 0) {
        const selected: any[] = [
          {
            label: "Tất cả kho",
            value: "",
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
      <div className="text-medium font-medium mb-[4px]">Mã</div>
      <Input className="rounded-lg" placeholder="nhập" />
      <div className="text-medium font-medium mb-[4px]">Thuộc tính</div>
      <Input className="rounded-lg" placeholder="nhập" />
      <div className="flex justify-between w-full">
        <Button
          variant="outlined"
          className="mt-[32px]"
          text="Huỷ bỏ"
          width={134}
          height={45}
        />
        <div className="mt-[32px] bg-[#384ADC] text-[#fff] w-[134px] h-[45px] rounded-lg flex justify-center items-center cursor-pointer">
          Thêm mới
        </div>
      </div>
    </div>
  );

  const PopoverAsync = (
    <Form form={syncForm} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Giá bán</div>
          <Form.Item name="price" className="d-none">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập giá bán"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">đ</p>
              }
            />
          </Form.Item>
          <InputCurrency
            width={154}
            placeholder="Nhập giá bán"
            onValueChange={(e: any) => {
              syncForm.setFieldValue("price", e);
            }}
            defaultValue={0}
            inputMode="decimal"
            suffixInput="đ"
          />
        </div>
        <div className="flex justify-between w-full items-center ">
          <div className="text-medium font-medium mb-[4px]">Trọng lượng SP</div>
          <Form.Item
            name="weight"
            rules={[
              {
                pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+/),
                message: "Trọng lượng SP không hợp lệ",
              },
            ]}
          >
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập trọng lượng"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">kg</p>
              }
            />
          </Form.Item>
        </div>
        {/* <div>
          <Select placeholder="Chọn kênh đồng bộ" options={productAttributes} />
        </div> */}
        <div
          className="mt-[16px] bg-[#384ADC] text-[#fff] w-[297px] h-[39px] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleSyncSku}
        >
          Đồng bộ
        </div>
      </div>
    </Form>
  );

  const PopoverTranserWarehouse = (
    <Form form={transferForm} className="w-full">
      <div className="flex flex-col w-full">
        <div className="text-medium font-medium mb-[8px]">Chọn kho chuyển</div>
        <Form.Item
          name="from_warehouse_id"
          rules={[
            {
              required: true,
              message: "Kho chuyển là bắt buộc!",
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
        <div className="text-medium font-medium mb-[8px]">Chọn kho nhập</div>
        <Form.Item
          name="to_warehouse_id"
          rules={[
            {
              required: true,
              message: "Kho nhập là bắt buộc!",
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
          Chuyển kho
        </div>
      </div>
    </Form>
  );

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

  const columnAttributes: ColumnsType<ProductAttributeProps> = [
    {
      title: "Thuộc tính",
      width: 148,
      dataIndex: "attribute",
      align: "center",
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
      title: "Giá trị",
      width: 551,
      dataIndex: "typeAttribute",
      align: "left",
      render: (_, record: any) => {
        return (
          <span className="w-full flex items-center justify-between text-sm text-[#4B4B59] font-medium pd-[9px]">
            <span className="w-11/12">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                showArrow
                style={{ width: "100%" }}
                disabled={detail ?? false}
                value={
                  !detail
                    ? [...selectedItemAttributes[record.id]]
                    : selectedItemAttributes[record.id]
                }
                onChange={(e) => handleSelectItemAttributeValue(e, record)}
                options={!detail ? record?.typeAttribute : []}
              />
            </span>
            {!detail && (
              <Popover
                placement="bottomRight"
                content={
                  <div className="flex flex-col w-full">
                    <div className="text-medium font-medium mb-[4px]">
                      Thuộc tính
                    </div>
                    <Input
                      className="rounded-lg"
                      placeholder="nhập"
                      onChange={(e) => setNewItemAttributeValue(e.target.value)}
                      value={newItemAttributeValue}
                    />
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outlined"
                        className="mt-[32px]"
                        text="Huỷ bỏ"
                        width={134}
                        height={45}
                      />
                      <div
                        className="mt-[32px] bg-[#384ADC] text-[#fff] w-[134px] h-[45px] rounded-lg flex justify-center items-center cursor-pointer"
                        onClick={() =>
                          handleAddNewItemAttributeValue(record.id)
                        }
                      >
                        Thêm mới
                      </div>
                    </div>
                  </div>
                }
                title="Thêm kiểu thuộc tính mới"
                trigger="click"
                overlayStyle={{
                  width: "309px",
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

  const arrayColumnItemSkuShow = [
    "show",
    "sku",
    "import_price",
    "price",
    "weight",
    "negative",
    "action",
  ]
    .concat(
      isArray(itemAttributes) && itemAttributes.length > 0 ? "attributes" : "",
    )
    .concat(channels)
    .concat(detail ? "inventory" : "");
  const columnSkusCreate: ColumnsType<ProductDetailProps> = [
    {
      title: "Hiện",
      width: 82,
      key: "id",
      dataIndex: "show",
      fixed: "left",
      align: "center",
      render: (_, record: any) => {
        return (
          <Switch
            checked={record.is_show}
            className="button-switch"
            onChange={(e) => {
              handleChangeItemSku(e, record, "is_show");
            }}
          />
        );
      },
    },
    {
      title: "Mã SKU",
      fixed: "left",
      width: 145,
      dataIndex: "sku",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record?.sku_code || "--"}
        </span>
      ),
    },
    {
      title: "Mẫu mã",
      width: 350,
      dataIndex: "attributes",
      align: "center",
      render: (_, record) => {
        return (
          <div
            className="flex justify-center items-center px-[12px] py-[7px] rounded-lg"
            style={{ border: "1px solid #DADADD" }}
          >
            {!detail ? (
              <div className="text-medium font-medium text-[#4B4B59]">
                {record?.attributes?.map((v: any) => v.label).join(" - ")}
              </div>
            ) : (
              <div>
                {record?.item_attribute_values
                  ?.map((v: any) => v.value)
                  .join(" - ")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Giá bán tại quầy",
      width: 200,
      dataIndex: "OFFLINE",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Giá bán offline"
              value={record?.price_offline}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, "price_offline")
              }
              suffixInput="đ"
            />
          </div>
        );
      },
    },
    {
      title: "Giá bán online",
      width: 200,
      dataIndex: "ONLINE",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Giá bán online"
              value={record?.price_online}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, "price_online")
              }
              suffixInput="đ"
            />
          </div>
        );
      },
    },
    {
      title: "Giá bán tại app",
      width: 200,
      dataIndex: "IN_APP",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <InputCurrency
              placeholder="Giá bán tại app"
              value={record?.price_in_app}
              decimalsLimit={3}
              onValueChange={(e) =>
                handleChangeItemSku(e, record, "price_in_app")
              }
              suffixInput="đ"
            />
          </div>
        );
      },
    },
    {
      title: "Trọng lượng SP",
      width: 170,
      dataIndex: "weight",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex items-center justify-between px-[12px] py-[7px] rounded-lg">
            <Input
              placeholder="Nhập trọng lượng"
              value={record?.weight}
              onChange={(e) => handleChangeItemSku(e, record, "weight")}
              suffix={<span>kg</span>}
            />
          </div>
        );
      },
    },
    {
      title: "Bán âm",
      width: 100,
      dataIndex: "negative",
      align: "center",
      render: (_, record) => {
        return (
          <Checkbox
            checked={record.is_minus_sell}
            onChange={(e) => {
              handleChangeItemSku(e.target.checked, record, "is_minus_sell");
            }}
          />
        );
      },
    },
    {
      title: "Tồn kho",
      width: 100,
      dataIndex: "inventory",
      align: "center",
      render: (_, record: any) => {
        let inventory = 0;
        isArray(get(record, "warehouse_items")) &&
          get(record, "warehouse_items").map((item: any) => {
            inventory += item.quantity;
          });
        return <div>{inventory}</div>;
      },
    },
    {
      title: "Action",
      width: 100,
      dataIndex: "action",
      align: "center",
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
      label: "Tại quầy",
      value: "OFFLINE",
    },
    {
      label: "Online",
      value: "ONLINE",
    },
    {
      label: "App",
      value: "IN_APP",
    },
  ];

  const handleSaveItemSkus = () => {
    const formValue = form.getFieldsValue();
    ItemSkuApi.updateManyItemSku(detail.id, {
      itemSkus: combinations,
      channels: formValue.channels ? formValue.channels : [],
    });
    notification.success({
      message: "Thành công",
      description: "Lưu SKU thành công!",
      placement: "top",
      icon: <Icon icon={"checked-approved"} size={24} />,
    });
  };

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

  const handleImportWarehouse = async () => {
    const body = {
      status: "CREATED",
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
        message: "Tạo phiếu nhập kho thành công!",
        duration: 600,
      });
      window.location.href = `/warehouse/import-commands/update/${data.data.id}`;
    } else {
      notification.error({
        message: "Tạo phiếu nhập kho thất bại!",
        duration: 600,
      });
    }
  };

  const handleSamePrice = (value: any) => {
    if (isSamePrice) {
      form.setFieldValue("price_offline", value);
      form.setFieldValue("price_online", value);
      form.setFieldValue("price_in_app", value);
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
          href="/product/items"
          title={detail ? "Chi tiết sản phẩm" : "Tạo sản phẩm"}
        />
        <div className="flex gap-x-2">
          {detail && (
            <Button
              variant="danger-outlined"
              width={153}
              icon={<Icon icon="trash" size={24} color="#EF4444" />}
              onClick={() => setIsShowModalConfirm(true)}
            >
              Xóa sản phẩm
            </Button>
          )}

          <Button
            variant="secondary"
            width={148}
            style={{ fontWeight: "bold" }}
            onClick={handleSaveProduct}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>
      <Form form={form} onFinish={handleSaveProduct} className="w-full">
        <div className="flex gap-x-3">
          <div
            className="flex flex-col justify-between gap-[4px]"
            style={{ minWidth: "50%", maxWidth: "50%" }}
          >
            <div className="w-full bg-white rounded p-3">
              <div className={styles.row}>
                <div className={styles.row_left_table}>
                  Tên sản phẩm <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm là bắt buộc!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên sản phẩm" required={true} />
                </Form.Item>
              </div>
              {/* <div className="mb-[16px]">
                <div className="text-medium font-medium mb-[12px]">
                  Mô tả/Nội dung
                </div>
                <Form.Item name="description">
                  <TextEditor
                    onChange={(e) => console.log("editor", e)}
                    placeholder="Nhập nội dung"
                  />
                </Form.Item>
              </div> */}
              <div className={styles.row}>
                <div className={styles.row_left_table}>
                  Danh mục <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="item_category_id"
                  rules={[
                    {
                      required: true,
                      message: "Danh mục là bắt buộc!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn danh mục sản phẩm"
                    options={productTypeList}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e);
                    }}
                  />
                </Form.Item>
              </div>
              <div className={classNames(styles.row, "d-none")}>
                <div className={styles.row_left_table}>Kho thao tác</div>
                <Form.Item className="flex flex-1" name="warehouse_id">
                  <Select
                    mode="multiple"
                    showArrow
                    options={warehouses}
                    maxTagCount="responsive"
                    tagRender={tagRender}
                    onChange={handleChangeWarehouse}
                  />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className="text-medium font-medium mb-[30px]">
                  Kênh bán
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
                    <span>Đồng giá trên tất cả kênh bán</span>
                  </div>
                </div>
              </div>
              {!detail && (
                <div>
                  {channels &&
                    isArray(channels) &&
                    channels.includes("OFFLINE") &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Giá bán tại quầy
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_offline"
                        >
                          <Input placeholder="Nhập giá" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nhập giá"
                          onValueChange={(e) => {
                            form.setFieldValue("price_offline", e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  OFFLINE: e,
                                });
                          }}
                          value={priceChannel.OFFLINE}
                          inputMode="decimal"
                          suffixInput="đ"
                        />
                      </div>
                    )}
                  {channels &&
                    isArray(channels) &&
                    channels.includes("ONLINE") &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Giá bán online
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_online"
                        >
                          <Input placeholder="Nhập giá" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nhập giá"
                          onValueChange={(e) => {
                            form.setFieldValue("price_online", e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  ONLINE: e,
                                });
                          }}
                          value={priceChannel.ONLINE}
                          inputMode="decimal"
                          suffixInput="đ"
                        />
                      </div>
                    )}
                  {channels &&
                    isArray(channels) &&
                    channels.includes("IN_APP") &&
                    combinations.length == 0 && (
                      <div className={styles.row}>
                        <div className={styles.row_left_table}>
                          Giá bán tại App
                        </div>
                        <Form.Item
                          className="flex flex-1 d-none"
                          name="price_in_app"
                        >
                          <Input placeholder="Nhập giá" required={true} />
                        </Form.Item>
                        <InputCurrency
                          placeholder="Nhập giá"
                          onValueChange={(e) => {
                            form.setFieldValue("price_in_app", e);
                            isSamePrice
                              ? handleSamePrice(e)
                              : setPriceChannel({
                                  ...priceChannel,
                                  IN_APP: e,
                                });
                          }}
                          value={priceChannel.IN_APP}
                          inputMode="decimal"
                          suffixInput="đ"
                        />
                      </div>
                    )}
                </div>
              )}
              <div className="mb-[16px]">
                <div className="text-medium font-medium mb-[12px]">
                  Hình ảnh sản phẩm
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
                    Thời điểm tạo
                  </div>
                  <div className={styles.row_left_table}>
                    {detail?.createdAt ? detail?.createdAt : ""}
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <Form.Item name="note">
                  <TextArea
                    label="Ghi chú"
                    placeholder="Nhập nội dung"
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
                  Tính tiền theo cân nặng
                </span>
              </div>
              <div className={styles.row}>
                <div>
                  <Form.Item
                    name="notify_when_sold_out"
                    valuePropName="checked"
                  >
                    <Checkbox className="text-medium font-medium">
                      Thông báo khi hết hàng
                    </Checkbox>
                  </Form.Item>
                </div>
                <Form.Item
                  name="notify_quantity"
                  className="flex flex-1"
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      message: "Số lượng không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    suffix={<div>Số lượng</div>}
                    placeholder="Số lượng: Nhập"
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
                    Bán âm (vẫn bán khi hết hàng)
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
            <div className="p-[12px] bg-white rounded">
              <div className={styles.row}>
                <div className="text-[#384ADC] font-semibold text-medium">
                  Danh sách thuộc tính
                </div>
                {!detail && (
                  <div className="w-1/2 flex justify-end items-center">
                    <div className="text-medium font-medium mr-[24px]">
                      Thêm thuộc tính
                    </div>
                    <Select
                      showSearch
                      onInputKeyDown={(e) => {
                        handleKeyDownAddAttribute(e);
                      }}
                      onSearch={(e) => setSearchAttribute(e)}
                      style={{ width: 175 }}
                      placeholder="Chọn"
                      options={productAttributes}
                      disabled={detail ?? false}
                      onChange={(e, option: any) => {
                        handleOnChangeItemAttribute(option.id);
                      }}
                    />
                  </div>
                )}
              </div>
              <Table
                columns={columnAttributes}
                dataSource={[...itemAttributes]}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </Form>
      <div className="w-full flex-col flex gap-[16px] bg-white rounded p-3 my-[12px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-[#384ADC] font-semibold text-medium min-w-[150px]">
            Danh sách mẫu mã
          </div>
          <div className="flex gap-x-2 mt-4 mb-3 w-[795px] justify-end">
            <Popover
              placement="bottomRight"
              content={PopoverAsync}
              trigger="click"
              overlayStyle={{ width: "354px" }}
              className="relative"
            >
              <Button width={195} height={45} className="p-0">
                <div className="w-[200px] flex justify-between p-[10px] items-center">
                  <div className="flex justify-left">
                    <Icon icon="repeat" size={24} className="mr-[10px]" />
                    Đồng bộ
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
                    Nhập kho nhanh
                  </div>
                </div>
              </Button>
            )}
            {detail && (
              <Button
                variant="secondary"
                width={148}
                style={{ fontWeight: "bold" }}
                onClick={handleSaveItemSkus}
              >
                Lưu
              </Button>
            )}
          </div>
        </div>
        <div className="w-full">
          <Table
            loading={loading}
            columns={columnSkusCreate.filter((item: any) =>
              arrayColumnItemSkuShow.includes(item.dataIndex),
            )}
            dataSource={[...combinations]}
            pagination={false}
            scroll={{ x: 50 }}
          />
        </div>
      </div>
      <ModalConfirm
        titleBody="Xóa thông tin sản phẩm?"
        content={
          <div className="text-center">
            Mọi dữ liệu của sản phẩm này <br />
            sẽ bị xoá khỏi hệ thống
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
