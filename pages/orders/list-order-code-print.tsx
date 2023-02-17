/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../styles/DetailCustomer.module.css";
import { isArray } from "../../utils/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableEmpty from "../../components/TableEmpty";
import ItemApi from "../../services/items";
import Barcode from "react-barcode";
import { get } from "lodash";

const ListOrderPrintCode = () => {
  const defaultPagination = {
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [loading, setLoading] = useState(true);
  const [itemSkus, setItemSkus] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);

  const urlParams = new URLSearchParams(window.location.search);
  const arrayId = urlParams.get("arrayId");
  const optionPrint = urlParams.get("option_print");

  useEffect(() => {
    getItemSkus();
  }, []);

  const getItemSkus = async () => {
    const { data } = await ItemApi.getItemSkusToPrint({
      arrayId: JSON.parse(arrayId ? arrayId : ""),
    });
    setLoading(false);
    if (data) {
      let rawItemSkus: any[] = [];
      data.map((item) => {
        const itemSkus = item.item_skus;
        isArray(itemSkus) &&
          itemSkus.map((itemSku) => {
            let name = item.name;
            itemSku.item_attribute_values.map((attribute, index) => {
              if (index === 0) {
                name = name + " | " + attribute.value;
              } else {
                name = name + " - " + attribute.value;
              }
            });
            let skuName = name;
            name = itemSku.sku_code + " | " + name;
            let skuPrice = `${
              parseFloat(
                get(itemSku, "item_channel_relation.price")
              ).toLocaleString() || 0
            }đ`;
            let inventory = 0;
            isArray(get(itemSku, "warehouse_items")) &&
              get(itemSku, "warehouse_items").map((warehouseItem: any) => {
                inventory += warehouseItem.quantity;
              });
            let weight = 0;
            if (isArray(get(itemSku, "import_items"))) {
              weight = get(itemSku, "import_items")[0].weight;
            }
            skuName += ` ( ${weight}kg )`;
            rawItemSkus.push({
              name: name,
              sku_code: itemSku.sku_code,
              qr_link: itemSku.qr_link,
              bar_code_link: itemSku.qr_link,
              price: skuPrice,
              display_name: skuName,
              inventory: inventory,
              weight: weight,
            });
          });
      });
      setItemSkus(rawItemSkus);
      window.setTimeout(() => {
        window.print();
      }, 1000);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<any> = [
    {
      title: "Sản phẩm",
      width: 450,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span className="text-[#384ADC] font-semibold">{record.name}</span>
      ),
    },
    {
      title: "QR Code",
      width: 145,
      dataIndex: "qr_code",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          {record?.qr_link && (
            <img className={styles.qr_image} src={record?.qr_link} />
          )}
        </div>
      ),
    },
    {
      title: "Bar Code",
      width: 180,
      dataIndex: "bar_code",
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="text-center">
              {record?.sku_code && (
                <Barcode
                  value={record.sku_code}
                  width={1}
                  displayValue={false}
                  height={50}
                />
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="font-semibold">{record.price}</div>
              <div className="font-medium">{record.display_name}</div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full list-order">
      <Table
        loading={loading}
        columns={columns.filter(
          (item: any) =>
            item.dataIndex === "name" ||
            item.dataIndex == optionPrint ||
            optionPrint === "both"
        )}
        dataSource={[...itemSkus]}
        pagination={false}
        locale={
          !loading
            ? {
                emptyText: <TableEmpty />,
              }
            : { emptyText: <></> }
        }
      />
    </div>
  );
};

ReactDOM.render(<ListOrderPrintCode />, document.getElementById("root"));
