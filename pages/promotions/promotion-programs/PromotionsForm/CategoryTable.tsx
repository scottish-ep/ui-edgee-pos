import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import Icon from "../../../../components/Icon/Icon";
import InputPrice from "../../../../components/InputPrice/InputPrice";
import TableEmpty from "../../../../components/TableEmpty";
import { onCoppy } from "../../../../utils/utils";
import { ICategoryOfPromotions, PriceUnitEnum } from "../../promotion.type";

interface CategoryTableProps {
  categoryList: ICategoryOfPromotions[];
  setCategoryList: React.Dispatch<
    React.SetStateAction<ICategoryOfPromotions[]>
  >;
  loading?: boolean;
  disabledInput?: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categoryList,
  setCategoryList,
  loading = false,
  disabledInput = false,
}) => {
  const handleDeleteProduct = (id: string) => {
    setCategoryList((prevCategoryList) =>
      prevCategoryList.filter((category) => category.id !== id)
    );
  };

  const columns: ColumnsType<ICategoryOfPromotions> = [
    {
      title: "STT",
      width: 50,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record, index) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Tên danh mục",
      width: 300,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <span className="text-medium font-medium text-[#1D1C2D]">
          {record.label}
        </span>
      ),
    },
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
          disabledInput={disabledInput}
          onChange={(value, unit) => {
            if (value) {
              setCategoryList((prevCategoryList) =>
                prevCategoryList.map((category) => {
                  if (isNaN(value)) {
                    value = 0;
                    window.alertDanger("Giá trị khuyến mãi không phải là số");
                  }
                  if (category.id === record.id) {
                    if (unit === PriceUnitEnum.Percentage) {
                      if (value > 100 || value < 0) {
                        value = 0;
                        window.alertDanger("Giá trị khuyến mãi không hợp lệ");
                      }
                    }
                    return {
                      ...category,
                      discount: {
                        price: value,
                        unit: unit,
                        discount_price: 0,
                      },
                    };
                  }

                  return category;
                })
              );
            }
          }}
        />
      ),
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      align: "center",
      render: (_, record) =>
        !disabledInput && (
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
      dataSource={categoryList}
      pagination={false}
      scroll={{ x: 50 }}
      loading={loading}
    />
  );
};

export default CategoryTable;
