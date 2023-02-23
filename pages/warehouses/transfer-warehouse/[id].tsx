import { notification } from "antd";
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import { wareHouseDetail } from "../../../const/constant";
import WarehouseTransferCommandApi from "../../../services/warehouse-transfer-command";
import TransferWareHouseForm from "./TransferWareHouseForm/TransferWareHouseForm";

const TransferWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState<any>();
  const [listItemSku, setListItemSku] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  let pathNameArr = [''];
  useRef(() => {
    pathNameArr =window.location.pathname.split("/");
  })
  const id = pathNameArr[pathNameArr.length - 1];

  // useEffect(() => {
  //   getDetails(id);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const getDetails = async (id: number | string) => {
  //   const data = await WarehouseTransferCommandApi.getDetaiTransfersCommands(
  //     id
  //   );
  //   const itemSkus =
  //     await WarehouseTransferCommandApi.getItemSkuInTransferCommands(id);
  //   if (data) {
  //     setDetail({
  //       ...data,
  //       from_warehouse_id: data?.from_warehouse_id
  //         ? parseInt(data.from_warehouse_id)
  //         : null,
  //       to_warehouse_id: data?.to_warehouse_id
  //         ? parseInt(data.to_warehouse_id)
  //         : null,
  //     });
  //   } else {
  //     notification.success({
  //       message: "Không tìm thấy phiếu nhập kho!",
  //     });
  //     window.location.href = "/warehouse/transfer-commands";
  //   }
  //   if (itemSkus.success) {
  //     const formatData = itemSkus.data.map((item: any) => ({
  //       ...item.item_skus,
  //       quantity_transfer: item.quantity,
  //       weight_transfer: item.weight,
  //     }));
  //     setListItemSku(formatData);
  //   }
  // };
  const detailItem = {
    code: "1",
    id: "1",
    export_code: "12",
    user: "Tran Huyen",
    created_at: "10-12-2023",
    note: "none", 
    updatedAt: 13, 
    shipping_id: "13", 
    product_list: []
  }

  return <TransferWareHouseForm detail={detailItem} listItemSku={listItemSku} />;
};

export default TransferWareHouseDetail;
