/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PromotionsForm from "./PromotionsForm/PromotionsForm";
import PromotionProgramApi from "../../../services/promotion-programs";

const PromotionsDetail: React.FC = () => {
  const [detail, setDetail] = useState(null);
  let pathNameArr: any = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];

  useEffect(() => {
    if (Number.isInteger(parseInt(id))) {
      getPromotionDetail();
    }
  }, [id]);

  const getPromotionDetail = async () => {
    const data = await PromotionProgramApi.getPromotionProgramDetail(id, {
      populate: [
        "items.item:id,code,name,item_category_id,price",
        // "items.item:id,item_category_id,name",
        "items.item.item_category:id,name",
        "items.item_sku:id,sku_code,price",
        "items.item_sku.warehouse_items:id,quantity,item_id,sku_id",
        "categories",
        "categories.category:id,name",
        "item_channel:id,label",
        "created_user:id,name",
        "warehouses",
      ],
    });
    setDetail(data);
  };

  return <PromotionsForm detail={detail} />;
};

export default PromotionsDetail;