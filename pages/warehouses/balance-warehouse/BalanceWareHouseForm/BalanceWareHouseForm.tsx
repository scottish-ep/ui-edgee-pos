/* eslint-disable react-hooks/exhaustive-deps */
import { Form, notification } from "antd";
import { format } from "date-fns";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import Button from "../../../../components/Button/Button";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import Select from "../../../../components/Select/Select";
import TextArea from "../../../../components/TextArea";
import TitlePage from "../../../../components/TitlePage/Titlepage";
import {
  warehouseBalanceStatusOption,
  warehouses,
  warehouseStatusOption,
} from "../../../../const/constant";
import { CommandStatusEnum } from "../../../../enums/enums";
import ItemSkuApi from "../../../../services/item-skus";
import UserApi from "../../../../services/users";
import WarehouseBalanceCommandApi from "../../../../services/warehouse-balance-command";
import WarehouseItemApi from "../../../../services/warehouse-items";
import WarehouseTransferCommandApi from "../../../../services/warehouse-transfer-command";
import WarehouseApi from "../../../../services/warehouses";
import { StatusEnum, warehouseStatusList } from "../../../../types";
import { IUser } from "../../../../types/users";
import { isArray } from "../../../../utils/utils";
import { IWareHousesDetail } from "../../warehouse.type";
import BalanceWareHouseFormTable from "./BalanceWareHouseFormTable";

interface BalanceFormProps {
  detail?: IWareHousesDetail;
  listItemSku?: any[];
}
declare global {
  interface Window {
    loggedInUser: string;
  }
}

