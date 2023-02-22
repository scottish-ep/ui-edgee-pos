import {
  IContainerManagement,
  IContainerManagementDetail,
  IOrderChecksDetail,
} from './../pages/orders/orders.type';
import { ActionSystemLogEnum } from './../pages/systems/system.type';
import {
  IPromotionsDetail,
  PriceUnitEnum,
} from './../pages/promotions/promotion.type';
import { StatusEnum, StatusList } from '../types';
import {
  CommandStatus,
  CommandStatusEnum,
  ModuleLogAction,
  TargetStatusEnum,
} from '../enums/enums';
import { IsProduct } from 'pages/products/product.type';
export const orderStatus = [
  {
    label: 'Tạo mới',
    value: 1,
    is_show_order_list: true,
    index: 0,
    id: 1,
  },
  {
    label: 'Xác nhận',
    value: 2,
    is_show_order_list: true,
    index: 3,
    id: 2,
  },
  {
    label: 'Chờ xử lý',
    value: 3,
    is_show_order_list: true,
    index: 1,
    id: 3,
  },
  {
    label: 'Chờ đủ hàng',
    value: 4,
    is_show_order_list: true,
    index: 1,
    id: 4,
  },
  {
    label: 'Đã đủ hàng',
    value: 5,
    is_show_order_list: true,
    index: 2,
    id: 5,
  },
  {
    label: 'Đã xử lý',
    value: 6,
    is_show_order_list: true,
    index: 2,
    id: 6,
  },
  {
    label: 'Đã in',
    value: 7,
    is_show_order_list: true,
    index: 4,
    id: 7,
  },
  {
    label: 'Đang giao',
    value: 8,
    is_show_order_list: true,
    index: 5,
    id: 8,
  },
  {
    label: 'Đã nhận',
    value: 9,
    is_show_order_list: true,
    index: 6,
    id: 9,
  },
  {
    label: 'Đang hoàn',
    value: 10,
    is_show_order_list: true,
    index: 7,
    id: 10,
  },
  {
    label: 'Hoàn 1 phần',
    value: 11,
    is_show_order_list: true,
    index: 8,
    id: 11,
  },
  {
    label: 'Hoàn toàn bộ',
    value: 12,
    is_show_order_list: true,
    index: 9,
    id: 12,
  },
  {
    label: 'Đã đổi',
    value: 13,
    is_show_order_list: false,
    index: 0,
    id: 13,
  },
  {
    label: 'Huỷ',
    value: 14,
    is_show_order_list: true,
    index: 10,
    id: 14,
  },
  {
    label: 'Đã xoá',
    value: 15,
    is_show_order_list: false,
    index: 0,
    id: 15,
  },
  {
    label: 'Nháp',
    value: 16,
    is_show_order_list: false,
    index: 0,
    id: 16,
  },
];

