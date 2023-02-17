import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { notification } from "antd";

import { wareHouseDetail } from "../../../const/constant";
import WarehouseBalanceCommandApi from "../../../services/warehouse-balance-command";
import WarehouseTransferCommandApi from "../../../services/warehouse-transfer-command";
import BalanceWareHouseForm from "./BalanceWareHouseForm/BalanceWareHouseForm";

const BalanceWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState<any>({});
  const [listItemSku, setListItemSku] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];

  useEffect(() => {
    getDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetails = async (id: number | string) => {
    const data = await WarehouseBalanceCommandApi.getDetaiBalanceCommands(id);
    const itemSkus =
      await WarehouseBalanceCommandApi.getItemSkuInBalanceCommands(id);
    if (data) {
      setDetail({
        ...data,
        warehouse_id: data?.warehouse_id ? parseInt(data.warehouse_id) : null,
      });
    } else {
      window.location.href = "/warehouse/balance-commands";
    }
    if (itemSkus.success) {
      const formatData = itemSkus.data.map((item) => ({
        ...item.warehouse_item,
        actual_remain: item.actual_remain,
        command_id: item.command_id,
        difference: item.difference,
      }));
      setListItemSku(formatData);
    }
  };
  return <BalanceWareHouseForm detail={detail} listItemSku={listItemSku} />;
};

ReactDOM.render(<BalanceWareHouseDetail />, document.getElementById("root"));