const BalanceForm: React.FC<BalanceFormProps> = ({ detail, listItemSku }) => {
  const [warehouseManagement, setWareHouseManagement] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [itemSkus, setItemSkus] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchTerm = useDebounce(searchKey, 1000);
  const [listItemSkuInWarehouse, setListItemSkuInWarehouse] = useState<any[]>(
    []
  );
  const [warehouseSelected, setWarehouseSelected] = useState<any>({});
  const [form] = Form.useForm();
  const warehouseId = Form.useWatch("warehouse_id", form);
  const [loading, setLoading] = useState(false);
  const selectedUser = window.loggedInUser;

  useEffect(() => {
    if (detail) {
      form.setFieldsValue(detail);
    } else {
      form.setFieldValue("created_user_id", selectedUser);
    }
    listItemSku && setItemSkus(listItemSku);
  }, [detail, listItemSku]);

  useEffect(() => {
    getListStaff();
    getListWarehouse();
  }, []);

  useEffect(() => {
    if (warehouseId) {
      setWarehouseSelected(
        warehouseManagement.find((v) => v.id === warehouseId)
      );
    }
    getListItemInWarehouseItem();
  }, [warehouseId]);
  const getListWarehouse = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setWareHouseManagement(listWarehouse);
  };

  const getListStaff = async () => {
    const result = await UserApi.getListStaff();
    const newListStaff = isArray(result)
      ? result.map((item: IUser) => ({
          label: item.name,
          value: item.id,
          id: item.id,
        }))
      : [];
    setListStaff(newListStaff);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    if (!isArray(itemSkus)) {
      notification.error({
        message: "Vui lòng chọn sản phẩm!",
      });
      setLoading(false);
      return;
    }

    if (!detail) {
      const result = await WarehouseBalanceCommandApi.createBalanceCommand({
        balanceCommand: {
          ...data,
          status: data.status || CommandStatusEnum.CREATED,
        },
        balanceCommandItems: itemSkus,
      });
      if (result) {
        window.location.href =
          `/warehouse/balance-commands/update/` + result.id;
        notification.success({
          message: "Thêm phiếu chuyển kho thành công!",
        });
      }
      setLoading(false);
    } else {
      const result = await WarehouseBalanceCommandApi.updateBalanceCommand(
        {
          balanceCommand: {
            ...data,
            command_id: detail.id,
          },
          balanceCommandItems: itemSkus,
        },
        detail.id
      );
      if (result) {
        notification.success({
          message: "Cập phiếu chuyển kho thành công!",
        });
      }
      setLoading(false);
    }
  };

  // Hanle Item sku
  const getListItemInWarehouseItem = async () => {
    setLoading(true);
    if (warehouseId) {
      const data: any = await WarehouseItemApi.getItemSku(warehouseId);
      setItemSkus(listItemSku || []);
      const listItemSkuInWarehouse =
        isArray(data) &&
        data.map((item) => ({
          ...item,
          label: item.name,
          value: item.id + item.name,
          difference: 0,
          actual_remain: 0,
        }));
      setListItemSkuInWarehouse(listItemSkuInWarehouse);
    }
    setLoading(false);
  };

  const handleDeleteProduct = (id: string | number) => {
    setItemSkus((prevProductList) =>
      prevProductList.filter((product) => product.id !== id)
    );
  };

  const handleChangeValue = (
    id: string | number,
    key: string,
    value: string
  ) => {
    setItemSkus((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === id) {
          if (key === "actual_remain")
            return {
              ...product,
              [key]: Number(value),
              ["difference"]: product.quantity - Number(value),
            };
        } else {
          if (key === "difference") return { ...product, [key]: Number(value) };
        }

        return product;
      })
    );
  };

  const handleAddProduct = (item: any) => {
    const newItem = {
      ...item,
    };
    setItemSkus(itemSkus.concat(newItem));
  };

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <TitlePage
          href="/warehouse/balance-commands"
          title={
            detail ? "Chi tiết phiếu cân bằng kho" : "Tạo phiếu cân bằng kho"
          }
        />
        <div className="flex gap-x-2">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Trạng thái</div>
            <Form.Item name="status">
              <Select
                disabled={
                  detail &&
                  (detail.status == "COMPLETED" || detail.status == "CREATED")
                }
                placeholder="Chọn trạng thái"
                style={{ width: 162 }}
                options={warehouseBalanceStatusOption}
                defaultValue={CommandStatusEnum.CREATED}
              />
            </Form.Item>
          </div>
          <Button
            variant="secondary"
            width={148}
            style={{ fontWeight: "bold" }}
            onClick={() => form.submit()}
            loading={loading}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex gap-x-3">
        <div className="flex flex-col justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              Mã cân bằng:
            </span>
            <span className="text-medium font-medium text-[#2E2D3D]">
              {detail?.code || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              Thời điểm tạo:
            </span>
            <span className="text-mediu(m font-medium text-[#2E2D3D]">
              {detail?.created_at
                ? format(new Date(detail.created_at), "dd/MM/yyyy")
                : "-"}
            </span>
          </div>
          <Form.Item name="created_user_id">
            {detail && (
              <Select
                label="Nhân viên xử lý *"
                placeholder="Chọn nhân viên xử lý"
                options={listStaff}
                disabled
              />
            )}
          </Form.Item>
          <Form.Item name="note">
            <TextArea
              label="Ghi chú"
              className="!h-[179px]"
              placeholder="Nhập ghi chú"
            />
          </Form.Item>
        </div>
        <div className="flex flex-col justify-start gap-y-4 bg-white flex-1 p-3 rounded">
          <Form.Item
            name="warehouse_id"
            rules={[
              {
                required: true,
                message: "Kho kiểm là bắt buộc!",
              },
            ]}
          >
            <Select
              disabled={detail ? true : false}
              label="Chọn kho kiểm *"
              placeholder="Chọn kho kiểm *"
              options={warehouseManagement}
            />
          </Form.Item>
          {warehouseSelected && (
            <div className="flex mt-[20px] flex-col justify-between gap-y-1 p-2 bg-[#F5F5F6] border border-[#DADADD] rounded h-[82px]">
              <div className="flex gap-x-3">
                <span className="text-[#1D1C2D] text-medium font-semibold">
                  {warehouseSelected?.name || "--"}
                </span>
                <span className="border border-[#DADADD]"></span>
                <span className="text-[#1D1C2D] text-medium font-semibold">
                  {warehouseSelected?.phone_number || "--"}
                </span>
              </div>
              <p className="text-[#4B4B59] text-medium">
                {warehouseSelected?.address}{" "}
                {warehouseSelected?.ward_info ? ", " : ""}
                {warehouseSelected?.ward_info?.prefix}{" "}
                {warehouseSelected?.ward_info?.name}
                {warehouseSelected?.district_info ? ", " : ""}
                {warehouseSelected?.district_info?.prefix}{" "}
                {warehouseSelected?.district_info?.name}
                {warehouseSelected?.province_info ? ", " : ""}{" "}
                {warehouseSelected?.province_info?.name}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Filter */}
      <div className="flex gap-x-2 mt-4 mb-3">
        <Select
          onChange={(e, value) => handleAddProduct(value)}
          clearIcon={<Icon icon="cancel" size={16} />}
          showSearch
          prefix={<Icon icon="personalcard" size={24} />}
          options={listItemSkuInWarehouse}
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          loading={loading}
        />
        <Button
          variant="neural_200"
          width={196}
          icon={<Icon icon="barcode" size={24} />}
        >
          Quét mã vạch (F1)
        </Button>
      </div>
      {/* Table */}
      <BalanceWareHouseFormTable
        handleChangeValue={(id, key, value) =>
          handleChangeValue(id, key, value)
        }
        loading={loading}
        itemSkus={itemSkus}
        handleDeleteProduct={(id) => handleDeleteProduct(id)}
      />
    </Form>
  );
};

export default BalanceForm;
