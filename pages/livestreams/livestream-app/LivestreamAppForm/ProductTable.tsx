import { AutoComplete, notification, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import TableEmpty from "../../../../components/TableEmpty";
import { onCoppy } from "../../../../utils/utils";
import {
  ILivestreamAppDetail,
  ILivestreamProduct,
} from "../livestream-app.type";
import ItemSkuApi from "../../../../services/item-skus";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import { useDebounce } from "usehooks-ts";
import { get } from "lodash";
import InputCurrency from "../../../../components/InputCurrency/Input";

interface ProductTableProps {
  productList: ILivestreamProduct[];
  setProductList: React.Dispatch<React.SetStateAction<ILivestreamProduct[]>>;
  detail?: ILivestreamAppDetail | null;
  disabled?: boolean;
}

interface ISearchProductList {
  data: any[];
  page: number;
  limit: number;
  totalPage: number;
}

const { Option } = AutoComplete;

const ProductTable: React.FC<ProductTableProps> = ({
  productList,
  detail,
  setProductList,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 1000);
  const [isLoadMoreProduct, setIsLoadMoreProduct] = useState(false);
  const productIdList = productList.map((product) => product.id);

  const [searchProductList, setSearchProductList] =
    useState<ISearchProductList>({
      data: [],
      page: 1,
      limit: 10,
      totalPage: 0,
    });
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, __, index) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Mã SP",
      width: 150,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#1D1C2D] font-medium"
          onClick={(e) => onCoppy(e, record.code)}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên sản phẩm",
      width: 300,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record.name || "--"}
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
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record.item_category?.name || "--"}
        </span>
      ),
    },
    {
      title: "Giá bán",
      width: 200,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {get(record, "item_channel_relation.price")
            ? get(record, "item_channel_relation.price")
            : record.price
            ? `${record.price.toLocaleString()} đ`
            : "--"}
        </span>
      ),
    },
    {
      title: "Giá KM",
      width: 200,
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (_, record) => (
        <div className="text-medium text-[#1D1C2D] font-medium">
          <InputCurrency
            placeholder="Nhập giá"
            onValueChange={(e) => handleSetNewPrice(e, record.id)}
            defaultValue={record.discount_price || 0}
            inputMode="decimal"
            suffixInput="đ"
          />
        </div>
      ),
    },
    {
      title: "",
      width: 100,
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <div className="d-flex align-items-center justify-content-center w-100">
          {/*<Button
            className="cursor-pointer flex justify-center btn mr-6"
            variant={"outlined"}
            onClick={() => handleUpdateDiscountPrice(record.id, newPrice)}
          >
            Lưu
          </Button>*/}
          <span
            className="cursor-pointer flex justify-center"
            onClick={() => handleDeleteProduct(record.id)}
          >
            <Icon icon="cancel" size={20} />
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoadMoreProduct(true);

    ItemSkuApi.getItemSku({
      page: searchProductList.page,
      limit: searchProductList.limit,
      name: searchValue.trim(),
      channels: ["IN_APP"],
    }).then((res) => {
      setIsLoadMoreProduct(false);
      if (res) {
        setSearchProductList({
          data:
            searchProductList.page === 1
              ? res.data
              : searchProductList.data.concat(res.data),
          totalPage: res.totalPage,
          limit: searchProductList.limit,
          page: searchProductList.page,
        });
      }
    });
    // eslint-disable-next-line
  }, [searchProductList.page, searchProductList.limit, debouncedValue]);

  const handleDeleteProduct = (id: string) => {
    setProductList((prevProductList) =>
      prevProductList.filter((product: any) => product.id !== id)
    );
  };

  const onScrollBottom = (event: any) => {
    const target = event.target;
    if (
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      searchProductList.page < searchProductList.totalPage &&
      !isLoadMoreProduct
    ) {
      setSearchProductList({
        ...searchProductList,
        page: searchProductList.page + 1,
      });
    }
  };

  const handleUpdateDiscountPrice = async (
    itemSkuId: number,
    newPrice: number
  ) => {
    try {
      const { data } = await ItemSkuApi.updateItemSku(itemSkuId, {
        new_price: newPrice,
      });
      if (data) {
        notification.success({
          description: "Cập nhật giá khuyến mãi thành công",
          message: "Thành công",
          placement: "top",
        });
      }
    } catch (e) {
      notification.error({
        description: `Cập nhật giá khuyến mãi thật bại`,
        message: "Có Lỗi !!!",
        placement: "top",
      });
      console.log(e);
    }
  };

  const handleAddProduct = (id: string) => {
    const product = searchProductList.data.find((product) => product.id === id);
    product && setProductList([...productList, product]);
    console.log("------------", product);
    setSearchValue("");
  };

  const handleSetNewPrice = (e, recordId) => {
    setProductList(
      productList.map((product: any) => {
        if (product.id == recordId) {
          return {
            ...product,
            discount_price: e,
          };
        } else {
          return product;
        }
      })
    );
  };

  return (
    <div className={`${disabled && "not__allowed"}`}>
      <div
        className={`flex flex-col gap-y-3 bg-white rounded px-3 py-4 mt-3 ${
          disabled && "disabled__table"
        }`}
      >
        <div className="font-medium text-[#1D1C2D] text-[16px]">
          Danh sách sản phẩm
        </div>
        <AutoComplete
          value={searchValue}
          className="autocomplete w-full"
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          onPopupScroll={onScrollBottom}
          onSelect={(id: string) =>
            !isLoadMoreProduct &&
            !productIdList.includes(id) &&
            handleAddProduct(id)
          }
          onChange={(value) =>
            value !== "loading" &&
            !productIdList.includes(value) &&
            setSearchValue(
              searchProductList.data.find((option) => option.id === value)
                ?.name || value
            )
          }
        >
          {searchProductList.data.map((option, index) => (
            <Option key={index} value={option.id}>
              <div
                className={classNames("flex flex-col gap-y-1", {
                  "cursor-not-allowed opacity-50": productIdList.includes(
                    option.id
                  ),
                })}
              >
                <span className="text-medium font-medium text-[#4B4B59]">
                  {option.name || "-"}
                </span>
                <span className="text-medium font-medium text-[#384ADC]">
                  {option.price ? option.price.toLocaleString() : "-"}
                </span>
                <span className="text-medium font-medium">
                  Tồn kho:{" "}
                  {option?.warehouse_item
                    ? option?.warehouse_item?.quantity
                    : 0}
                </span>
              </div>
            </Option>
          ))}
          {isLoadMoreProduct && <Option value="loading">Loading ......</Option>}
        </AutoComplete>
        <Table
          rowKey={(record) => record.id}
          locale={{
            emptyText: <TableEmpty />,
          }}
          loading={loading}
          columns={columns}
          dataSource={productList}
          pagination={false}
          scroll={{ x: 50, y: 1000 }}
        />
      </div>
    </div>
  );
};

export default ProductTable;
