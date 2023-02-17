import { StringLiteral } from "typescript/lib/tsserverlibrary";
import { StatusEnum } from "../../types"

export interface ListDebtProps {
    id: string;
    name: string;
    code: string;
    phone: string;
    debt: number;
    note: string;
    status: StatusEnum;
    update_time: string;
}

export interface ListPaymentProps {
    code: string;
    deal_name: string;
    employee: string;
    date: string;
    money: number;
    method: string;
    receive_name: string;
    phone: string;
    status: StatusEnum;
    note: string;
}

export interface ICustomer {
    id: string;
    customer_id?: string;
    name?: string;
    phone_number?: string;
    [x: string]: any
}

export interface IDebtItem {
    id: string;
    debt_id?: string;
    note?: string;
    images?: Array<string>;
    payment_type?: string;
    item_type?: string;
    status?: string;
    created_at: string;
    total_money: number;
    [x: string]: any
}

export interface IDebt {
    id: string;
    code?: string;
    customer_id?: string;
    debt_total: number;
    created_by?: string;
    status?: string;
    note?: string;
    images?: Array<string>;
    [x: string]: any
}

export interface IRevenueExpenditure {
    id: string,
    code: string,
    name: string,
    type?: string,
    created_by_id?: string,
    warehouse_id?: string,
    customer_name?: string,
    customer_phone?: string,
    money?: number,
    payment_type?: string,
    note?: string,
    images?: Array<string>;
    status?: string,
    [x: string]: any
}