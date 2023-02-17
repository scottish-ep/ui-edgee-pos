import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import TableEmpty from "../../../components/TableEmpty";
import { ISettingsOfWholeSale } from "../promotion.type";
import { uuid } from "uuidv4";

interface WholeSaleTableProps {
  settingList: ISettingsOfWholeSale[];
  setSettingList: React.Dispatch<React.SetStateAction<ISettingsOfWholeSale[]>>;
}

const WholeSaleTable: React.FC<WholeSaleTableProps> = ({
  settingList,
  setSettingList,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteProduct = (id: string) => {
    setSettingList((prevSettingList) =>
      prevSettingList.filter((setting) => setting.id !== id)
    );
  };

  const handleAddRow = () => {
    setSettingList((prevSettingList) => [
      ...prevSettingList,
      {
        id: uuid(),
        from_price: 0,
        to_price: 0,
        price: 0,
      },
    ]);
  };

  const handleChangeValue = (id: string, name: string, value: string) => {
    setSettingList((prevSettingList) =>
      prevSettingList.map((setting) => {
        if (setting.id === id) {
          return { ...setting, [name]: Number(value) };
        }

        return setting;
      })
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      render: (_, record, index) =>
        record.id !== "add" ? (
          <span className="text-medium text-[#1D1C2D] font-medium">
            {index + 1}
          </span>
        ) : (
          <div className="flex gap-x-1 items-center w-max">
            <Icon icon="plus-2" size={20} color="#384ADC" />
            <span
              className="text-[#384ADC] text-medium font-semibold cursor-pointer"
              onClick={handleAddRow}
            >
              Thêm mới
            </span>
          </div>
        ),
    },
    {
      title: "Từ",
      width: 100,
      dataIndex: "from",
      key: "from",
      align: "center",
      render: (_, record) =>
        record.id !== "add" && (
          <Input
            type="number"
            className="w-full"
            value={record.from_price}
            placeholder="Nhập"
            onChange={(e) =>
              handleChangeValue(record.id, "from_price", e.target.value)
            }
          />
        ),
    },
    {
      title: "Đến",
      width: 100,
      dataIndex: "to",
      key: "to",
      align: "center",
      render: (_, record) =>
        record.id !== "add" && (
          <Input
            type="number"
            className="w-full"
            placeholder="Nhập"
            value={record.to_price}
            onChange={(e) =>
              handleChangeValue(record.id, "to_price", e.target.value)
            }
          />
        ),
    },
    {
      title: "Giá bán sỉ",
      width: 250,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) =>
        record.id !== "add" && (
          <Input
            type="number"
            value={record.price}
            className="w-full"
            placeholder="Nhập giá bán sỉ"
            onChange={(e) =>
              handleChangeValue(record.id, "price", e.target.value)
            }
          />
        ),
    },
    {
      title: "",
      width: 50,
      dataIndex: "",
      key: "",
      render: (_, record) =>
        record.id !== "add" && (
          <span
            className="cursor-pointer flex justify-center"
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
      loading={loading}
      columns={columns}
      dataSource={[
        ...settingList,
        {
          id: "add",
        },
      ]}
      pagination={false}
      scroll={{ x: 50 }}
    />
  );
};

export default WholeSaleTable;
