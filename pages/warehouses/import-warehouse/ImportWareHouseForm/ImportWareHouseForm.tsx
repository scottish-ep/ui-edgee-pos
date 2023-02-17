/* eslint-disable react-hooks/exhaustive-deps */
import { Form, notification, Popover } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import { format } from "date-fns";
import { load } from "dotenv";
import { get } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NumberLiteralType } from "typescript/lib/tsserverlibrary";
import Button from "../../../../components/Button/Button";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import InputCurrency from "../../../../components/InputCurrency/Input";
import Select from "../../../../components/Select/Select";
import TableEmpty from "../../../../components/TableEmpty";
import TextArea from "../../../../components/TextArea";
import TitlePage from "../../../../components/TitlePage/Titlepage";
import {
  employeeProcess,
  priceShippingList,
  shippingUnitList,
  statusImportWareHouseOptions,
  supplierList,
  warehouses,
} from "../../../../const/constant";
import ItemSkuApi from "../../../../services/item-skus";
import ItemApi from "../../../../services/items";
import WarehouseImportCommandApi from "../../../../services/warehouse-import";
import WarehouseApi from "../../../../services/warehouses";
import WarehousesImportApi from "../../../../services/warehouses-import";
import { StatusEnum } from "../../../../types";
import { IUser } from "../../../../types/users";
import {
  isArray,
  parseItemSkuFromCommandItems,
  parseItemSkus,
} from "../../../../utils/utils";
import { IWareHousesDetail } from "../../warehouse.type";

interface ImportWareHouseFormProps {
  // detail?: IWareHousesDetail;
  detail?: any;
  selectedUser?: any;
}