export const warehouseManagementList = [
  {
    id: '1',
    name: 'Tổng kho Linh Dương',
    phone_number: '0953321365',
    address:
      '40 Phạm Quang Lịch, tổ 21, phường Tiền Phong, thành phố Thái Bình, Thái Bình',
    note: 'Kho hàng chính',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'Siêu thị tiện ích',
    phone_number: '0956321365',
    address:
      '40 Phạm Quang Lịch, tổ 21, phường Tiền Phong, thành phố Thái Bình, Thái Bình',
    note: 'Cửa hàng 1',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: 'LD Mart',
    phone_number: '0956321365',
    address:
      '40 Phạm Quang Lịch, tổ 21, phường Tiền Phong, thành phố Thái Bình, Thái Bình',
    note: 'Cửa hàng 2',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const warehouseManagementDetail = {
  id: '1',
  name: 'Tổng kho Linh Dương',
  phone_number: '0956321365',
  province: 'Thái Bình',
  district: 'TP. Thái Bình',
  wards: 'Phường Tiền Phong',
  street_name: '40 Phạm Văn Lịch, Tổ 21',
  note: 'Kho hàng chính',
};

export const containerManagementList: IContainerManagement[] = Array(50)
  .fill({
    quantity: 1000,
    close: 600,
    total: 400,
    name: 'Thùng xốp vừa',
  })
  .map((item, index) => ({
    ...item,
    id: `TH00${index + 1}`,
    apply: index % 2 === 0 ? true : false,
    size: index % 2 === 0 ? '25x30x30 (M)' : 'XL',
    price: index % 2 === 0 ? 30000 : 35000,
    category_ids:
      index % 2 === 0
        ? ['Tất cả']
        : ['Thực phẩm', 'Hoa quả', 'Đồ tươi', 'Đông lạnh'],
    weight: index % 2 === 0 ? 5 : 15,
  }));

export const containerManagementDetail: IContainerManagementDetail = {
  id: 'TH001',
  name: 'Thùng xốp vừa',
  price: 30000,
  apply: true,
  size: '25x30x30 (M)',
  weightContainer: 0.03,
  weightProduct: 5,
  category_ids: ['Thực phẩm', 'Hoa quả'],
  orders: Array(10)
    .fill({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: StatusEnum.IMPORTED,
      price: 75000,
      weight: 3.4,
      name: 'LD Mart Bưởi Da xanh',
    })
    .map((item, index) => ({ ...item, id: `DO${index + 1}` })),
};

export const orderChecksList = Array(50)
  .fill({
    name: 'Yến Nhi',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    shippingUnit: 'Ninjavan',
    quantity: 100,
    status: StatusEnum.NEW,
    note: 'Đối soát ngày 21/09/2022',
  })
  .map((item, index) => ({ ...item, id: `C00${index + 1}` }));

export const systemLogList = Array(50)
  .fill({
    name: 'Ngọc Linh',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  .map((item, index) => ({
    ...item,
    id: index + 1,
    module: index % 2 === 0 ? 'Sản phẩm' : 'Xác thực',
    action:
      index % 2 === 0
        ? ActionSystemLogEnum.CREATED
        : ActionSystemLogEnum.DELETED,
    description: {
      text: index % 2 === 0 ? 'Thêm mới sản phẩm' : 'Xóa sản phẩm',
      id: index % 2 === 0 ? '#5553' : 'BHV001 | Bàn chải đánh răng điện',
    },
  }));

export const listDayCompare = [
  {
    label: '7 ngày qua',
    value: '7 ngày qua',
  },
  {
    label: '14 ngày qua',
    value: '14 ngày qua',
  },
  {
    label: '30 ngày qua',
    value: '30 ngày qua',
  },
  {
    label: '3 tháng trước',
    value: '3 tháng trước',
  },
  {
    label: '6 tháng trước',
    value: '6 tháng trước',
  },
];

// export const promotionsDetail: IPromotionsDetail = {
//   id: "1",
//   is_active: true,
//   name: "Áo thun basic cotton",
//
//   // productList: Array(5)
//   //   .fill({
//   //     sku: 5555,
//   //     name: "Áo thun basic cotton",
//   //     category_id: "Áo",
//   //     price: 120000,
//   //     promotion_price: 0,
//   //     unit: "đ",
//   //   })
//   //   .map((item, index) => ({
//   //     ...item,
//   //     id: index + 1,
//   //     discount: {
//   //       quantity: index % 2 === 0 ? 20 : 50000,
//   //       unit: index % 2 === 0 ? PriceUnitEnum.Percentage : PriceUnitEnum.VND,
//   //     },
//   //   })),
//   // categoryList: Array(5)
//   //   .fill({
//   //     sku: 5555,
//   //     name: "Áo",
//   //   })
//   //   .map((item, index) => ({
//   //     ...item,
//   //     id: index + 1,
//   //     discount: {
//   //       quantity: index % 2 === 0 ? 20 : 50000,
//   //       unit: index % 2 === 0 ? PriceUnitEnum.Percentage : PriceUnitEnum.VND,
//   //     },
//   //   })),
//   createdAt: Date.now(),
//   updatedAt: Date.now(),
// };

export const comboList = Array(50)
  .fill({
    name: 'Combo 3 áo thun basic cotton',
    price: 250000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    productList: Array(5)
      .fill({
        name: 'Nước rửa chén sunlight trà xanh',
        quantity: 1,
      })
      .map((item, index) => ({
        ...item,
        id: index + 1,
        sku: 'SKu' + (index + 1),
        price: index % 2 === 0 ? 50000 : 15000,
        category_id: index % 2 === 0 ? 'Gia dụng' : 'Cá nhân',
      })),
  })
  .map((item, index) => ({
    ...item,
    id: 'CB000' + (index + 1),
    apply: index % 2 === 0 ? true : false,
    quantity: index % 2 === 0 ? 1 : 3,
    channel: index % 2 === 0 ? 'Tại quầy' : 'Online',
  }));

export const wholeSaleList = Array(50)
  .fill({
    name: 'Áo thun basic cotton',
    category_id: 'Áo',
    price: 120000,
    quantity: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settingList: Array(5)
      .fill({
        from: 0,
        to: 0,
      })
      .map((item, index) => ({ ...item, id: index + 1 })),
  })
  .map((item, index) => ({
    ...item,
    id: 'KH' + (index + 1),
    isWholeSale: index % 2 === 0 ? true : false,
  }));

export const liveStreamAppList = Array(50)
  .fill({
    name: 'Sale hot đầu tháng 10',
    quantity: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  .map((item, index) => ({
    ...item,
    id: index + 1,
    status: index % 2 === 0 ? StatusEnum.COMPLETED : StatusEnum.NOT_HAPPENDED,
  }));

export const liveStreamAppDetail = {
  id: '1',
  name: 'Hàng sale 10.10',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  commentList: Array(20)
    .fill({
      name: 'Nguyen Hien',
      comment: '039.625.1023 em 1 chiếc nhé',
      phone: '0396251023',
      netWorkProviders: 'Viettel',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .map((item, index) => ({ ...item, id: index + 1 })),
  productList: Array(10)
    .fill({
      name: 'Áo thun basic cotton',
      category_id: 'Áo',
      price: 120000,
      discount: 99000,
    })
    .map((item, index) => ({ ...item, id: index + 1 })),
};

export const productList = Array(50)
  .fill({
    name: 'Áo thun basic cotton - Trắng - S',
    sku: '555501S',
    category_id: 'Áo',
    import_price: 25000,
    sale_price: 150000,
    quantity: 500,
  })
  .map((item, index) => ({
    ...item,
    id: index + 1,
    status: index % 2 === 0 ? StatusEnum.NEAR_EXPIRE : StatusEnum.SELLING,
  }));

export const returnWareHouseList = Array(50)
  .fill({
    type: 'Đơn hoàn',
    reason: 'Hàng không đúng mô tả',
    import_name: 'Tổng kho Linh Dương',
    quantity: 3,
    name: 'Nguyễn Văn A',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  .map((item, index) => ({
    ...item,
    id: `KH00${index + 1}`,
    status: index % 2 === 0 ? StatusEnum.NEW : StatusEnum.COMPLETED,
  }));

export const listDebtDetail = Array(50).fill({
  id: '123',
  time: '19/09/2022 - 13:05',
  deal: 150.0,
  method: 'Đơn hàng',
  content: 'Đơn hoàn #madonhang',
  status: StatusEnum.PENDING,
});

export const listTarget = Array(50).fill({
  name: 'Chỉ tiêu tháng 9',
  time: '01/09/2022 - 30/09/2022',
  status: StatusEnum.HAPPENING,
});

export const list_Debt = Array(50)
  .fill({
    id: 'CN0001',
    name: 'Tran Huyen',
    code: 'KH0021',
    phone: '0936.216.320',
    debt: 1200000,
    note: 'Công thợ theo đơn hoàn',
    status: StatusEnum.PENDING,
    update_time: '19/09/2022 - 13:05',
  })
  .map((item, index) => ({ ...item, id: `KH${index + 1}` }));

export const wareHouseList = Array(50)
  .fill({
    name: 'Nguyễn Văn A',
    export_name: 'Kho tổng Linh Dương',
    note: 'Đơn hàng #009NHG',
    code: '123',
    quantity: 10,
    weight: 2,
    totalMoney: 120000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    updated_at: Date.now(),
    status: StatusEnum.NEW,
    source: 'Công ty ABC',
    transport_fee: 120000,
    transfer_name: 'Kho tổng Linh Dương',
    total_transfer_product: 3,
    total_transfer: 100,
    total_transfer_weight: 0,
    cmdEnumStatus: 'COMPLETED',
  })
  .map((item, index) => ({ ...item, id: `KH${index + 1}` }));

export const itemSkuList = [
  {
    actual_remain: 10,
    is_show: true,
    id: 10,
    item: {
      name: 't-shirt',
      item_category: {
        name: 'shirt',
      },
    },
    warehouse_item: {
      quantity: 10,
    },
    item_sku: {
      item: {
        name: "Ao",
        item_category: {
          name: "Den"
        }
      },
      item_attribute_values: [
        {
          id: '1',
          value: "Tshirt Size S mau trang",
        },
      ],
    },
    name: 't-shirt',
    category_id: '12',
    export_price: 10,
    import_price: 10,
    export_quantity: 10,
    import_quantity: 10,
    export_weight: 10,
    import_weight: 10,
    money: 10,
    number_package: 10,
    unit_package: 10,
    total_money: 10,
    quantity_transfer: 10,
    weight_transfer: 10,
    quantity_can_transfer: 10,
    weight_can_transfer: 10,
    quantity: 10,
    weight: 10,
    is_minus_sell: true,
    price: 10,
    discount: 10,
    price_online: 10,
    price_offline: 10,
    price_in_app: 10,
  },
];

export const paymentList = Array(50)
  .fill({
    code: 'C004',
    deal_name: 'Tiền điện',
    employee: 'Yến Nhi',
    date: '09:23 - 21/09/2022',
    money: 500.0,
    method: 'Tiền mặt',
    receive_name: 'Anh Ước',
    phone: '0922.562.888',
    status: StatusEnum.PENDING,
    note: 'Có hoá đơn',
  })
  .map((item, index) => ({ ...item, id: `KH${index + 1}` }));

export const wareHouseDetail = {
  id: 'EP01',
  export_code: 'BHV0021',
  user: 'Nguyễn Văn A',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  note: 'Xuất đơn hàng #NJV098HJG',
  export_name: 'Kho tổng Linh Dương',
  export_warehouse: 'Kho tổng Linh Dương',
  phone_number: '0987987456',
  export_address:
    'Số nhà 40, đường Phạm Quang Lịch, tổ 21, phường Tiền Phong, thành phố Thái Bình, Thái Bình',
  address: '',
  shipping_id: 'Ninjavan',
  product_list: Array(5)
    .fill({
      name: '555501 | Áo thun basic cotton - Trắng - S',
      category_id: 'Áo',
      export_price: 150000,
      import_price: 150000,
      export_quantity: 1,
      import_quantity: 1,
      export_weight: 0,
      import_weight: 0,
      money: 150000,
      number_package: 10,
      unit_package: 30000,
      total_money: 0,
      quantity_transfer: 0,
      weight_transfer: 0,
      quantity_can_transfer: 549,
      weight_can_transfer: 0,
    })
    .map((item, index) => ({ ...item, id: index + 1 })),
};

export const warehouses: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Kho tổng Linh Dương',
    value: 'Kho tổng Linh Dương',
  },
  {
    label: 'Kho tổng Linh Đan',
    value: 'Kho tổng Linh Đan',
  },
  {
    label: 'Kho tổng Linh Thị',
    value: 'Kho tổng Linh Thị',
  },
];

export const employeeProcess: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Nguyễn Văn A',
    value: 'Nguyễn Văn A',
  },
  {
    label: 'Nguyễn Văn B',
    value: 'Nguyễn Văn B',
  },
  {
    label: 'Nguyễn Văn C',
    value: 'Nguyễn Văn C',
  },
];

export const shippingUnitList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Ninjavan',
    value: 'Ninjavan',
  },
  {
    label: 'Son Hun Sai',
    value: 'Son Hun Sai',
  },
  {
    label: 'SaiGon',
    value: 'SaiGon',
  },
];

export const priceShippingList: {
  label: string;
  value: number;
}[] = [
  {
    label: '30.000',
    value: 30000,
  },
  {
    label: '100.000',
    value: 100000,
  },
  {
    label: '500.000',
    value: 500000,
  },
  {
    label: '1.000.000',
    value: 1000000,
  },
];

export const supplierList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Công Ty Văn Lang',
    value: 'Công Ty Văn Lang',
  },
  {
    label: 'Công Ty Hoan Hao',
    value: 'Công Ty Hoan Hao',
  },
  {
    label: 'Công Ty Sai Gon',
    value: 'Công Ty Sai Gon',
  },
];

export const payBackList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Đơn hoàn',
    value: 'Đơn hoàn',
  },
  {
    label: 'Đơn hoàn 1 phần',
    value: 'Đơn hoàn 1 phần',
  },
  {
    label: 'Đơn đổi 1 phần',
    value: 'Đơn đổi 1 phần',
  },
  {
    label: 'Đơn huỷ',
    value: 'Đơn huỷ',
  },
];

