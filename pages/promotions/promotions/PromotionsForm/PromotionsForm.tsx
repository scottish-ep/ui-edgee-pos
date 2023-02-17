import { Popover, Radio, Switch, Tag, Form, message } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Button from "../../../../components/Button/Button";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import Select from "../../../../components/Select/Select";
import TitlePage from "../../../../components/TitlePage/Titlepage";
import { promotionProductTypeList } from "../../../../const/constant";
import {
  ICategoryOfPromotions,
  IProductOfPromotions,
  IPromotionsDetail,
  PriceUnitEnum,
} from "../../promotion.type";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import DatePicker from "../../../../components/DateRangePicker/DateRangePicker";
import ProductTable from "./ProductTable";
import CategoryTable from "./CategoryTable";
import InputPrice from "../../../../components/InputPrice/InputPrice";
import ModalRemove from "../../../../components/ModalRemove/ModalRemove";

interface PromotionsFormProps {
  detail?: IPromotionsDetail | null;
}
declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
    loggedInUser: string;
    alertSuccess: any;
    alertDanger: any;
  }
}

import { useDebounce } from "usehooks-ts";
import WarehouseApi from "../../../../services/warehouses";
import ItemSkuApi from "../../../../services/item-skus";
import ItemCategoryApi from "../../../../services/item-categories";
import UserApi from "../../../../services/users";
import PromotionProgramApi from "../../../../services/promotion-programs";
import SearchBoxCustom from "../../../../components/SearchBoxCustom";
import { RangePickerProps } from "antd/lib/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { get } from "lodash";
import { isArray } from "../../../../utils/utils";
import Break from "../../../../components/Break/Break";

dayjs.extend(customParseFormat);

