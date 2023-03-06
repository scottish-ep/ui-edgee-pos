import { message, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import Icon from "../../../../components/Icon/Icon";
import InputPrice from "../../../../components/InputPrice/InputPrice";
import TableEmpty from "../../../../components/TableEmpty";
import { onCoppy } from "../../../../utils/utils";
import { IProductOfPromotions, PriceUnitEnum } from "../../promotion.type";

interface ProductTableProps {
  productList: IProductOfPromotions[];
  setProductList: React.Dispatch<React.SetStateAction<IProductOfPromotions[]>>;
  loading?: boolean;
  disabledInput?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  productList,
  setProductList,
  loading = false,
  disabledInput = false,
}) => {
  const handleDeleteProduct = (id: string) => {
    setProductList((prevProductList) =>
      prevProductList.filter((product) => product.id !== id)
    );
  };

  const columns: ColumnsType<IProductOfPromotions> = [
    {
      title: "STT",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, __, index) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Mã SP",
      width: 75,
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium font-medium text-[#1D1C2D]"
          onClick={(e) => onCoppy(e, record.code)}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên sản phẩm",
      width: 250,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.name}
        </span>
      ),
    },
    {
      title: "Danh mục",
      width: 100,
      dataIndex: "category_id",
      key: "category_id",
      align: "center",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.item_category?.name || ""}
        </span>
      ),
    },
    {
      title: "Giá bán",
      width: 100,
      dataIndex: "export_price",
      key: "export_price",
      align: "center",
      render: (_, record) => (
        <span className="text-[#1D1C2D] font-medium text-medium">
          {`${Number(record.price).toLocaleString()} đ`}
        </span>
      ),
    },
    // {
    //   title: "Tồn kho",
    //   width: 100,
    //   dataIndex: "warehouse_items_sum_quantity",
    //   key: "warehouse_items_sum_quantity",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-[#1D1C2D] font-medium text-medium">
    //       {record.warehouse_items_sum_quantity}
    //     </span>
    //   ),
    // },
    {
      title: "Khuyến mãi",
      width: 250,
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (_, record) => (
        <InputPrice
          className="mx-auto"
          width={220}
          value={record.discount.price}
          unit={record.discount.unit}
          onChange={(value, unit) => {
            if (value) {
              setProductList((prevProductList) =>
                prevProductList.map((product) => {
                  if (isNaN(value)) {
                    value = 0;
                    window.alertDanger("Giá trị khuyến mãi không phải là số");
                  }
                  if (product.id === record.id) {
                    if (unit === PriceUnitEnum.Percentage) {
                      if (value > 100 || value < 0) {
                        value = 0;
                        window.alertDanger("Giá trị khuyến mãi không hợp lệ");
                      }
                    }
                    if (value < 0) {
                      value = 0;
                      window.alertDanger("Không thể nhập số âm");
                    }
                    return {
                      ...product,
                      discount: {
                        price: value,
                        unit: unit,
                        discount_price:
                          unit === PriceUnitEnum.VND
                            ? Number(product.price - value).toLocaleString()
                            : Number(
                                product.price - (product.price / 100) * value
                              ).toLocaleString(),
                      },
                    };
                  }
                  return product;
                })
              );
            }
          }}
        />
      ),
    },
    {
      title: "Giá KM",
      width: 100,
      dataIndex: "discount_price",
      key: "discount_price",
      align: "center",
      render: (_, record: any) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {`${record.discount.discount_price.toLocaleString()} đ`}
        </span>
      ),
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      align: "center",
      render: (_, record) => (
        <span
          className="cursor-pointer"
          onClick={() => handleDeleteProduct(record.id)}
        >
          <Icon icon="cancel" size={20} />
        </span>
      ),
    },
  ];
  return (
    <Table
      rowKey={(record) => record.id}
      locale={{
        emptyText: <TableEmpty />,
      }}
      columns={columns}
      dataSource={productList}
      pagination={false}
      scroll={{ x: 50 }}
      loading={loading}
    />
  );
};

export default ProductTable;
