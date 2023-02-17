import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getEnvironmentData } from "worker_threads";
import TableEmpty from "../../components/TableEmpty";
import TitlePage from "../../components/TitlePage/Titlepage";
import styles from "../../styles/DetailCustomer.module.css";
import { notification, Popover, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Input from "../../components/Input/Input";
import { get } from "lodash";
import TransportFeeApi from "../../services/transport-fee";
import Button from "../../components/Button/Button";
import { isArray } from "../../utils/utils";

const SettingFeeTransport: React.FC = () => {
  const [settingFees, setSettingFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const data = await TransportFeeApi.list();
    console.log("data", data);
    if (data) {
      let rawSettingFees: any[] = [];
      rawSettingFees.push({
        fee_exterritorial: data.fee_exterritorial,
        fee_suburban: data.fee_suburban,
        fee_urban: data.fee_urban,
      });
      setSettingFees(rawSettingFees);
    }
    setLoading(false);
  };

  const handleChangeValue = (id: string, key: string, value: string) => {
    setSettingFees((settingFees) =>
      settingFees.map((fee) => {
        if (fee.id === id) {
          return {
            ...fee,
            [key]: Number(value),
          };
        }
        return fee;
      })
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "#",
      width: 240,
      dataIndex: "id",
      key: "id",
      align: "left",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Tên Cấu Hình",
      width: 240,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <div className="font-medium font-semibold">Phí vận chuyển</div>
      ),
    },
    {
      title: "Nội thành",
      width: 240,
      dataIndex: "id",
      key: "id",
      align: "left",
      render: (_, record) => (
        <div>
          <Input
            type="number"
            value={parseFloat(get(record, "fee_urban")) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
            onChange={(e) =>
              handleChangeValue(record.id, "fee_urban", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: "Ngoại thành",
      width: 240,
      dataIndex: "id",
      key: "id",
      align: "left",
      render: (_, record) => (
        <div>
          <Input
            type="number"
            value={parseFloat(get(record, "fee_suburban")) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
            onChange={(e) =>
              handleChangeValue(record.id, "fee_suburban", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: "Ngoại tỉnh",
      width: 240,
      dataIndex: "id",
      key: "id",
      align: "left",
      render: (_, record) => (
        <div>
          <Input
            type="number"
            value={parseFloat(get(record, "fee_exterritorial")) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">đ</p>}
            onChange={(e) =>
              handleChangeValue(record.id, "fee_exterritorial", e.target.value)
            }
          />
        </div>
      ),
    },
  ];

  const saveChange = async () => {
    if (isArray(settingFees) && settingFees[0]) {
      const dataChange = settingFees[0];
      const data = await TransportFeeApi.update({
        fee_exterritorial: dataChange.fee_exterritorial,
        fee_suburban: dataChange.fee_suburban,
        fee_urban: dataChange.fee_urban,
      });
      if (data) {
        notification.success({
          message: "Cập nhật thành công!",
        });
      } else {
        notification.error({
          message: "Cập nhật không thành công!",
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-[32px]">
        <TitlePage title="Phí vận chuyển" description="Cấu hình" />
        <div className="flex gap-[8px] flex-wrap">
          <Button onClick={() => saveChange()} variant="secondary" width={187}>
            LƯU
          </Button>
        </div>
      </div>
      <div className="relative mt-[25px]">
        <Table
          loading={loading}
          columns={columns}
          dataSource={[...settingFees]}
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
    </div>
  );
};

ReactDOM.render(<SettingFeeTransport />, document.getElementById("root"));
