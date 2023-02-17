import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import TitlePage from "../../../components/TitlePage/Titlepage";
import {
  categoryOrderTypeList,
  containerManagementDetail,
} from "../../../const/constant";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import ContainerManagementDetailTable from "./ContainerManagementDetailTable";
import { message, Switch, Tag } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import LayoutItem from "./components/LayoutItem";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import WareHouseItem from "./components/WareHouseItem";
import queryString from "query-string";
import ItemBoxApi from "../../../services/item-box";
import { IOption } from "../../../types/permission";
import Api from "../../../services";
import { IContainerManagement } from "../orders.type";
import { IWarehouseList } from "../../warehouses/warehouse.type";

const ContainerManagementDetail: React.FC = () => {
  const [detail, setDetail] = useState<IContainerManagement>();
  const [id, setId] = useState<string | number | undefined>();
  const [itemCategories, setItemCategories] = useState<Array<IOption>>([]);
  const [warehouseList, setWarehouseList] = useState<IWarehouseList[]>([]);
  const [warehouses, setWarehouses] = useState<any>([]);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  useEffect(() => {
    setWarehouses(detail?.warehouses || []);
  }, [detail]);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const idParam = String(params.get("id"));
    setId(idParam);
  }, []);

  useEffect(() => {
    if (id) {
      getItemBoxDetail();
      console.log(
        "🚀 ~ file: container-management-detail.tsx ~ line 36 ~ id",
        id
      );
    }
  }, [id]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    const url = `/api/v2/item-categories/list`;
    const { data } = await Api.get(url);
    console.log(
      "🚀 ~ file: container-management-list.tsx ~ line 110 ~ getAllCategories ~ data2",
      data
    );

    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];

    data?.data?.data?.map((item) => {
      arr.push(item);
    });
    setItemCategories(arr);
  };

  const getItemBoxDetail = async () => {
    const { data } = await ItemBoxApi.getItemBoxDetail(id);
    setDetail(data);
  };

  const [
    isShowModalRemoveContainerManagement,
    setIsShowModalRemoveContainerManagement,
  ] = useState(false);

  const [value, setValue] = useState<any>({
    name: "",
    code: "",
    price: "",
    apply: false,
    size: "",
    weightContainer: "",
    weightProduct: "",
    category_ids: [],
  });

  useEffect(() => {
    setValue({
      name: detail?.name || "",
      code: detail?.code,
      price: detail?.price,
      apply: detail?.is_enable,
      size: detail?.size,
      weightContainer: detail?.weight,
      weightProduct: detail?.max_weight_product,
      category_ids: detail?.product_category_ids,
    });
  }, [detail]);

  const handleChangeValue = (
    name: string,
    vlu: string | number | boolean | Object
  ) => {
    setValue({ ...value, [name]: vlu });
  };

  useEffect(() => {
    console.log(
      "🚀 ~ file: container-management-detail.tsx ~ line 113 ~ useEffect ~ value",
      value
    );
  });

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const onSave = async () => {
    setDisableButton(true);
    console.log(
      "🚀 ~ file: ModalEditWholeSale.tsx ~ line 20 ~ useEffect ~ save data: ",
      {
        value,
        warehouses,
      }
    );
    const { data } = await ItemBoxApi.updateItemBox({
      itemBoxId: detail?.id,
      value,
      warehouses,
    });
    if (data) {
      message.success("Cập nhật thành công");
      window.location.href = "/order-management/container-management";
    }
    setDisableButton(false);
  };

  const onDelete = async () => {
    const { data } = await ItemBoxApi.deleteMany([detail?.id]);
    if (data) {
      message.success("Xóa thành công");
      window.location.href = "/order-management/container-management";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-2 justify-between mb-5 flex-wrap">
        <TitlePage
          href="/order-management/container-management"
          title="Chi tiết thùng hàng"
        />
        <div className="flex gap-x-2 flex-wrap">
          <Button
            variant="danger-outlined"
            width={163}
            icon={<Icon icon="trash" size={24} />}
            onClick={() => setIsShowModalRemoveContainerManagement(true)}
          >
            Xóa thùng hàng
          </Button>
          <Button
            variant="secondary"
            width={166}
            style={{ fontWeight: "bold" }}
            onClick={onSave}
          >
            Lưu (F12)
          </Button>
        </div>
      </div>

      <div className="flex gap-x-4">
        <div className="flex flex-col gap-y-3 w-[472px]">
          <div className="flex flex-col gap-y-3 p-3 bg-white border border-[#DADADD] rounded">
            <LayoutItem
              name="Tên thùng hàng"
              description={
                <Input
                  placeholder="Nhập"
                  value={value.name}
                  onChange={(e) => handleChangeValue("name", e.target.value)}
                />
              }
            />
            <LayoutItem
              name="Mã thùng"
              description={
                <Input
                  placeholder="Nhập"
                  value={value.code}
                  onChange={(e) => handleChangeValue("code", e.target.value)}
                />
              }
            />
            <LayoutItem
              name="Đơn giá"
              description={
                <Input
                  type="number"
                  className="w-full"
                  placeholder="Nhập giá trị"
                  value={value.price}
                  suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
                  onChange={(e) => handleChangeValue("price", e.target.value)}
                />
              }
            />
            <LayoutItem
              name="Sử dụng"
              description={
                <Switch
                  className="button-switch"
                  checked={value.apply}
                  onChange={(checked) => handleChangeValue("apply", checked)}
                />
              }
            />
            <LayoutItem
              name="Kích cỡ"
              description={
                <Input
                  placeholder="Nhập"
                  value={value.size}
                  onChange={(e) => handleChangeValue("size", e.target.value)}
                />
              }
            />
            <LayoutItem
              name="Khối lượng thùng hàng"
              description={
                <Input
                  type="number"
                  className="w-full"
                  placeholder="Nhập giá trị"
                  value={value.weightContainer}
                  suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
                  onChange={(e) =>
                    handleChangeValue("weightContainer", e.target.value)
                  }
                />
              }
            />
            <LayoutItem
              name="Khối lượng sản phẩm tối đa"
              description={
                <Input
                  type="number"
                  className="w-full"
                  placeholder="Nhập giá trị"
                  value={value.weightProduct}
                  suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
                  onChange={(e) =>
                    handleChangeValue("weightProduct", e.target.value)
                  }
                />
              }
            />
            <LayoutItem
              name="Loại sản phẩm"
              description={
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  height="max-content"
                  value={value.category_ids}
                  options={itemCategories}
                  placeholder="Chọn"
                  onChange={(value) => handleChangeValue("category_ids", value)}
                />
              }
            />
          </div>
          {warehouses?.map((item, index) => {
            return (
              <div
                key={item?.id}
                className="flex flex-col gap-y-3 p-3 bg-white border border-[#DADADD] rounded"
              >
                <WareHouseItem
                  name={item?.name}
                  enable={item?.enable}
                  quantity={item?.quantity}
                  onChangeSwitch={(checked) => {
                    const newWarehouses = [...warehouses];
                    newWarehouses[index] = {
                      ...newWarehouses[index],
                      enable: checked,
                    };
                    setWarehouses(newWarehouses);
                  }}
                  onChangeValue={(vlu) => {
                    const newWarehouses = [...warehouses];
                    newWarehouses[index] = {
                      ...newWarehouses[index],
                      quantity: vlu,
                    };
                    setWarehouses(newWarehouses);
                  }}
                />
              </div>
            );
          })}
        </div>
        <ContainerManagementDetailTable />
      </div>

      <ModalRemove
        isVisible={isShowModalRemoveContainerManagement}
        onClose={() => setIsShowModalRemoveContainerManagement(false)}
        onOpen={() => setIsShowModalRemoveContainerManagement(false)}
        titleBody="Xóa thùng hàng này?"
        content="Dữ liệu của thùng hàng sẽ không còn nữa."
        onOk={onDelete}
      />
    </div>
  );
};

ReactDOM.render(<ContainerManagementDetail />, document.getElementById("root"));
