import { StatusEnum } from "../../types";

export interface ITartget {
  name: string;
  time: string;
  status: StatusEnum;
}

export interface ITartgetManageProps {
  show?: boolean | number;
  img?: string;
  name?: string;
  id?: string;
  role?: string;
  order: number;
  profit: number;
  kpiorder: number;
  kpiprofit: number;
  orderSum: number;
  orderProfit: number;
  orderKpiOrder: number;
  orderKpiProfit: number;
  month: string;
  category?: string;
  total_order: number;
  total_order_handle: number;
  total_order_price: number;
  total_revenue: number;
  staff_group_id: number;
  from: string;
  to: string;
}

export interface IStaffListProps {
  show?: boolean | number;
  img: string;
  name?: string;
  id?: string;
  phone?: string;
  role?: string;
  staff_group?: string;
  store?: string;
  staff_errors_count: number;
  error: number;
}

export interface IFaultDetailProps {
  id: string;
  name?: string;
  fault?: number;
  update?: string;
  error: {
    name: string;
  };
  number_violations: number;
  updated_at: string;
}

export interface GroupList {
  list: any[];
}
