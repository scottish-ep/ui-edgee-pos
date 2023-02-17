import { notification } from "antd";
import { differenceInMinutes } from "date-fns";
import { get } from "lodash";
import React from "react";
import { TargetStatus } from "../const/constant";
import {
  LevelCustomer,
  ModuleLog,
  ModuleLogAction,
  ModuleLogActionEnum,
  OrderEnumId,
} from "../enums/enums";

export const isArray = (items: any) => {
  return Array.isArray(items) && items.length > 0;
};

export const formatCustomers = (rawCustomers: any) =>
  isArray(rawCustomers)
    ? rawCustomers.map((item: any) => formatCustomer(item))
    : [];

export const formatCustomer = (item: any) => ({
  key: item?.id,
  address: item?.address,
  age: item?.age,
  ageId: item?.age_id,
  avatar: item?.avatar || get(item, "user.avatar"),
  birthday: item?.birthday,
  city_id: item?.city_id,
  class_id: item?.class_id,
  company_id: item?.company_id || 1,
  created_at: item?.created_at,
  customer_level: item?.customer_level,
  deleted_at: item?.deleted_at,
  district_id: item?.district_id,
  email: item?.email || get(item, "user.email"),
  id: item?.id,
  is_block: item?.is_block,
  is_taken_by: item?.is_taken_by,
  name: item?.name || get(item, "user.name"),
  note: item?.note,
  phone_number: item?.phone_number || get(item, "user.phone"),
  points: item?.points,
  sex: item?.sex,
  source_id: item?.source_id,
  customer_tag_id: item?.customer_tag_id,
  status_tag: item?.status_tag,
  tags: item?.tags || [],
  type_id: item?.type_id,
  updated_at: item?.updated_at,
  user: item.user ? formatUser(item?.user) : {},
  is_bad: item?.is_bad || false,
  create_user: item.create_user,
  note_bad: item.note_bad || "",
  is_in_app: item.is_in_app || false,
  customer_tags: item.customer_tag_relations
    ? item.customer_tag_relations.map((v: any) => {
        return {
          id: v?.tag_info?.id,
          label: v?.tag_info.label,
          value: v?.tag_info?.value,
        };
      })
    : [],
});

export const formatUser = (user: any) => ({
  avatar: user.avatar,
  createdAt: user.created_at,
  customerId: user.customer_id,
  deletedAt: user.deleted_at,
  email: user.email,
  id: user.id,
  name: user.name,
  otp: user.otp,
  phone: user.phone,
  updatedAt: user.updated_at,
  verifiedAt: user.verified_at,
});

export const formatCustomerResources = (items: any) =>
  isArray(items)
    ? items.map((item: any) => ({
        name: item.name,
        value: item.value,
        label: item.label,
        id: item.id,
      }))
    : [];

export const onCoppy = (
  event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  text: string | number
) => {
  event.stopPropagation();
  navigator.clipboard.writeText(text.toString());
  notification.success({
    message: "Thành công!",
    description: "Coppy successfully",
  });
};

export const renderLevelCustomer = (points: number) => {
  let data: {
    color: string;
    type: string;
  } = {
    color: "#0EA5E9",
    type: "KH mới",
  };
  if (499 > points && points > 9) {
    data = {
      color: "#F97316",
      type: "Đồng",
    };
  } else if (points < 999) {
    data = {
      color: "#5F5E6B",
      type: "Bạc",
    };
  } else {
    data = {
      color: "#EAB308",
      type: "Vàng",
    };
  }
  return data;
};

export const randomId = () => Math.floor(Math.random() * 10000000);

export const calcWithPoints = (points: any) => {
  let width = 1;
  if (parseFloat(points) <= 100) {
    console.log(1);
    width = (parseFloat(points) / 100) * 100;
  } else if (parseFloat(points) <= 500) {
    console.log(2);
    console.log("calc", ((parseFloat(points) - 100) / 500) * 100);
    width = ((parseFloat(points) - 100) / 500) * 100;
  } else if (parseFloat(points) <= 1000) {
    console.log(3);
    width = ((parseFloat(points) - 500) / 1000) * 100;
  } else if (parseFloat(points) <= 2000) {
    console.log(4);
    width = ((parseFloat(points) - 1000) / 2000) * 100;
  } else if (parseFloat(points) >= 2001) {
    console.log(5);
    return 100;
  }
  console.log("width", width);
  return width;
};

export const randomColor = () =>
  Math.floor(Math.random() * 16777215).toString(16);

