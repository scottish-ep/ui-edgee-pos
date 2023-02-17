export interface IPermission {
  id: string | number;
  name: string;
  number_of_member?: number;
  updated_at?: string;
  note?: string;
}

export interface IOption {
  value: string | number;
  label: string | number;
}

export interface IPermissionDetail {
  parent: IOption;
  child: Array<{
    groupOption?: IOption;
    options?: Array<IOption>;
  }>;
}

export const permissionCheckboxList = [
  {
    parent: {
      value: "don_hang",
      label: "Đơn hàng",
    },
    child: [
      {
        groupOption: {
          value: "DH_0",
          label: "Đơn hàng",
        },
        options: [
          {
            value: "DH_1",
            label: "Xem",
          },
          {
            value: "DH_2",
            label: "Chỉnh sửa",
          },
          {
            value: "DH_3",
            label: "Tạo đơn hàng online",
          },
          {
            value: "DH_4",
            label: "Tạo đơn hàng tại quầy",
          },
          {
            value: "DH_5",
            label: "Xóa",
          },
          {
            value: "DH_6",
            label: "Xuất file",
          },
          {
            value: "DH_7",
            label: "Đổi trạng thái đơn hàng",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "san_pham",
      label: "Sản phẩm",
    },
    child: [
      {
        groupOption: {
          value: "SP_0",
          label: "Đơn hàng",
        },
        options: [
          {
            value: "SP_1",
            label: "Xem",
          },
          {
            value: "SP_2",
            label: "Chỉnh sửa",
          },
          {
            value: "SP_3",
            label: "Tạo mới",
          },
          {
            value: "SP_4",
            label: "Xóa",
          },
          {
            value: "SP_5",
            label: "Duyệt",
          },
          {
            value: "SP_6",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "livestream",
      label: "Bán hàng livestream",
    },
    child: [
      {
        groupOption: {
          value: "LIVESTREAM_0",
          label: "Đơn hàng",
        },
        options: [
          {
            value: "LIVESTREAM_1",
            label: "Xem",
          },
          {
            value: "LIVESTREAM_2",
            label: "Chỉnh sửa",
          },
          {
            value: "LIVESTREAM_3",
            label: "Tạo mới",
          },
          {
            value: "LIVESTREAM_4",
            label: "Xóa",
          },
          {
            value: "LIVESTREAM_5",
            label: "Duyệt",
          },
          {
            value: "LIVESTREAM_6",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "nghiep_vu_kho",
      label: "Nghiệp vụ kho",
    },
    child: [
      {
        groupOption: {
          value: "xuat_kho",
          label: "Xuất kho",
        },
        options: [
          {
            value: "XK_1",
            label: "Xem",
          },
          {
            value: "XK_2",
            label: "Chỉnh sửa",
          },
          {
            value: "XK_3",
            label: "Tạo mới",
          },
          {
            value: "XK_4",
            label: "Xóa",
          },
          {
            value: "XK_5",
            label: "Duyệt",
          },
          {
            value: "XK_6",
            label: "Xuất file",
          },
        ],
      },
      {
        groupOption: {
          value: "nhap_kho",
          label: "Nhập kho",
        },
        options: [
          {
            value: "NK_1",
            label: "Xem",
          },
          {
            value: "NK_2",
            label: "Chỉnh sửa",
          },
          {
            value: "NK_3",
            label: "Tạo mới",
          },
          {
            value: "NK_4",
            label: "Xóa",
          },
          {
            value: "NK_5",
            label: "Duyệt",
          },
          {
            value: "NK_6",
            label: "Xuất file",
          },
        ],
      },
      {
        groupOption: {
          value: "chuyen_kho",
          label: "Chuyển kho",
        },
        options: [
          {
            value: "CK_1",
            label: "Xem",
          },
          {
            value: "CK_2",
            label: "Chỉnh sửa",
          },
          {
            value: "CK_3",
            label: "Tạo mới",
          },
          {
            value: "CK_4",
            label: "Xóa",
          },
          {
            value: "CK_5",
            label: "Duyệt",
          },
          {
            value: "CK_6",
            label: "Xuất file",
          },
        ],
      },
      {
        groupOption: {
          value: "can_bang_kho",
          label: "Cân bằng kho",
        },
        options: [
          {
            value: "CBK_1",
            label: "Xem",
          },
          {
            value: "CBK_2",
            label: "Chỉnh sửa",
          },
          {
            value: "CBK_3",
            label: "Tạo mới",
          },
          {
            value: "CBK_4",
            label: "Xóa",
          },
          {
            value: "CBK_5",
            label: "Duyệt",
          },
          {
            value: "CBK_6",
            label: "Xuất file",
          },
        ],
      },
      {
        groupOption: {
          value: "tra_hang",
          label: "Trả hàng",
        },
        options: [
          {
            value: "TH_1",
            label: "Xem",
          },
          {
            value: "TH_2",
            label: "Chỉnh sửa",
          },
          {
            value: "TH_3",
            label: "Tạo mới",
          },
          {
            value: "TH_4",
            label: "Xóa",
          },
          {
            value: "TH_5",
            label: "Duyệt",
          },
          {
            value: "TH_6",
            label: "Xuất file",
          },
        ],
      },
      {
        groupOption: {
          value: "cai_dat_kho",
          label: "Cài đặt kho",
        },
        options: [
          {
            value: "CDK_1",
            label: "Xem",
          },
          {
            value: "CDK_2",
            label: "Chỉnh sửa",
          },
          {
            value: "CDK_3",
            label: "Tạo mới",
          },
          {
            value: "CDK_4",
            label: "Xóa",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "DSDH",
      label: "Đối soát đơn hàng",
    },
    child: [
      {
        groupOption: {
          value: "DSDH_0",
          label: "Đối soát đơn hàng",
        },
        options: [
          {
            value: "DSDH_1",
            label: "Xem",
          },
          {
            value: "DSDH_2",
            label: "Chỉnh sửa",
          },
          {
            value: "DSDH_3",
            label: "Tạo mới",
          },
          {
            value: "DSDH_4",
            label: "Xóa",
          },
          {
            value: "DSDH_5",
            label: "Nhập file",
          },
          {
            value: "DSDH_6",
            label: "Xuất file",
          },
          {
            value: "DSDH_7",
            label: "Duyệt",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "KHACH_HANG",
      label: "Khách hàng",
    },
    child: [
      {
        groupOption: {
          value: "KHACH_HANG_0",
          label: "Khách hàng",
        },
        options: [
          {
            value: "KHACH_HANG_1",
            label: "Xem",
          },
          {
            value: "KHACH_HANG_2",
            label: "Chỉnh sửa",
          },
          {
            value: "KHACH_HANG_3",
            label: "Tạo mới",
          },
          {
            value: "KHACH_HANG_4",
            label: "Xóa",
          },
          {
            value: "KHACH_HANG_5",
            label: "Nhập file",
          },
          {
            value: "KHACH_HANG_6",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "KHUYEN_MAI",
      label: "Khuyến mãi",
    },
    child: [
      {
        groupOption: {
          value: "KHUYEN_MAI_0",
          label: "Khuyến mãi",
        },
        options: [
          {
            value: "KHUYEN_MAI_1",
            label: "Xem",
          },
          {
            value: "KHUYEN_MAI_2",
            label: "Chỉnh sửa",
          },
          {
            value: "KHUYEN_MAI_3",
            label: "Tạo mới",
          },
          {
            value: "KHUYEN_MAI_4",
            label: "Xóa",
          },
          {
            value: "KHUYEN_MAI_5",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "TCCN",
      label: "Quản lý thu chi, công nợ",
    },
    child: [
      {
        groupOption: {
          value: "TCCN_0",
          label: "Quản lý thu chi, công nợ",
        },
        options: [
          {
            value: "TCCN_1",
            label: "Xem",
          },
          {
            value: "TCCN_2",
            label: "Chỉnh sửa",
          },
          {
            value: "TCCN_3",
            label: "Tạo mới",
          },
          {
            value: "TCCN_4",
            label: "Xóa",
          },
          {
            value: "TCCN_5",
            label: "Xuất file",
          },
          {
            value: "TCCN_6",
            label: "Duyệt",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "QLUD",
      label: "Quản lý ứng dụng",
    },
    child: [
      {
        groupOption: {
          value: "QLUD_0",
          label: "Quản lý ứng dụng",
        },
        options: [
          {
            value: "QLUD_1",
            label: "Xem",
          },
          {
            value: "QLUD_2",
            label: "Chỉnh sửa",
          },
          {
            value: "QLUD_3",
            label: "Tạo mới",
          },
          {
            value: "QLUD_4",
            label: "Xóa",
          },
          {
            value: "QLUD_5",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "CDCT",
      label: "Cài đặt chỉ tiêu",
    },
    child: [
      {
        groupOption: {
          value: "CDCT_0",
          label: "Cài đặt chỉ tiêu",
        },
        options: [
          {
            value: "CDCT_1",
            label: "Xem",
          },
          {
            value: "CDCT_2",
            label: "Chỉnh sửa",
          },
          {
            value: "CDCT_3",
            label: "Tạo mới",
          },
          {
            value: "CDCT_4",
            label: "Xóa",
          },
          {
            value: "CDCT_5",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "BCTK",
      label: "Báo cáo, thống kê",
    },
    child: [
      {
        groupOption: {
          value: "BCTK_0",
          label: "Báo cáo, thống kê",
        },
        options: [
          {
            value: "BCTK_1",
            label: "Xem",
          },
          {
            value: "BCTK_2",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
  {
    parent: {
      value: "CDHT",
      label: "Cài đặt hệ thống",
    },
    child: [
      {
        groupOption: {
          value: "CDHT_0",
          label: "Cài đặt hệ thống",
        },
        options: [
          {
            value: "CDHT_1",
            label: "Xem",
          },
          {
            value: "CDHT_2",
            label: "Chỉnh sửa",
          },
          {
            value: "CDHT_3",
            label: "Tạo mới",
          },
          {
            value: "CDHT_4",
            label: "Xóa",
          },
          {
            value: "CDHT_6",
            label: "Xuất file",
          },
        ],
      },
    ],
  },
];
