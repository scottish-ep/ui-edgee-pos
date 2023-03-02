import { StatusEnum } from "../../types";

export interface IsProduct {
  order_id?: string | number;
  show?: boolean | number;
  phone: string | number;
  delivery_id?: string;
  order_status_id?: number;
  total_product_cost?: number;
  total_cost?: number;
  total_pay?: number;
  total_transfer?: number;
  id?: number | string;
  code?: string;
  attr_code?: string;
  attr_name?: string;
  attr_type?: {label?: string; value?: string}[];
  img?: string;
  name: string;
  image?: string;
  category?: string;
  total?: number | number;
  models?: number;
  numberSale?: number;
  price?: number | string;
  totalPrice?: number | string;
  createdAt?: string;
  updatedAt?: string;
  outOfDate?: string;
  expired_date?: string;
  is_show?: boolean;
  status?: StatusEnum;
  is_minus_sell?: boolean;
  price_online?: number;
  price_offline?: number;
  price_in_app?: number;
  created_at?: any;
  actual_remain?: number;
  payment_method_id?: number;
  printed_at?: any;
  need_return_money?: boolean;
  order_item_skus?: any[];
  quantity?: number;
  total_quantity_import?: number;
  currency?: number;
}

export interface IProduct {
  actual_remain?: number;
  is_show?: boolean;
  id: number | string;
  name: string;
  category_id: string;
  export_price: number;
  import_price: number;
  export_quantity: number;
  import_quantity: number;
  export_weight: number;
  import_weight: number;
  money: number;
  number_package: number;
  unit_package: number;
  total_money: number;
  quantity_transfer: number;
  weight_transfer: number;
  quantity_can_transfer: number;
  weight_can_transfer: number;
  quantity: number;
  weight: number;
  is_minus_sell?: boolean;
  price: number;
  discount: number;
  price_online?: number;
  price_offline?: number;
  price_in_app?: number;
}

export interface ProductAttributeProps {
  attribute_list?: any;
  id: string;
  attribute: string;
  typeAttribute: any;
}

export interface AttributeList {
  id: number | string;
  name: string;
  value: number | string;
}


export interface ProductDetailProps {
  show?: boolean | number;
  is_show?: boolean | number;
  sku_code?: string;
  price?: number;
  import_price?: number;
  inputNum?: number;
  saleNum?: number;
  type?: string;
  is_minus_sell?: boolean;
  weight?: number;
  negative?: boolean;
  item_attribute_values?:any,
  attributes?: any,
  price_online?: number,
  price_offline?: number,
  price_in_app?: number,
  qr_link?: string,
}

export interface ProductMetricsProps {
  totalCanSell: number | string;
  totalAlreadySell: number | string;
  totalRemain: number | string;
}

