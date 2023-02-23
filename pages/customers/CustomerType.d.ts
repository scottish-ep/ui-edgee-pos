export interface CustomerType {
    key?: string | number;
    is_block?: boolean | number;
    is_bad?: boolean;
    email?: string;
    id: string | number;
    name?: string;
    phone_number?: string;
    customerLvName?: string;
    orderTotalCount?: number | string;
    printed?: number | string;
    received?: number | string;
    orderReturn?: number | string;
    orderReturnAPart?: number | string;
    successCost?: number | string;
    lastBuy?: string;
    count_print_order?: number;
    count_received_order?: number;
    count_return_order?: number;
    count_partial_return_order?: number;
    avatar?: string;
    updated_at?: Date | number;
  }
