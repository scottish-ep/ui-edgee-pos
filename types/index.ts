import {
  CommandStatusEnum,
  LivestreamStatusColorEnum,
  LivestreamStatusEnum,
} from "../enums/enums";

export enum StatusEnum {
  COMPLETED = "COMPLETED",
  CREATED = "CREATED",
  CANCEL = "CANCEL",
  CANCELED = "CANCELED",
  NEW = "NEW",
  IMPORTED = "IMPORTED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CAN_SALES = "CAN_SALES",
  NEAR_EXPIRE = "NEAR_EXPIRE",
  NEARLY_OUT_OF_STOCK = "NEARLY_OUT_OF_STOCK",
  EXPIRE = "EXPIRE",
  HIDDEN = "HIDDEN",
  PROCESSING = "PROCESSING",
  PENDING = "PENDING",
  SELLING = "SELLING",
  PAY = "PAY",
  RECEIVE = "RECEIVE",
  LOCK = "LOCK",
  HAPPENING = "HAPPENING",
  NOT_HAPPENDED = "NOT_HAPPENDED",
  CHECKED = "CHECKED",
  UNCHECKED = "UNCHECKED",
  DELETED = "DELETED",
}

export enum StatusColorEnum {
  COMPLETED = "#6366F1",
  CREATED = "#10B981",
  CANCEL = "#EF4444",
  CANCELED = "#EF4444",
  NEW = "#10B981",
  IMPORTED = "#6366F1",
  SHIPPED = "#8B5CF6",
  DELIVERED = "#0EA5E9",
  CAN_SALES = "#10B981",
  NEAR_EXPIRE = "#EAB308",
  EXPIRE = "#EF4444",
  HIDDEN = "#F97316",
  PROCESSING = "#F97316",
  SELLING = "#384ADC",
  PENDING = "#8B5CF6",
  PAY = "#EF4444",
  RECEIVE = "#384ADC",
  LOCK = "#384ADC",
  HAPPENING = "#10B981",
  NOT_HAPPENDED = "#4B4B59",
  CHECKED = "#10B981",
  UNCHECKED = "#F97316",
  DELETED = "#EF4444",
  NEARLY_OUT_OF_STOCK = "#F97316",
}

export const StatusList = [
  {
    value: StatusEnum.NEW,
    name: "Mới",
  },
  {
    value: StatusEnum.SHIPPED,
    name: "Đã gửi hàng",
  },
  {
    value: StatusEnum.DELIVERED,
    name: "Đã xuất hàng",
  },
  {
    value: StatusEnum.IMPORTED,
    name: "Đã nhập hàng",
  },
  {
    value: StatusEnum.CANCEL,
    name: "Đã huỷ",
  },
  {
    value: StatusEnum.CANCELED,
    name: "Đã huỷ",
  },
  {
    value: StatusEnum.CAN_SALES,
    name: "Có thể bán",
  },
  {
    value: StatusEnum.NEAR_EXPIRE,
    name: "Sắp hết hạn",
  },
  {
    value: StatusEnum.NEARLY_OUT_OF_STOCK,
    name: "Gần hết hàng",
  },
  {
    value: StatusEnum.EXPIRE,
    name: "Hết hạn",
  },
  {
    value: StatusEnum.HIDDEN,
    name: "Ẩn",
  },
  {
    value: StatusEnum.PROCESSING,
    name: "Đang chuyển hàng",
  },
  {
    value: StatusEnum.COMPLETED,
    name: "Đã nhập hàng",
  },
  {
    value: StatusEnum.SELLING,
    name: "Bán chạy",
  },
  {
    value: StatusEnum.PENDING,
    name: "Chờ duyệt",
  },
  {
    value: StatusEnum.PAY,
    name: "Đã chi",
  },
  {
    value: StatusEnum.RECEIVE,
    name: "Đã thu",
  },
  {
    value: StatusEnum.LOCK,
    name: "Đã khoá",
  },
  {
    value: StatusEnum.HAPPENING,
    name: "Đang diễn ra",
  },
  {
    value: StatusEnum.NOT_HAPPENDED,
    name: "Chưa diễn ra",
  },
  {
    value: StatusEnum.CHECKED,
    name: "Đã đối soát",
  },
  {
    value: StatusEnum.UNCHECKED,
    name: "Chưa đối soát",
  },
  {
    value: StatusEnum.DELETED,
    name: "Xóa",
  },
  {
    value: StatusEnum.CREATED,
    name: "Mới",
  },
];

export const warehouseStatusList = [
  {
    value: CommandStatusEnum.CREATED,
    name: "Mới",
  },
  {
    value: CommandStatusEnum.CANCELED,
    name: "Huỷ",
  },
  {
    value: CommandStatusEnum.COMPLETED,
    name: "Đã nhập hàng",
  },
];

export const warehouseTransferStatusList = [
  {
    value: CommandStatusEnum.CREATED,
    name: "Mới",
  },
  {
    value: CommandStatusEnum.CANCELED,
    name: "Huỷ",
  },
  {
    value: CommandStatusEnum.COMPLETED,
    name: "Hoàn tất",
  },
  {
    value: CommandStatusEnum.PROCESSING,
    name: "Đang chuyển hàng",
  },
];

export const LivestreamStatusList = [
  {
    value: LivestreamStatusEnum.CREATED,
    name: "Chưa diễn ra",
    color: LivestreamStatusColorEnum.CREATED,
  },
  {
    value: LivestreamStatusEnum.CANCELLED,
    name: "Kết thúc",
    color: LivestreamStatusColorEnum.CANCELED,
  },
  {
    value: LivestreamStatusEnum.COMPLETED,
    name: "Hoàn tất",
    color: LivestreamStatusColorEnum.COMPLETED,
  },
  {
    value: LivestreamStatusEnum.PROCESSING,
    name: "Đang diễn ra",
    color: LivestreamStatusColorEnum.PROCESSING,
  },
];

export enum DebtStatus {
  WAITING = "Chờ duyệt",
  CONFIRM = "Đã duyệt",
  COMPLETED = "Hoàn tất",
}
