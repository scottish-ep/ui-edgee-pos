import {IWareHouses} from "../warehouses/warehouse.type";

export enum PriceUnitEnum {
  Percentage = "%",
  VND = "đ",
}

export interface IProductOfCombo {
  item_relation_id: string;
  id: string;
  item_id?: number;
  item_sku_id?: number;
  name: string;
  category_id: string;
  category_name: string
  price: number;
  quantity: number;
}

export interface ICombo {
  id: string;
  code: string;
  is_active: boolean;
  apply: boolean;
  name: string;
  channel: string;
  channel_lang: string;
  price: number;
  quantity: number;
  start_date: Date | number;
  end_date: Date | number;
  created_user?: any;
  createdAt: Date | number;
  updatedAt: Date | number;
  productList: IProductOfCombo[];
  warehouseList: number[];
  [x: string]: any
}

export interface ISettingsOfWholeSale {
  id: number | string;
  from_price: number;
  to_price: number;
  price: number;
}

export interface IItemWholeSale {
  id: string;
  is_allow_wholesale: boolean;
  name: string;
  item_category?: {
    id: string | number;
    name?: string;
  };
  item_category_id: string;
  price: number;
  created_at: string;
  updated_at: string;
  code: string | number;
  wholesales_count?: number;
  wholesales?: Array<IWholeSale>;
  [x: string]: any
}

export interface IWholeSale{
  id: string | number;
  item_id: number | string;
  from_price: number;
  to_price: number;
  price: number
}


export interface IProductOfPromotions {
  id: string;
  item_id: string;
  code: string;
  name: string;
  item_category?: {
    id: number;
    name: string;
  };
  price: number;
  discount: {
    price: any;
    unit: PriceUnitEnum;
    discount_price: any;
  };
  warehouse_items_sum_quantity?: any;
  // promotion_price: number;
}
export interface ICategoryOfPromotions {
  id: string;
  label: string;
  discount: {
    price: any;
    unit: PriceUnitEnum;
    discount_price: any;
  };
}

export interface IPromotions {
  id: string;
  apply: boolean;
  sku: string;
  name: string;
  channel: string;
  price: number;
  quantity: number;
  createdAt: Date | number;
  updatedAt: Date | number;
}

export interface IPromotionsDetail {
  id: string;
  name: string;
  type?: string;
  is_active: boolean;
  warehouse_id?: any[];
  item_channel_id?: number;
  warehouses?: any;
  created_user_id?: number;
  createdAt: any;
  updatedAt: any;
  start_date?: any;
  end_date?: any;
  date?: any;
  items: any[];
  categories: any[];
  // productList: IProductOfPromotions[];
  // categoryList: ICategoryOfPromotions[];
  [x: string]: any
}
