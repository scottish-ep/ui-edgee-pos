import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { productDetail } from "../../const/constant";
import ProductForms from "./ProductForms/ProductForms";
import ItemApi from "../../services/items";
import { format } from "node:path/win32";
import { get } from "lodash";

const ProductDetails: React.FC = () => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const pathNameArr = window.location.pathname.split("/");
  // const id = pathNameArr[pathNameArr.length - 1];

  useEffect(() => {
    if (Number.isInteger(parseInt("463"))) {
      getProductDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [463]);

  const getProductDetail = async () => {
    setLoading(true);
    const data = await ItemApi.getItemDetail(463, {
      populate: [
        // 'warehouse',
        "item_channel_relations:item_id,item_sku_id,price,channel_code",
        "item_skus",
        "item_skus.warehouse_items",
        "item_skus.item_attribute_values:id,attribute_id,sku_id,value",
        "item_warehouse_relations:id,item_id,warehouse_id",
        // 'item_skus.item_attribute_values.item_attribute_value_list:id,item_attribute_id,value,code',
        // 'item_skus.item_attribute_values.item_attribute:id,name'
      ],
    });
    let formatData = data;
    formatData["channels"] = get(data, "item_channel_relations").map(
      (item: any) => item.channel_code,
    );
    let formatItemSkus = get(data, "item_skus").map((itemSku: any) => {
      const priceOffline = get(data, "item_channel_relations").find(
        (item: any) =>
          item.channel_code === "OFFLINE" && item.item_sku_id == itemSku.id,
      );
      const priceOnline = get(data, "item_channel_relations").find(
        (item: any) =>
          item.channel_code === "ONLINE" && item.item_sku_id == itemSku.id,
      );
      const priceInApp = get(data, "item_channel_relations").find(
        (item: any) =>
          item.channel_code === "IN_APP" && item.item_sku_id == itemSku.id,
      );
      return {
        ...itemSku,
        price_offline: priceOffline ? priceOffline.price : 0,
        price_online: priceOnline ? priceOnline.price : 0,
        price_in_app: priceInApp ? priceInApp.price : 0,
      };
    });
    formatData["item_skus"] = formatItemSkus;
    setDetail(formatData);
    setLoading(false);
  };

  return <ProductForms loading={loading} detail={detail} />;
};

export default ProductDetails;
