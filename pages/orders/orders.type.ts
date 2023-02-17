import { StatusEnum } from "../../types";

export interface IOrderChecks {
  id: string;
  code?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  transport_company?: string;
  order_check_number?: number;
  status?: string;
  note?: string;
  warehouse: string;
}

export interface IOrderOfOrderChecks {
  id: string;
  statusOrder: string;
  codSystem: number;
  codNVC: number;
  priceSystem: number;
  priceNVC: number;
  weightSystem: number;
  weightNVC: number;
  result: string;
  price: number;
  status: StatusEnum;
}

export interface IOrderChecksDetail {
  id: string;
  created_at: string;
  updated_at: string;
  code?: string;
  user_name: string;
  transport_company_name: string;
  warehoure_name: string;
  status: string;
  note: string;
  [x: string]: any
}

export interface IOrderCheckCommandItems {
  id: string;
  created_at: string;
  updated_at: string;
  command_id?: string;
  order_id?: string;
  order_tracking_code?: string;
  order_status?: string;
  system_cod_fee_vendor: number;
  system_transport_fee_vendor: number;
  system_weight_vendor: number;
  cod_fee_vendor: number;
  transport_fee_vendor: number;
  weight_vendor: number;
  item_status?: string;
  order_check_result?: string;
  [x: string]: any
}

export interface IContainerManagement {
  id: string;
  name: string;
  code: string;
  price: number;
  is_enable: boolean;
  size: string;
  weight: string;
  max_weight_product: string;
  product_category_ids: Array<number>;
  item_box_warehouse_inventory_sum_quantity?: number;
  categories: Array<ICategory>;
  item_box_warehouse_inventory?: Array<ItemBoxWarehouseInventory>;
  [x:string]: any
}

export interface ItemBoxWarehouseInventory{
  id: string | number;
  item_box_id?: string | number;
  warehouse_id?: string | number;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICategory {
  id: number;
  created_at?: string;
  company_id?: string;
  image?: string;
  name?: string;
  updated_at?: string;
}
export interface IOrderOfContainerManagement {
  id: string;
  status: StatusEnum;
  createdAt: Date | number;
  updatedAt: Date | number;
  name: string;
  price: number;
  weight: number;
}

export interface IContainerManagementDetail {
  id: string;
  name: string;
  price: number;
  apply: boolean;
  size: string;
  weightContainer: number;
  weightProduct: number;
  category_ids: string[];
  orders: IOrderOfContainerManagement[];
}
