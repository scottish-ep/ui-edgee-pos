import { CommandStatus, CommandStatusEnum } from 'enums/enums';
import { StatusEnum } from '../../types';
import { IProduct } from '../products/product.type';

export interface IWareHouses {
  id: string;
  name: string;
  export_name: string;
  note: string;
  quantity: number;
  weight: number;
  totalMoney: number;
  createdAt: Date | number;
  updated_at: Date | number;
  status: StatusEnum;
  cmdEnumStatus: CommandStatusEnum;
  cmdStatus: keyof typeof CommandStatus;
  source: string;
  transport_fee: number;
  transfer_name: string;
  total_transfer_product: number;
  total_transfer: number;
  total_transfer_weight: number;
  batch_value?: number;
  code?: string;
  company_id: number;
  created_user_id: number;
  expired_date: Date | string;
  is_first_create?: boolean;
  remain_value?: number;
  sku: string;
  warehouse_id: number;
  total_import_cost: number;
}

export interface IWareHouseManagement {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  description: string;
  createdAt: Date | number;
  updated_at: string;
  [x: string]: any;
}

export interface IWareHouseManagementDetail {
  id: number;
  name: string;
  phone_number: string;
  province?: string;
  district?: string;
  wards?: string;
  address: string;
  description: string;
  province_id?: string;
  ward_id?: string;
  district_id?: string;
}

export interface IWareHousesDetail {
  id: string;
  export_code: string;
  user: string;
  note: string;
  export_warehouse?: string;
  export_name?: string;
  phone_number?: string;
  export_address?: string;
  address?: string;
  createdAt?: Date | number;
  created_at?: string;
  updatedAt: Date | number;
  code?: string;
  status?: string;
  shipping_id: string;
  product_list: IProduct[];
}

export interface IInventoryWareHouses {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  price: number;
  sale_price: number;
  quantity: number;
  status: StatusEnum;
  discount_percent: number;
  currency: string;
}

export interface IReturnWareHouses {
  id: string;
  type: string;
  reason: string;
  import_name: string;
  quantity: number;
  name: string;
  createdAt: Date | number;
  updatedAt: Date | number;
  status: StatusEnum;
}

export interface IWarehouseList {
  id: number;
  address?: string;
  company_id?: number | string;
  created_at?: string;
  created_user_id?: number;
  description?: string;
  district_id?: string;
  [x: string]: any;
}