export const reasonList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Hàng không đúng mô tả',
    value: 'Hàng không đúng mô tả',
  },
  {
    label: 'Sản phẩm không đúng mẫu mã',
    value: 'Sản phẩm không đúng mẫu mã',
  },
];

export const statusOptions: {
  value: StatusEnum;
  label: string;
}[] = [
  {
    value: StatusEnum.PENDING,
    label:
      StatusList.find((status) => status.value === StatusEnum.PENDING)?.name ||
      '',
  },
  {
    value: StatusEnum.PAY,
    label:
      StatusList.find((status) => status.value === StatusEnum.PAY)?.name || '',
  },
  {
    value: StatusEnum.RECEIVE,
    label:
      StatusList.find((status) => status.value === StatusEnum.RECEIVE)?.name ||
      '',
  },
];

export const statusExportWareHouseOptions: {
  value: StatusEnum;
  label: string;
}[] = [
  {
    value: StatusEnum.NEW,
    label:
      StatusList.find((status) => status.value === StatusEnum.NEW)?.name || '',
  },
  {
    value: StatusEnum.DELIVERED,
    label:
      StatusList.find((status) => status.value === StatusEnum.DELIVERED)
        ?.name || '',
  },
  {
    value: StatusEnum.CANCEL,
    label:
      StatusList.find((status) => status.value === StatusEnum.CANCEL)?.name ||
      '',
  },
];