const PromotionsForm: React.FC<PromotionsFormProps> = ({ detail }) => {
  const page = 1;
  const pageSize = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [promotionType, setPromotionType] = useState("item");
  const [productList, setProductList] = useState<IProductOfPromotions[]>([]);
  const [productListSearch, setProductListSearch] = useState<
    IProductOfPromotions[]
  >([]);
  const [categoryList, setCategoryList] = useState<ICategoryOfPromotions[]>([]);
  const [categoryListSearch, setCategoryListSearch] = useState<
    ICategoryOfPromotions[]
  >([]);

  const [isShowModalRemovePromotion, setIsShowModalRemovePromotion] =
    useState(false);
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
  const [userList, setUserList] = useState([]);
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [value, setValue] = useState({
    price: 0,
    unit: PriceUnitEnum.VND,
    discount_price: 0,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const selectedUser = window.loggedInUser;
  const [selectedChannel, setSelectedChannel] = useState(3);
  const [showPopup, setShowPopup] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    getAllWarehouses();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (detail) {
      if (detail.start_date && detail.end_date) {
        detail.start_date = moment(detail.start_date);
        detail.end_date = moment(detail.end_date);
        detail.date = [detail.start_date, detail.end_date];
      }
      if (detail.warehouses) {
        detail.warehouse_id = detail.warehouses.map((v: any) => v.warehouse_id);
      }
      if (!detail.item_channel_id) {
        detail.item_channel_id = 3;
      } else {
        setSelectedChannel(detail.item_channel_id);
      }
      setPromotionType(detail?.type ?? "item");
      if (detail.type == "item") {
        setLoading(true);
        let newProductList: IProductOfPromotions[] = detail.items.map(
          (v: any) => {
            let quantity = 0;
            isArray(get(v, "item_sku.warehouse_items")) &&
              get(v, "item_sku.warehouse_items").map((warehouseItem) => {
                quantity += warehouseItem.quantity;
              });
            return {
              id: v.item_sku_id,
              item_id: v.item_id,
              code: v.item_sku.sku_code,
              name: `${v.item_sku.sku_code} ${v.item.name}`,
              item_category: v.item.item_category,
              price: v.item_sku.price,
              discount: {
                unit: v.discount_type,
                price: v.discount_value,
                discount_price: v.discount_price,
              },
              warehouse_items_sum_quantity: quantity,
            };
          }
        );

        setProductList([...newProductList]);
        setLoading(false);
      } else if (detail.type == "item_category") {
        setLoading(true);
        const newCategoryList: ICategoryOfPromotions[] = detail.categories.map(
          (v: any) => ({
            id: v.id,
            label: v.category?.name,
            discount: {
              unit: v.discount_type,
              price: v.discount_value,
              discount_price: v.discount_price,
            },
          })
        );
        console.log(newCategoryList);

        setCategoryList([...newCategoryList]);
        setLoading(false);
      }
      form.setFieldsValue(detail);
    } else {
      form.setFieldsValue({
        warehouse_id: selectedWarehouse,
        item_channel_id: 3,
        type: promotionType,
      });
    }
  }, [detail]);

  useEffect(() => {
    if (userList.length) {
      const selected: any[] = userList.filter(
        (v: any) => v.value == selectedUser
      );
      form.setFieldsValue({
        ...form.getFieldsValue(),
        created_user_id: selected.length ? selected[0] : null,
      });
    }
  }, [userList]);

  useEffect(() => {
    if (warehouses.length > 1) {
      if (detail && detail.warehouse_id) {
        const selected: any[] = warehouses.filter((v: any) =>
          detail?.warehouse_id?.includes(v.value)
        );

        if (selected.length === warehouses.length - 1) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            warehouse_id: [""],
          });
        }
      }
    }
  }, [warehouses, detail]);

  useEffect(() => {
    if (debouncedSearchTerm !== null) {
      handleOnSearchItem();
    }
  }, [debouncedSearchTerm, promotionType]);

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

  const getAllUsers = async () => {
    const data = await UserApi.getUser();
    setUserList(
      data.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    );
  };

  const handleOnSearchItem = async () => {
    if (promotionType === "item") {
      setLoading(true);
      const { data } = await ItemSkuApi.getItemSku({
        limit: pageSize,
        page: page,
        name: searchKey,
        channel_code:
          selectedChannel === 3
            ? "OFFLINE"
            : selectedChannel === 2
            ? "ONLINE"
            : "IN_APP",
      });

      setProductListSearch(
        data.map((v: any) => ({
          ...v,
          discount: {
            unit: PriceUnitEnum.VND,
            price: 0,
            discount_price: Number(v.price).toLocaleString(),
          },
        }))
      );
      setShowPopup(true);
      setLoading(false);
    } else {
      setLoading(true);
      const { data } = await ItemCategoryApi.getItemCategory({
        limit: pageSize,
        page: page,
        name: searchKey,
      });
      setCategoryListSearch(
        data.map((v: any) => ({
          ...v,
          id: v.value,
          discount: {
            unit: PriceUnitEnum.VND,
            price: 0,
            discount_price: 0,
          },
        }))
      );
      setShowPopup(true);
      setLoading(false);
    }
  };

  const handleChangeWarehouse = (value) => {
    console.log(
      "🚀 ~ file: PromotionsForm.tsx:235 ~ handleChangeWarehouse ~ value",
      value
    );
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

  const handleChangeChannel = (e) => {
    setSelectedChannel(e.target.value);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      item_channel_id: e.target.value,
    });
  };

  const handleConfirmDelete = async () => {
    setIsShowModalRemovePromotion(false);
    if (detail) {
      const { data } = await PromotionProgramApi.deleteManyPromotionPrograms([
        detail.id,
      ]);
      if (data) {
        window.alert(data);
        setTimeout(() => {
          window.location.href = "/promotion-programs";
        }, 2000);
      }
    }
  };

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

  const handleChangeDiscount = () => {
    if (promotionType === "item") {
      setProductList((prevProductList) =>
        prevProductList.map((product) => ({
          ...product,
          discount: {
            price: value.price,
            unit: value.unit,
            discount_price:
              value.unit === PriceUnitEnum.VND
                ? Number(product.price - value.price).toLocaleString()
                : Number(
                    product.price - (product.price / 100) * value.price
                  ).toLocaleString(),
          },
        }))
      );
    } else {
      setCategoryList((prevCategoryList) =>
        prevCategoryList.map((category) => ({
          ...category,
          discount: {
            price: value.price,
            unit: value.unit,
            discount_price: 0,
          },
        }))
      );
    }
  };

  const handleSelectDateRange = (value) => {
    setStartDate(value[0]);
    setEndDate(value[1]);
  };

  const handleSavePromotion = () => {
    const formValue = form.getFieldsValue();
    form
      .validateFields()
      .then(async () => {
        if (detail) {
          const { data } = await PromotionProgramApi.updatePromotionProgram(
            detail.id,
            {
              ...formValue,
              productList: productList.map((v: IProductOfPromotions) => ({
                id: v.id,
                item_id: v.item_id,
                discount: v.discount,
              })),
              categoryList: categoryList.map((v: ICategoryOfPromotions) => ({
                id: v.id,
                discount: v.discount,
              })),
            }
          );
          if (data) {
            window.location.href = `/promotion-programs/detail/${detail.id}`;
          }
        } else {
          if (productList.length === 0 && categoryList.length === 0) {
            window.alertDanger(
              "Chưa có sản phẩm trong chương trình khuyến mãi"
            );
            return;
          }
          const { data } = await PromotionProgramApi.addPromotionProgram({
            ...formValue,
            productList: productList.map((v: IProductOfPromotions) => ({
              id: v.id,
              item_id: v.item_id,
              discount: v.discount,
            })),
            categoryList: categoryList.map((v: ICategoryOfPromotions) => ({
              id: v.id,
              discount: v.discount,
            })),
          });
          if (data) {
            window.location.href = `/promotion-programs/detail/${data.id}`;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeSync = (value, unit) => {
    console.log(
      "🚀 ~ file: PromotionsForm.tsx:382 ~ handleChangeSync ~ unit",
      unit
    );
    console.log(
      "🚀 ~ file: PromotionsForm.tsx:382 ~ handleChangeSync ~ value",
      value
    );
    let val = value;
    if (value < 0) {
      message.error("Giá trị không hợp lệ!");
      val = 0;
    }
    if (unit === "%") {
      if (value > 100) {
        message.error("Giá trị không hợp lệ!");
        val = 0;
      }
    }
    setValue({ price: val, unit, discount_price: 0 });
  };

  const handleAddItems = (item) => {
    if (productList.some((it) => item.id === it.id)) {
      message.error("Sản phẩm đã được thêm!");
      return;
    }
    setProductList([...productList, item]);
  };

  const handleAddCates = (item) => {
    if (categoryList.some((it) => item.id === it.id)) {
      message.error("Danh mục đã được thêm!");
      return;
    }
    setCategoryList([...categoryList, item]);
  };

  const RenderContent = () => {
    return promotionType === "item" ? (
      <ul>
        {productListSearch?.map((item) => {
          return (
            <li
              key={item?.id}
              className="pointer font-medium mb-[8px] flex flex-col item-center justify-between"
              onClick={() => handleAddItems(item)}
            >
              <div>{item?.name}</div>
              <div style={{ minWidth: 70 }} className="mb-[5px]">
                Tồn kho: {item.warehouse_items_sum_quantity}
              </div>
              <Break />
            </li>
          );
        })}
      </ul>
    ) : (
      <ul>
        {categoryListSearch?.map((item) => {
          return (
            <li
              key={item?.id}
              className="pointer font-medium mb-[8px] "
              onClick={() => handleAddCates(item)}
            >
              {item?.label}
            </li>
          );
        })}
      </ul>
    );
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleRemove = async () => {
    const { data } = await PromotionProgramApi.deleteManyPromotionPrograms([
      detail?.id,
    ]);
    if (data) {
      message.success("Xóa thành công");
      window.location.href = "/promotion-programs";
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <TitlePage
          href="/promotion-programs"
          title={
            detail
              ? "Chi tiết chương trình khuyến mãi"
              : "Tạo chương trình khuyến mãi"
          }
        />
        <div className="flex gap-x-2">
          {detail && (
            <Button
              variant="danger-outlined"
              width={134}
              icon={<Icon icon="trash" size={24} />}
              onClick={() => setIsShowModalRemovePromotion(true)}
            >
              Xóa
            </Button>
          )}

          <Button
            variant="secondary"
            width={148}
            style={{ fontWeight: "bold" }}
            onClick={handleSavePromotion}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>

      <Form form={form} className="w-full">
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Tên CTKM *
              </span>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên CTKM là bắt buộc!",
                  },
                ]}
              >
                <Input
                  className="flex-1"
                  placeholder="Nhập tên CTKM"
                  required={true}
                />
              </Form.Item>
            </div>

            {detail?.code ? (
              <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
                <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                  Mã CTKM
                </span>
                <span className="text-medium font-medium text-[#2E2D3D]">
                  {detail?.code || "-"}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Thời điểm tạo:
              </span>
              <span className="text-medium font-medium text-[#2E2D3D]">
                {detail ? detail.createdAt : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Nhân viên tạo
              </span>
              <Form.Item name="created_user_id">
                <Select
                  containerClassName="flex-1"
                  placeholder="Chọn nhân viên tạo"
                  options={userList}
                  value={detail?.created_user_id ?? selectedUser}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Chọn kho
              </span>
              <Form.Item name="warehouse_id">
                <Select
                  style={{ width: 285 }}
                  maxTagCount="responsive"
                  containerClassName="flex-1"
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  options={warehouses}
                  onChange={handleChangeWarehouse}
                />
              </Form.Item>
            </div>
            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Chọn kênh áp dụng
              </span>
              <Form.Item name="item_channel_id" valuePropName="checked">
                <Radio.Group
                  className="flex justify-around flex-1"
                  onChange={handleChangeChannel}
                  value={selectedChannel}
                >
                  <Radio value={3}>Tại quầy</Radio>
                  <Radio value={2}>Online</Radio>
                  <Radio value={1}>App</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="flex gap-x-6 items-center">
              <div className="flex gap-x-2 items-center w-[180px]">
                <Form.Item name="is_active" valuePropName="checked">
                  <Switch
                    className="button-switch"
                    defaultChecked={detail?.is_active}
                  />
                </Form.Item>
                <span className="text-medium font-medium text-[#2E2D3D]">
                  Thời gian áp dụng *
                </span>
              </div>
              <Form.Item
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Thời gian áp dụng là bắt buộc!",
                  },
                ]}
              >
                <DatePicker
                  className="flex-1"
                  width={397}
                  placeholder={["Ngày/tháng/năm - ", "Ngày tháng/năm"]}
                  onChange={handleSelectDateRange}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </div>
            <div className="flex items-center justify-between gap-x-6 min-h-[40px]">
              <span className="text-medium font-medium text-[#2E2D3D] w-[180px]">
                Chọn sản phẩm KM
              </span>
              <Form.Item name="type">
                <Select
                  containerClassName="flex-1"
                  placeholder="Chọn sản phẩm KM"
                  value={promotionType}
                  defaultValue={"item"}
                  disabled={detail ? true : false}
                  onChange={(value) => setPromotionType(value)}
                  options={promotionProductTypeList}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>

      <div className="flex gap-x-2 mt-4 mb-3">
        {/* <Input
          className="w-50"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder={
            promotionType === "item"
              ? "Nhập mã sản phẩm / tên sản phẩm"
              : "Nhập mã/tên danh mục"
          }
          disabled={detail ? true : false}
          onChange={(e) => setSearchKey(e.target.value)}
        /> */}

        <SearchBoxCustom
          placeholder={
            promotionType === "item"
              ? "Nhập mã sản phẩm / tên sản phẩm"
              : "Nhập mã/tên danh mục"
          }
          // disabled={detail ? true : false}
          onChange={(e) => setSearchKey(e.target.value)}
          showPopup={showPopup}
          value={searchKey ?? ""}
          containerClassName="w-[700px]"
          onClose={() => {
            setShowPopup(false);
          }}
          popupContent={
            <div>
              <RenderContent />
            </div>
          }
        />

        <Popover
          placement="topRight"
          content={
            <React.Fragment>
              <div className="flex items-center justify-center gap-x-6">
                <span className="w-[126px] text-medium font-medium text-[#2E2D3D]">
                  Khuyến mãi
                </span>
                <InputPrice
                  width={242}
                  placeholder="Nhập"
                  value={value.price}
                  onChange={(value, unit) => handleChangeSync(value, unit)}
                />
              </div>
              <div className="border-[0.5px] border-[#DADADDs] my-2"></div>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  width={242}
                  onClick={handleChangeDiscount}
                >
                  Đồng bộ
                </Button>
              </div>
            </React.Fragment>
          }
          trigger="click"
          className="relative"
        >
          <Select
            prefix={<Icon icon="repeat" size={24} color="#5F5E6B" />}
            value="Đồng bộ"
            width={195}
            open={false}
          />
        </Popover>
      </div>

      {promotionType === "item" ? (
        <ProductTable
          productList={productList}
          setProductList={setProductList}
          loading={loading}
          // disabledInput={detail ? true : false}
        />
      ) : (
        <CategoryTable
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          loading={loading}
          // disabledInput={detail ? true : false}
        />
      )}

      <ModalRemove
        isVisible={isShowModalRemovePromotion}
        onClose={() => setIsShowModalRemovePromotion(false)}
        onOpen={handleConfirmDelete}
        titleBody="Xóa chương trình khuyến mãi này?"
        content="Thông tin của chương trình khuyến mãi sẽ không còn nữa."
        onOk={handleRemove}
      />
    </div>
  );
};

export default PromotionsForm;
