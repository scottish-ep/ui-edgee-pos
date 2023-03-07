/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LivestreamAppForm from "./LivestreamAppForm/LivestreamAppForm";
import PromotionProgramApi from "../../../services/promotion-programs";
import LivestreamApi from "../../../services/livestream";

const LivestreamAppDetail = () => {
  const [detail, setDetail] = useState(null);
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];
  useEffect(() => {
    if (Number.isInteger(parseInt(id))) {
      getLivestreamDetail();
    }
  }, [id]);

  const getLivestreamDetail = async () => {
    const data = await LivestreamApi.getLivestreamDetail(id, {
      populate: [
        "items.item:id,code,name,item_category_id",
        "items.item:id,item_category_id,name",
        "items.item.item_category:id,name",
        "items.item_sku:id,sku_code,price,new_price",
        "comments_latest.user:id,name,phone,customer_id",
        "comments_latest.user.customer:id,name",
      ],
    });
    setDetail(data);
  };
  return <LivestreamAppForm detail={detail} />;
};

export default LivestreamAppDetail;