export const statusImportWareHouseOptions: {
  value: StatusEnum;
  label: string;
}[] = [
  {
    value: StatusEnum.CREATED,
    label:
      StatusList.find((status) => status.value === StatusEnum.CREATED)?.name ||
      '',
  },
  {
    value: StatusEnum.COMPLETED,
    label:
      StatusList.find((status) => status.value === StatusEnum.COMPLETED)
        ?.name || '',
  },
  {
    value: StatusEnum.CANCELED,
    label:
      StatusList.find((status) => status.value === StatusEnum.CANCELED)?.name ||
      '',
  },
];

export const statusTransferWareHouseOptions: {
  value: string;
  label: string;
}[] = [
  {
    value: CommandStatus.CREATED,
    label: 'Mới',
  },
  {
    value: CommandStatus.COMPLETED,
    label: 'Đơn chuyển hàng',
  },
  {
    value: CommandStatus.CANCEL,
    label: 'Đã nhập hàng',
  },
];

export const statusBalanceReturnWareHouseOptions: {
  value: StatusEnum;
  label: string;
}[] = [
  {
    value: StatusEnum.NEW,
    label:
      StatusList.find((status) => status.value === StatusEnum.NEW)?.name || '',
  },
  {
    value: StatusEnum.COMPLETED,
    label:
      StatusList.find((status) => status.value === StatusEnum.COMPLETED)
        ?.name || '',
  },
  {
    value: StatusEnum.CANCEL,
    label:
      StatusList.find((status) => status.value === StatusEnum.CANCEL)?.name ||
      '',
  },
];

