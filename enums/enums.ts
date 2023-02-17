export enum ModuleLogEnum {
  ORDER = "ORDER",
  WAREHOUSE = "WAREHOUSE",
  PRODUCT = "PRODUCT",
}

export enum ModuleLog {
  ORDER = "Đơn hàng",
  WAREHOUSE = "Kho",
  PRODUCT = "Sản phẩm",
}

export enum ModuleLogActionEnum {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export enum ModuleLogAction {
  CREATED = "Thêm mới",
  UPDATED = "Cập nhật",
  DELETED = "Xóa",
}

export enum ModuleLogActionColor {
  CREATED = "Thêm mới",
  UPDATED = "Cập nhật",
  DELETED = "Xóa",
}

export enum OrderTypeID {
  ONLINE = 1,
  OFFLINE = 2,
  INAPP = 3,
}

export enum OrderEnum {
  INIT = "INIT",
  CONFIRMED = "CONFIRMED",
  PROCESS_WAITING = "PROCESS_WAITING",
  STOCK_WAITING = "STOCK_WAITING",
  STOCK_OK = "STOCK_OK",
  PRINT_WAITING = "PRINT_WAITING",
  PRINT_OK = "PRINT_OK",
  PICKUP_SENT = "PICKUP_SENT",
  PICKUP_RECEIVED = "PICKUP_RECEIVED",
  PICKUP_RETURNING = "PICKUP_RETURNING",
  RETURN_PARTIAL = "RETURN_PARTIAL",
  PICKUP_RETURNED = "PICKUP_RETURNED",
  CHANGED = "CHANGED",
  CANCELLED = "CANCELLED",
  DELETED = "DELETED",
  DRAFT = "DRAFT",
}

export enum OrderEnumId {
  INIT = 1,
  CONFIRMED = 2,
  PROCESS_WAITING = 3,
  STOCK_WAITING = 4,
  STOCK_OK = 5,
  PRINT_WAITING = 6,
  PRINT_OK = 7,
  PICKUP_SENT = 8,
  PICKUP_RECEIVED = 9,
  PICKUP_RETURNING = 10,
  RETURN_PARTIAL = 11,
  PICKUP_RETURNED = 12,
  CHANGED = 13,
  CANCELLED = 14,
  DELETED = 15,
  DRAFT = 16,
}

export enum LevelCustomer {
  NEW_CLIENT = "Khách hàng mới",
  GOLD = "Vàng",
  SILVER = "Bạc",
  BRONZE = "Đồng",
}

export enum CommandStatusEnum {
  CREATED = "CREATED",
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING",
  CANCELED = "CANCELED",
}

export enum CommandStatus {
  CREATED = "Mới",
  COMPLETED = "Hoàn tất",
  PROCESSING = "Đang chuyển hàng",
  CANCEL = "Hủy",
  CANCELED = "Hủy",
}

export enum CommandStatusColor {
  CREATED = "#10B981",
  COMPLETED = "#6366F1",
  PROCESSING = "#FF9703",
  CANCEL = "#EF4444",
  CANCELED = "#EF4444",
}

export enum OrderStatusEnum {
  PICKUP_RECEIVED = "PICKUP_RECEIVED",
  PICKUP_RETURNED = "PICKUP_RETURNED",
  CANCELLED = "CANCELLED",
}

export enum OrderStatus {
  INIT = "Tạo mới",
  CONFIRMED = "Xác nhận",
  PROCESS_WAITING = "Chờ xử lý",
  STOCK_WAITING = "Chờ đủ hàng",
  STOCK_OK = "Đã đủ hàng",
  PRINT_WAITING = "Đã xử lý",
  PRINT_OK = "Đã in",
  PICKUP_SENT = "Đang giao",
  PICKUP_RECEIVED = "Đã nhận",
  PICKUP_RETURNING = "Đang hoàn",
  RETURN_PARTIAL = "Hoàn 1 phần",
  PICKUP_RETURNED = "Hoàn toàn bộ",
  CHANGED = "Đã đổi",
  CANCELLED = "Huỷ",
  DELETED = "Đã xoá",
  DRAFT = "Nháp",
}

export enum LivestreamStatusEnum {
  CREATED = "Chưa diễn ra",
  PROCESSING = "Đang diễn ra",
  COMPLETED = "Hoàn tất",
  CANCELLED = "Kết thúc",
}

export enum LivestreamStatusColorEnum {
  CREATED = "#4B4B59",
  CANCELED = "#EF4444",
  COMPLETED = "#10B981",
  PROCESSING = "#6366F1",
}

export enum TargetStatusEnum {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export enum CommandWarehouseStatusEnum {
  CREATED = "CREATED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
