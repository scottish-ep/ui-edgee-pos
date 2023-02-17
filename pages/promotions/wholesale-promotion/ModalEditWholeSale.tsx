import { message, notification, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal/Modal";
import ItemApi from "../../../services/items";
import {
  IItemWholeSale,
  ISettingsOfWholeSale,
  IWholeSale,
} from "../promotion.type";
import WholeSaleTable from "./WholeSaleTable";

interface ModalEditWholeSaleProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  rowSelected?: IItemWholeSale;
  onChangeStatus?: (value: any) => void;
  onSuccess?: (uuid: string) => void;
}

const ModalEditWholeSale: React.FC<ModalEditWholeSaleProps> = (props) => {
  const { isVisible, title, onClose, rowSelected, onSuccess, onChangeStatus } =
    props;
  const [settingList, setSettingList] = useState<ISettingsOfWholeSale[]>([]);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  useEffect(() => {
    setSettingList(rowSelected?.wholesales || []);
  }, [rowSelected]);

  const onSave = async () => {
    setDisableButton(true);
    let existMistakeSetting = false;
    settingList.map((item: any) => {
      let index = settingList.findIndex((v: any) => {
        (parseFloat(v.to_price) >= parseFloat(item.to_price) &&
          parseFloat(item.to_price) >= parseFloat(v.from_price)) ||
          (parseFloat(v.from_price) <= parseFloat(item.from_price) &&
            parseFloat(item.from_price) <= parseFloat(v.to_price));
      });
      if (index !== -1 || item.to_price < item.from_price) {
        existMistakeSetting = true;
      }
    });
    if (existMistakeSetting) {
      notification.error({
        message: "Cài đặt giá bán sỉ lỗi!",
      });
      setDisableButton(false);
      return;
    }
    const { data } = await ItemApi.addWholesale(rowSelected?.id, settingList);
    if (data) {
      onClose?.();
      onSuccess?.(uuid());
      message.success("Thêm thành công");
    }
    setDisableButton(false);
  };

  const onToggleIsAllowWholesale = async (
    checked: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
    id: number | string | undefined
  ) => {
    onChangeStatus && onChangeStatus(rowSelected);
    e.stopPropagation();
    const { data } = await ItemApi.toggleIsAllowWholesale(id);
    if (data) {
      message.success("Cập nhật thành công");
    }
    onSuccess?.(uuid());
  };

  const Footer = () => (
    <div className="flex justify-between flex-wrap">
      <Button className="flex-1" variant="outlined" onClick={onClose}>
        HUỶ BỎ
      </Button>
      <Button
        variant="secondary"
        // disabled={disableButton}
        className="flex-1"
        onClick={onSave}
      >
        LƯU
      </Button>
    </div>
  );

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      iconClose="Đóng"
      footer={<Footer />}
      width={658}
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex gap-x-6 items-center h-[45px]">
          <span className="w-[200px] text-medium font-medium text-[#2E2D3D]">
            Tên sản phẩm
          </span>
          <span className="text-medium font-medium text-[#2E2D3D]">
            {rowSelected?.name || "--"}
          </span>
        </div>
        <div className="flex gap-x-6 items-center h-[45px]">
          <span className="w-[200px] text-medium font-medium text-[#2E2D3D]">
            Mã sản phẩm
          </span>
          <span className="text-medium font-medium text-[#2E2D3D]">
            {rowSelected?.id || "--"}
          </span>
        </div>
        <div className="flex gap-x-6 items-center h-[45px]">
          <span className="w-[200px] text-medium font-medium text-[#2E2D3D]">
            Giá bán
          </span>
          <span className="text-medium font-medium text-[#2E2D3D]">
            {rowSelected?.price ? rowSelected.price.toLocaleString() : "--"}
          </span>
        </div>
        <div className="flex gap-x-6 items-center h-[45px]">
          <span className="w-[200px] text-medium font-medium text-[#2E2D3D]">
            Cho phép bán sỉ
          </span>
          <Switch
            className="button-switch"
            checked={rowSelected?.is_allow_wholesale}
            onChange={(checked, event) =>
              onToggleIsAllowWholesale(checked, event, rowSelected?.id)
            }
          />
        </div>
        <WholeSaleTable
          settingList={settingList}
          setSettingList={setSettingList}
        />
      </div>
    </Modal>
  );
};

export default ModalEditWholeSale;