const ImportWareHouseForm: React.FC<ImportWareHouseFormProps> = ({
  detail,
  selectedUser,
}) => {
  const [form] = Form.useForm();
  const [syncForm] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(detail);
    if (detail && detail.id) {
      getDetailCommand(detail.id);
    }
  }, [detail]);

  const handleSubmit = async (e: any) => {
    let hasError = false;
    if (!isArray(itemSkus)) {
      notification.error({
        message: "Vui lòng chọn sản phẩm nhập kho!",
      });
      return;
    }

    itemSkus.map((item) => {
      if (!item.weight) {
        hasError = true;
      } else if (!item.quantity) {
        hasError = true;
      }
    });
    if (hasError) {
      notification.error({
        message: "Trường khối lượng và số lượng là bắt buộc",
      });
      return;
    }

    if (!detail) {
      const body = {
        status: e.status,
        warehouse_id: e.warehouse_id,
        note: e.note,
        user_id: selectedUser,
        skus: itemSkus.map((item: any) => item.id),
        quantities: itemSkus.map((item: any) => item.quantity),
        import_price: itemSkus.map((item: any) => item.import_price),
        manufactured_date: itemSkus.map((item: any) => item.manufactured_date),
        expired_date: itemSkus.map((item: any) => item.expired_date),
        weight: itemSkus.map((item: any) => item.weight),
        total_package: itemSkus.map((item: any) => item.total_package),
        total_package_price: itemSkus.map(
          (item: any) => item.total_package_price
        ),
      };
      const data = await WarehouseImportCommandApi.createImportCommand(body);
      if (data.success) {
        window.location.href = `/warehouse/import-commands/update/${get(
          data,
          "data.id"
        )}`;
        notification.success({
          message: "Tạo phiếu nhập kho thành công!",
        });
      }
    } else {
      const body = {
        status: e.status,
        warehouse_id: e.warehouse_id,
        note: e.note,
        user_id: selectedUser,
        skus: itemSkus.map((item: any) => item.id),
        quantities: itemSkus.map((item: any) => item.quantity),
        import_price: itemSkus.map((item: any) => item.import_price),
        manufactured_date: itemSkus.map((item: any) => item.manufactured_date),
        expired_date: itemSkus.map((item: any) => item.expired_date),
        weight: itemSkus.map((item: any) => item.weight),
        total_package: itemSkus.map((item: any) => item.total_package),
        total_package_price: itemSkus.map(
          (item: any) => item.total_package_price
        ),
      };
      const data = await WarehousesImportApi.updateCommand(detail.id, body);
      if (data.success) {
        notification.success({
          message: "Cập nhật phiếu nhập kho thành công!",
        });
      }
    }
  };

  const [warehouseSelected, setWarehouseSelected] = useState<any>();
  const [warehouseManagement, setWareHouseManagement] = useState<any>();
  const [listStaff, setListStaff] = useState<
    {
      label: string;
      value: string | number;
      id: number;
    }[]
  >([]);
  const [listItem, setListItem] = useState<any[]>([]);
  const [listSelectedItemIds, setListSelectedItemIds] = useState<number[]>([]);
  const [itemSkus, setItemSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownStatus = !detail
    ? statusImportWareHouseOptions.filter(
        (option: any) => option.value !== StatusEnum.CANCELED
      )
    : statusImportWareHouseOptions;
  const warehouseId = Form.useWatch("warehouse_id", form);

  useEffect(() => {
    getListWarehouse();
    getListStaff();
    getListItem();
  }, []);

  useEffect(() => {
    if (warehouseId) {
      setWarehouseSelected(
        isArray(warehouseManagement) &&
          warehouseManagement.find((v) => v.id === warehouseId)
      );
    }
  }, [warehouseId]);

  const getDetailCommand = async (id: number | string) => {
    const { data } = await WarehouseImportCommandApi.getCommandItem(id);
    const rawData = parseItemSkuFromCommandItems(data);
    setItemSkus(rawData);
    setListSelectedItemIds(data.map((item: any) => item.item_id));
  };

  const getListWarehouse = async () => {
    const result = await WarehouseApi.getWarehouse();
    const listWarehouse = result.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setWareHouseManagement(listWarehouse);
  };

  const getListStaff = () => {
    const url = "/api/v2/users/list";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        const newListStaff = isArray(result)
          ? result.map((item: IUser) => ({
              label: item.name,
              value: item.id,
              id: item.id,
            }))
          : [];
        setListStaff(newListStaff);
      })
      .catch((error) => console.log(error));
  };

  const getListItem = async () => {
    const { data } = await ItemApi.getItem({
      limit: 10000,
    });
    const rawData = data.map((item) => ({
      label: item.code + " | " + item.name,
      id: item.id,
      value: item.code + " " + item.name,
    }));
    setListItem(rawData);
  };

  const handleAddSkus = async (option: any) => {
    const checkExist =
      isArray(listSelectedItemIds) &&
      listSelectedItemIds.findIndex((item: any) => item.id == option.id);
    if (checkExist !== -1 && isArray(listSelectedItemIds)) {
      notification.error({
        message: "Sản phẩm đã được thêm",
      });
    }
    setLoading(true);
    const { data } = await ItemSkuApi.getItemSku({
      item_id: option.id,
    });
    const rawItemSkus = parseItemSkus(data);
    setListSelectedItemIds(listSelectedItemIds.concat(option.id));
    setItemSkus(itemSkus.concat(rawItemSkus));
    setLoading(false);
  };

  const handleChangeValue = (id: string | number, key: string, value: any) => {
    const newItemSkus = itemSkus.map((v: any) => {
      if (v.id === id) {
        let newValue = v;
        newValue[key] = value;
        newValue["money"] =
          parseFloat(newValue["import_price"]) *
          parseFloat(newValue["quantity"]);
        newValue["total_money"] =
          parseFloat(newValue["import_price"]) *
            parseFloat(newValue["quantity"]) +
          parseFloat(newValue["total_package"]) *
            parseFloat(newValue["total_package_price"]);
        newValue[key] = value;
        return newValue;
      } else return v;
    });
    setItemSkus([...newItemSkus]);
  };

  const handleRemoveSelected = (id: string | number) => {
    const newItemSkus = itemSkus.filter((item: any) => item.id != id);
    setItemSkus(newItemSkus);
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      render: (_, record, index) =>
        record.id !== "total" && (
          <span className="text-medium font-medium text-[#1D1C2D]">
            {index + 1}
          </span>
        ),
    },
    {
      title: "Tên sản phẩm",
      width: 200,
      dataIndex: "name",
      fixed: "left",
      key: "name",
      render: (_, record) => {
        return (
          record.id !== "total" && (
            <span className="text-medium font-medium text-[#1D1C2D]">
              {record.name}
            </span>
          )
        );
      },
    },
    {
      title: "Danh mục",
      width: 150,
      dataIndex: "category_id",
      key: "category_id",
      fixed: "left",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <span className="text-medium font-medium text-[#1D1C2D]">
            {record.category}
          </span>
        ),
    },
    {
      title: "Giá nhập",
      width: 150,
      dataIndex: "import_price",
      key: "import_price",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <InputCurrency
            placeholder="Nhập giá bán"
            onValueChange={(e) => {
              console.log("e", e);
              handleChangeValue(record.id, "import_price", e);
            }}
            value={record.import_price || 0}
            inputMode="decimal"
            suffixInput="đ"
          />
        ) : (
          <span className="text-[#1D1C2D] font-semibold text-medium text-right">
            Tổng nhập
          </span>
        ),
    },
    {
      title: "Số lượng",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            value={record.quantity}
            onChange={(e) =>
              handleChangeValue(record.id, "quantity", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {record.import_quantity}
          </span>
        ),
    },
    {
      title: "Trọng lượng",
      width: 150,
      dataIndex: "import_weight",
      key: "import_weight",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            value={record.weight}
            suffix={<p className="text-medium text-[#2E2D3D]">kg</p>}
            onChange={(e) =>
              handleChangeValue(record.id, "weight", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {record.import_weight || 0} kg
          </span>
        ),
    },
    {
      title: "Ngày sản xuất",
      width: 250,
      dataIndex: "manufactured_date",
      key: "manufactured_date",
      align: "center",
      render: (_, record) => {
        console.log("record", record);
        return (
          <div>
            {record.id !== "total" && (
              <DatePicker
                value={
                  record.manufactured_date
                    ? moment(record.manufactured_date)
                    : undefined
                }
                onChange={(e: any) => {
                  console.log("e", e);
                  handleChangeValue(record.id, "manufactured_date", e);
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày hết hạn",
      width: 250,
      dataIndex: "expired_date",
      key: "expired_date",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <DatePicker
            value={
              record.expired_date ? moment(record.expired_date) : undefined
            }
            onChange={(e: any) =>
              handleChangeValue(record.id, "expired_date", e)
            }
          />
        ),
    },
    {
      title: "Thành tiền",
      width: 150,
      dataIndex: "money",
      key: "money",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <span
            className={classNames("text-medium font-medium text-[#1D1C2D]", {
              "font-semibold text-[#384ADC]": record.id === "total",
            })}
          >
            {Number(get(record, "money")).toLocaleString() || 0} đ
          </span>
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {parseFloat(get(record, "money")).toLocaleString() || 0} đ
          </span>
        ),
    },
    {
      title: "Số lượng kiện hàng",
      width: 150,
      dataIndex: "total_package",
      key: "total_package",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <Input
            type="number"
            value={record.total_package}
            onChange={(e) =>
              handleChangeValue(record.id, "total_package", e.target.value)
            }
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {get(record, "total_package") || 0}
          </span>
        ),
    },
    {
      title: "Đơn giá kiện hàng",
      width: 150,
      dataIndex: "total_package_price",
      key: "total_package_price",
      align: "center",
      render: (_, record) =>
        record.id !== "total" ? (
          <InputCurrency
            placeholder="Nhập giá bán"
            onValueChange={(e) => {
              handleChangeValue(record.id, "total_package_price", e);
            }}
            value={record.total_package_price}
            inputMode="decimal"
            suffixInput="đ"
          />
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {`${get(record, "total_package_price") || 0} đ`}
          </span>
        ),
    },
    {
      title: "Tổng tiền",
      width: 150,
      dataIndex: "total_money",
      key: "total_money",
      align: "center",
      render: (_, record) => {
        return record.id !== "total" ? (
          <span
            className={`font-semibold text-medium text-[${
              record.id === "total" ? "#384ADC" : "#1D1C2D"
            }]`}
          >
            {parseFloat(get(record, "total_money") || 0).toLocaleString() || 0}{" "}
            đ
          </span>
        ) : (
          <span className="text-[#384ADC] font-semibold text-medium">
            {parseFloat(get(record, "total_money")).toLocaleString() || 0} đ
          </span>
        );
      },
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      align: "center",
      render: (_, record) =>
        record.id !== "total" && (
          <span
            className="cursor-pointer"
            onClick={() =>
              handleRemoveSelected && handleRemoveSelected(record.id)
            }
          >
            <Icon icon="cancel" size={20} />
          </span>
        ),
    },
  ];

  const handleSyncSku = () => {
    syncForm
      .validateFields()
      .then(() => {
        const formValue = syncForm.getFieldsValue();
        let isChangeTotalMoney = false;
        let isChangeMoney = false;
        if (
          formValue.import_price ||
          formValue.quantity ||
          formValue.total_package_price ||
          formValue.total_package
        ) {
          isChangeTotalMoney = true;
          if (formValue.import_price || formValue.quantity) {
            isChangeMoney = true;
          }
        }
        console.log("formValue", formValue);
        const newItemSkus = itemSkus.map((v: any) => {
          return {
            ...v,
            import_price: formValue.import_price
              ? formValue.import_price
              : v.import_price,
            quantity: formValue.quantity ? formValue.quantity : v.quantity,
            price_in_app: formValue.price ? formValue.price : v.price_in_app,
            weight: formValue.weight ? formValue.weight : v.weight,
            manufactured_date: formValue.manufactured_date
              ? format(
                  new Date(formValue.manufactured_date),
                  "yyyy-MM-dd HH:mm"
                )
              : v.manufactured_date,
            expired_date: formValue.expired_date
              ? format(new Date(formValue.expired_date), "yyyy-MM-dd HH:mm")
              : v.expired_date,
            total_package: formValue.total_package
              ? formValue.total_package
              : v.total_package,
            total_package_price: formValue.total_package_price
              ? formValue.total_package_price
              : v.total_package_price,
            money: isChangeMoney
              ? parseFloat(formValue.import_price || 0) *
                parseFloat(formValue.quantity || 0)
              : v.money,
            total_money: isChangeTotalMoney
              ? parseFloat(formValue.import_price || 0) *
                  parseFloat(formValue.quantity || 0) +
                parseFloat(formValue.total_package || 0) *
                  parseFloat(formValue.total_package_price || 0)
              : v.total_money,
          };
        });
        console.log("newItemSkus", newItemSkus);
        setItemSkus([...newItemSkus]);
      })
      .catch((err) => {});
  };

  const PopoverAsync = (
    <Form form={syncForm} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Giá nhập</div>
          <Form.Item name="import_price" className="d-none">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập giá nhập"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">đ</p>
              }
            />
          </Form.Item>
          <InputCurrency
            width={154}
            placeholder="Nhập giá nhập"
            onValueChange={(e) => {
              syncForm.setFieldValue("import_price", e);
            }}
            defaultValue={0}
            inputMode="decimal"
            suffixInput="đ"
          />
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Số lượng</div>
          <Form.Item name="quantity">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập số lượng"
            />
          </Form.Item>
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Trọng lượng SP</div>
          <Form.Item name="weight">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập trọng lượng"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">kg</p>
              }
            />
          </Form.Item>
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Ngày sản xuất</div>
          <Form.Item name="manufactured_date">
            <DatePicker />
          </Form.Item>
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">Ngày hết hạn</div>
          <Form.Item name="expired_date">
            <DatePicker />
          </Form.Item>
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">
            Số lượng kiện hàng
          </div>
          <Form.Item name="total_package">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập số lượng kiện hàng"
            />
          </Form.Item>
        </div>
        <div className="flex justify-between w-full items-center mb-[8px]">
          <div className="text-medium font-medium mb-[4px]">
            Đơn giá kiện hàng
          </div>
          <Form.Item name="total_package_price" className="d-none">
            <Input
              width={154}
              className="rounded-lg"
              placeholder="Nhập đơn giá kiện hàng"
              suffix={
                <p className="text-medium font-normal text-[#DADADD]">đ</p>
              }
            />
          </Form.Item>
          <InputCurrency
            width={154}
            placeholder="Nhập đơn giá kiện hàng"
            onValueChange={(e) => {
              syncForm.setFieldValue("total_package_price", e);
            }}
            defaultValue={0}
            inputMode="decimal"
            suffixInput="đ"
          />
        </div>
        <div
          className="mt-[16px] bg-[#384ADC] text-[#fff] w-[297px] h-[39px] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleSyncSku}
        >
          Đồng bộ
        </div>
      </div>
    </Form>
  );

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <TitlePage
          href="/warehouse/import-commands"
          title={detail ? "Chi tiết phiếu nhập kho" : "Tạo phiếu nhập kho"}
        />
        <Form.Item name="items" />
        <div className="flex gap-x-2">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium">Trạng thái</div>
            <Form.Item name="status">
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: 162 }}
                options={dropdownStatus}
                defaultValue={""}
              />
            </Form.Item>
          </div>
          <Button
            htmlType="submit"
            variant="secondary"
            width={148}
            style={{ fontWeight: "bold" }}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex gap-x-3">
        <div className="flex flex-col gap-y-4 bg-white flex-1 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              Mã nhập kho:
            </span>
            <span className="text-medium font-medium text-[#2E2D3D]">
              {detail?.code || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-medium font-medium text-[#2E2D3D]">
              Thời điểm tạo:
            </span>
            <span className="text-medium font-medium text-[#2E2D3D]">
              {detail?.created_at
                ? format(new Date(detail.created_at), "dd/MM/yyyy")
                : format(new Date(), "dd/MM/yyyy")}
            </span>
          </div>
          {detail && (
            <Form.Item name="created_user_id">
              <Select
                label="Nhân viên xử lý"
                placeholder="Chọn nhân viên xử lý"
                options={listStaff}
                value={parseFloat(selectedUser)}
                disabled
              />
            </Form.Item>
          )}
          <Form.Item name="note">
            <TextArea
              label="Ghi chú"
              className="!h-[112px]"
              placeholder="Nhập ghi chú"
            />
          </Form.Item>
        </div>
        <div className="justify-between gap-y-4 bg-white flex-1 p-3 rounded">
          <Form.Item name="warehouse_id">
            <Select
              label="Chọn kho nhập"
              placeholder="Chọn kho nhập"
              options={warehouseManagement}
              // onChange={(val) => handleFindWarehouse(val)}
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
          containerClassName="flex-1"
          allowClear
          placeholder="Nhập mã sản phẩm / tên sản phẩm"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          clearIcon={<Icon icon="cancel" size={16} />}
          options={listItem}
          onChange={(e, option: any) => handleAddSkus(option)}
          showSearch
        />
        <Popover
          placement="bottomRight"
          content={PopoverAsync}
          trigger="click"
          overlayStyle={{ width: "354px" }}
          className="relative"
        >
          <Button width={195} height={45} className="p-0">
            <div className="w-[200px] flex justify-between p-[10px] items-center">
              <div className="flex justify-left">
                <Icon icon="repeat" size={24} className="mr-[10px]" />
                Đồng bộ
              </div>
              <Icon icon="arrow-down-1" size={14} />
            </div>
          </Button>
        </Popover>
      </div>
      {/* Table */}
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        columns={columns}
        dataSource={
          itemSkus.length > 0
            ? [
                ...itemSkus,
                {
                  id: "total",
                  name: "",
                  category_id: "",
                  export_price: 0,
                  import_quantity: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.quantity),
                    0
                  ),
                  import_price: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.import_price),
                    0
                  ),
                  import_weight: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.weight),
                    0
                  ),
                  total_package: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.total_package),
                    0
                  ),
                  total_package_price: itemSkus.reduce(
                    (init, item) =>
                      Number(init) + Number(item.total_package_price),
                    0
                  ),
                  money: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.money),
                    0
                  ),
                  total_money: itemSkus.reduce(
                    (init, item) => Number(init) + Number(item.total_money),
                    0
                  ),
                },
              ]
            : []
        }
        loading={loading}
        pagination={false}
        scroll={{ x: 50, y: 900 }}
      />
    </Form>
  );
};

export default ImportWareHouseForm;