export const statusOrderChecksOptions: {
  value: StatusEnum;
  label: string;
}[] = [
  {
    value: StatusEnum.CHECKED,
    label:
      StatusList.find((status) => status.value === StatusEnum.CHECKED)?.name ||
      '',
  },
  {
    value: StatusEnum.UNCHECKED,
    label:
      StatusList.find((status) => status.value === StatusEnum.UNCHECKED)
        ?.name || '',
  },
];

export const productTypeList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Áo',
    value: 'Áo',
  },
  {
    label: 'Quần',
    value: 'Quần',
  },
  {
    label: 'Giày dép',
    value: 'Giày dép',
  },
  {
    label: 'Mỹ phẩm',
    value: 'Mỹ phẩm',
  },
  {
    label: 'TP chức năng',
    value: 'TP chức năng',
  },
  {
    label: 'Đồ khô',
    value: 'Đồ khô',
  },
];

export const productDetail = {
  id: '5555',
  name: 'Áo thun basic cotton',
  createdAt: Date.now(),
  expireDate: Date.now(),
};

export const productAttributes = [
  {
    label: 'Màu sắc',
    value: 'Màu sắc',
  },
  {
    label: 'Size',
    value: 'Size',
  },
  {
    label: 'Vị',
    value: 'Vị',
  },
];

