import { message, notification, Switch, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal/Modal";
import Select from "../../../components/Select/Select";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { categoryOrderTypeList } from "../../../const/constant";
import LayoutItem from "./components/LayoutItem";
import WareHouseItem from "./components/WareHouseItem";
import { IWarehouseList } from "../../warehouses/warehouse.type";
import ItemBoxApi from "../../../services/item-box";
import { uuid } from "uuidv4";
import { IOption } from "../../../types/permission";

interface ModalAddContainerManagementProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (uuid: string) => void;
  warehouseList: Array<IWarehouseList>;
  categories?: Array<IOption>;
}

const ModalAddContainerManagement: React.FC<
  ModalAddContainerManagementProps
> = (props) => {
  const { isVisible, onClose, warehouseList, onSuccess, categories } = props;
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const [value, setValue] = useState({
    name: "",
    code: "",
    price: 0,
    apply: true,
    size: "",
    weightContainer: 0,
    weightProduct: 0,
    category_ids: [],
  });
  const [warehouses, setWarehouses] = useState<any>([]);

  useEffect(() => {
    let arr: any = [];
    if (warehouseList?.length > 0) {
      warehouseList?.map((item) => {
        arr.push({
          id: item?.id,
          quantity: 0,
          enable: false,
          name: item?.name,
        });
      });
    }
    setWarehouses(arr);
  }, [warehouseList]);

  const onSave = async () => {
    setDisableButton(true);
    console.log(
      "🚀 ~ file: ModalEditWholeSale.tsx ~ line 20 ~ useEffect ~ save data: ",
      {
        value,
        warehouses,
      }
    );
    if (!value.name) {
      notification.error({
        message: "Vui lòng nhập tên thùng hàng",
      });
      return;
    }
    if (!value.code) {
      notification.error({
        message: "Vui lòng nhập mã thùng hàng",
      });
      return;
    }
    const { data } = await ItemBoxApi.addItemBox({
      value,
      warehouses,
    });

    if (data) {
      onClearFormData?.();
      onSuccess?.(uuid());
      message.success("Thêm thành công");
    }
    setDisableButton(false);
  };

  const Footer = () => (
    <div className="flex justify-between flex-wrap gap-x-3">
      <Button className="flex-1" variant="outlined" onClick={onClearFormData}>
        HUỶ BỎ
      </Button>
      <Button className="flex-1" variant="secondary" onClick={onSave}>
        LƯU (F12)
      </Button>
    </div>
  );

  const handleChangeValue = (
    name: string,
    vlu: string | number | boolean | Object
  ) => {
    setValue({ ...value, [name]: vlu });
  };

  const onClearFormData = () => {
    onClose();
    setValue({
      name: "",
      code: "",
      price: 0,
      apply: true,
      size: "",
      weightContainer: 0,
      weightProduct: 0,
      category_ids: [],
    });
    setWarehouses(
      warehouseList?.map((item) => {
        return {
          id: item?.id,
          quantity: 0,
          enable: false,
          name: item?.name,
        };
      })
    );
  };

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

  return (
    <Modal
      isCenterModal
      title="Thêm thùng hàng mới"
      isVisible={isVisible}
      onClose={onClearFormData}
      iconClose="Đóng"
      footer={<Footer />}
      width={480}
    >
      <div className="flex flex-col gap-y-3 -m-3">
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
              defaultChecked={value.apply}
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
              suffix={<p className="text-medium text-[#2E2D3D]">kg</p>}
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
              suffix={<p className="text-medium text-[#2E2D3D]">kg</p>}
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
              options={categories}
              placeholder="Chọn"
              onChange={(value) => handleChangeValue("category_ids", value)}
            />
          }
        />
        <span className="border-[0.5px] border-[#DADADD] my-3"></span>
        {warehouses?.map((item, index) => {
          return (
            <>
              <WareHouseItem
                key={item?.id}
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
            </>
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalAddContainerManagement;