export const handleDirect = (data: any) => {
  if (
    data.module === ModuleLog.ORDER &&
    data.action !== ModuleLogActionEnum.DELETED
  ) {
    if (get(data, "order.order_status.id") === OrderEnumId.DRAFT) {
      if (get(data, "order.order_type") == 1) {
        window.location.href = `/order-management/add/order-online?order-type=1`;
      } else {
        window.location.href = `/order-management/add/order-offline?order-type=2`;
      }
    } else {
      if (get(data, "order.order_type") == 1) {
        window.location.href = `/order-management/edit/order-online/${data.order.id}`;
      } else {
        window.location.href = `/order-management/edit/order-offline/${data.order.id}`;
      }
    }
  } else if (data.module === ModuleLog.WAREHOUSE) {
    window.location.href = `/warehouse/import-commands/update/${data.import_command.id}`;
  }
};

export const calcTimeTarget = (from: any, to: any) => {
  const dateNow = Date.now();
  const differenceFrom = differenceInMinutes(from, dateNow);
  const differenceTo = differenceInMinutes(to, dateNow);
  let status: any = {};
  if (differenceTo > 0 && differenceFrom > 0) {
    // status.color = "#0EA5E9";
    // status.status = "Chưa diễn ra";
    status = TargetStatus.CREATED;
  } else if (differenceTo < 0 && differenceFrom < 0) {
    // status.color = "#909098";
    // status.status = "Đã diễn ra";
    status = TargetStatus.COMPLETED;
  } else {
    // status.color = "#10B981";
    // status.status = "Đang diễn ra";
    status = TargetStatus.PROCESSING;
  }
  return status;
};

export const getMin = (a: number, b: number) => {
  if (a >= b) {
    return b;
  }
  return a;
};

export const parseItemSkus = (data: any[]) => {
  let rawData: any[] = [];
  isArray(data) &&
    data.map((item: any) => {
      let nameSku = item.name;
      isArray(item.item_attribute_values) &&
        item.item_attribute_values.map((attr: any, index: any) => {
          if (index == 0) {
            nameSku += " | " + attr.value;
          } else {
            nameSku += " - " + attr.value;
          }
        });
      let category = item.item_category ? item.item_category.name : "";

      rawData.push({
        id: item.id,
        code: item.code,
        is_allow_wholesale: item.is_allow_wholesale,
        is_minus_sell: item.is_minus_sell,
        is_show: item.is_show,
        item_id: item.item_id,
        name: nameSku,
        qr_link: item.qr_link,
        sku_code: item.sku_code,
        category: category,
        manufactured_date: null,
        total_package_price: 0,
        total_package: 0,
        weight: 0,
        expired_date: null,
        quantity: 0,
        import_price: 0,
        money: 0,
        total_money: 0,
      });
    });
  return rawData;
};

export const parseItemSkuFromCommandItems = (data: any[]) => {
  let rawData: any[] = [];
  isArray(data) &&
    data.map((item: any) => {
      console.log("item", item);
      let nameSku = get(item, "item_sku.item.name");
      isArray(get(item, "item_sku.item_attribute_values")) &&
        get(item, "item_sku.item_attribute_values").map((attr: any, index: any) => {
          if (index == 0) {
            nameSku += " | " + attr.value;
          } else {
            nameSku += " - " + attr.value;
          }
        });
      let category = get(item, "item_sku.item.item_category")
        ? get(item, "item_sku.item.item_category.name")
        : "";

      rawData.push({
        id: get(item, "item_sku.id"),
        code: get(item, "item_sku.code"),
        is_allow_wholesale: get(item, "item_sku.is_allow_wholesale"),
        is_minus_sell: get(item, "item_sku.is_minus_sell"),
        is_show: get(item, "item_sku.is_show"),
        item_id: get(item, "item_sku.item_id"),
        name: nameSku,
        qr_link: get(item, "item_sku.qr_link"),
        sku_code: get(item, "item_sku.sku_code"),
        category: category,
        manufactured_date: item.manufactured_date,
        total_package_price: parseFloat(item.total_package_price),
        total_package: parseFloat(item.total_package),
        weight: parseFloat(item.weight),
        expired_date: item.expired_date,
        quantity: parseFloat(item.quantity),
        import_price: parseFloat(item.import_price),
        money:
          parseFloat(item.quantity || 0) * parseFloat(item.import_price || 0),
        total_money:
          parseFloat(item.quantity || 0) * parseFloat(item.import_price || 0) +
          parseFloat(item.total_package || 0) +
          parseFloat(item.total_package_price || 0),
      });
    });
  return rawData;
};