export const groupStaff = [
  {
    label: 'Nhóm nhân viên 1',
    value: 'Nhóm nhân viên 1',
  },
  {
    label: 'Nhóm nhân viên 2',
    value: 'Nhóm nhân viên 2',
  },
  {
    label: 'Nhóm nhân viên 3',
    value: 'Nhóm nhân viên 3',
  },
];

export const filterCommentList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Tất cả bình luận',
    value: '',
  },
  {
    label: 'Bình luận chứa số điện thoại',
    value: 'phone',
  },
];

export const searchTypeList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Sản phẩm',
    value: 'product',
  },
  {
    label: 'Mẫu mã',
    value: 'sku',
  },
];

export const promotionProductTypeList: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Sản phẩm',
    value: 'item',
  },
  {
    label: 'Danh mục sản phẩm',
    value: 'item_category',
  },
];

export const actionList: {
  label: string;
  value: string;
}[] = [
  {
    value: 'CREATED',
    label: 'Thêm mới',
  },
  {
    value: 'UPDATED',
    label: 'Cập nhật',
  },
  {
    value: 'DELETED',
    label: 'Xóa',
  },
];

export const moduleList: {
  label: string;
  value: string;
}[] = [
  {
    value: 'Đơn hàng',
    label: 'Đơn hàng',
  },
  {
    value: 'Sản phẩm',
    label: 'Sản phẩm',
  },
  {
    value: 'Kho',
    label: 'Kho',
  },
];

export const categoryOrderTypeList: {
  label: string;
  value: string;
}[] = [
  {
    value: 'Thực phẩm',
    label: 'Thực phẩm',
  },
  {
    value: 'Hoa quả',
    label: 'Hoa quả',
  },
  {
    value: 'Đồ tươi',
    label: 'Đồ tươi',
  },
  {
    value: 'Đông lạnh',
    label: 'Đông lạnh',
  },
  {
    value: 'Mỹ phẩm',
    label: 'Mỹ phẩm',
  },
  {
    value: 'Quần',
    label: 'Quần',
  },
  {
    value: 'Áo',
    label: 'Áo',
  },
  {
    value: 'Giày dép',
    label: 'Giày dép',
  },
  {
    value: 'Gia dụng',
    label: 'Gia dụng',
  },
  {
    value: 'Đồ khô',
    label: 'Đồ khô',
  },
];

export const provinceList: {
  label: string;
  value: string | number;
  id: number | string;
}[] = [
  {
    id: 1,
    value: 1,
    label: 'Hồ Chí Minh',
  },
  {
    id: 2,
    value: 2,
    label: 'Hà Nội',
  },
  {
    id: 3,
    value: 3,
    label: 'Đà Nẵng',
  },
  {
    id: 4,
    value: 4,
    label: 'Bình Dương',
  },
];

export const districtList: {
  label: string;
  value: string | number;
  id: number | string;
}[] = [
  {
    id: 1,
    label: 'Huyện Bình Chánh',
    value: 1,
  },
  {
    id: 2,
    label: 'Quận Bình Tân',
    value: 2,
  },
  {
    id: 3,
    label: 'Quận Bình Thạnh',
    value: 3,
  },
  {
    id: 4,
    label: 'Huyện Cần Giờ',
    value: 4,
  },
];

export const wardList: {
  label: string;
  value: string | number;
  id: number | string;
}[] = [
  {
    id: 1,
    value: 1,
    label: 'Xã An Phú Tây',
  },
  {
    id: 2,
    value: 2,
    label: 'Xã Bình Chánh',
  },
  {
    id: 3,
    value: 3,
    label: 'Xã Bình Hưng',
  },
];

export const customerLevelColor = {
  'Khách hàng mới': '#0EA5E9',
  Đồng: '#F97316',
  Bạc: '#909098',
  Vàng: '#EAB308',
  'Kim cương': '#8B5CF6',
};

export const warehouseStatusOption = [
  {
    value: CommandStatusEnum.CREATED,
    label: 'Mới',
  },
  {
    value: CommandStatusEnum.COMPLETED,
    label: 'Hoàn tất',
  },
  {
    value: CommandStatusEnum.PROCESSING,
    label: 'Đang chuyển hàng',
  },
  {
    value: CommandStatusEnum.CANCELED,
    label: 'Huỷ',
  },
];

export const warehouseBalanceStatusOption = [
  {
    value: CommandStatusEnum.CREATED,
    label: 'Mới',
  },
  {
    value: CommandStatusEnum.COMPLETED,
    label: 'Hoàn tất',
  },
  {
    value: CommandStatusEnum.CANCELED,
    label: 'Huỷ',
  },
];

export const warehouseStatusColor = [
  {
    label: 'INIT',
    id: 1,
    value: '#2E2D3D',
  },
  {
    label: 'CONFIRMED',
    id: 2,
    value: '#404FCC',
  },
  {
    label: 'PROCESS_WAITING',
    id: 3,
    value: '#404FCC',
  },
  {
    label: 'STOCK_WAITING',
    id: 4,
    value: '#404FCC',
  },
  {
    label: 'STOCK_OK',
    id: 5,
    value: '#404FCC',
  },
  {
    label: 'PRINT_WAITING',
    id: 6,
    value: '#404FCC',
  },
  {
    label: 'PRINT_OK',
    id: 7,
    value: '#FFCD3D',
  },
  {
    label: 'PICKUP_SENT',
    id: 8,
    value: '#FFCD3D',
  },
  {
    label: 'PICKUP_RECEIVED',
    id: 9,
    value: '#1CBF73',
  },
  {
    label: 'PICKUP_RETURNING',
    id: 10,
    value: '#1d1c2d',
  },
  {
    label: 'RETURN_PARTIAL',
    id: 11,
    value: '#1d1c2d',
  },
  {
    label: 'PICKUP_RETURNED',
    id: 12,
    value: '#1d1c2d',
  },
  {
    label: 'CHANGED',
    id: 13,
    value: '#1d1c2d',
  },
  {
    label: 'CANCELLED',
    id: 14,
    value: '#EF4444',
  },
  {
    label: 'DELETED',
    id: 15,
    value: '#EF4444',
  },
];

export const TargetStatus = {
  [TargetStatusEnum.CREATED]: {
    color: '#0EA5E9',
    status: TargetStatusEnum.CREATED,
    label: 'Chưa diễn ra',
  },
  [TargetStatusEnum.PROCESSING]: {
    color: '#10B981',
    status: TargetStatusEnum.PROCESSING,
    label: 'Đang diễn ra',
  },
  [TargetStatusEnum.COMPLETED]: {
    color: '#909098',
    status: TargetStatusEnum.COMPLETED,
    label: 'Đã hoàn thành',
  },
};

export const orderCheckCommandColor = [
  {
    label: 'Chưa đối soát',
    value: '#F97316',
  },
  {
    label: 'Đã đối soát',
    value: '#10B981',
  },
];
