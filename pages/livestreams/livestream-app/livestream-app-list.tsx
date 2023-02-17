/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import DatePicker from "../../../components/DateRangePicker/DateRangePicker";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import PaginationCustom from "../../../components/PaginationCustom";
import TableEmpty from "../../../components/TableEmpty";
import TitlePage from "../../../components/TitlePage/Titlepage";
import { LivestreamStatusList } from "../../../types";
import { onCoppy } from "../../../utils/utils";
import { ILivestreamApp } from "./livestream-app.type";
import LivestreamApi from "../../../services/livestream";
import {
  LivestreamStatusColorEnum,
  LivestreamStatusEnum,
} from "../../../enums/enums";
import moment from "moment";

const LivestreamAppList: React.FC = () => {
  const [liveStreamApps, setLivestreamApps] = useState<ILivestreamApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: liveStreamApps.length,
    pageSize: 10,
    page: 1,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  useEffect(() => {
    getLiveStreamList();
  }, [pagination.page, pagination.pageSize, searchPhrase, startDate, endDate]);

  const columns: ColumnsType<ILivestreamApp> = [
    {
      title: "#",
      width: 75,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#1D1C2D] font-medium"
          onClick={(e) => onCoppy(e, record.id)}
        >
          {record.id}
        </span>
      ),
    },
    {
      title: "Tên live stream",
      width: 250,
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
      title: "Số sản phẩm",
      width: 150,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#4B4B59] font-medium">
          {record.quantity || "--"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      width: 150,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <span
          className={`text-medium font-medium text-[${
            LivestreamStatusList.find((status) => status.name === record.status)
              ?.color
          }]`}
        >
          {
            LivestreamStatusList.find((status) => status.name === record.status)
              ?.value
          }
        </span>
      ),
    },
    {
      title: "Thời gian kết thúc",
      width: 200,
      dataIndex: "ended_at",
      key: "ended_at",
      align: "center",
      render: (_, record) => {
        return (
          <span className="text-medium text-[#1D1C2D] font-medium">
            {record.ended_at &&
            (record.status === LivestreamStatusEnum.COMPLETED ||
              record.status === LivestreamStatusEnum.CANCELLED)
              ? moment(new Date(record.ended_at)).format("DD-MM-YYYY HH:mm")
              : "--"}
          </span>
        );
      },
    },
  ];

  const handleSelectDateRange = (value) => {
    if (value) {
      setStartDate(value[0].format("YYYY-MM-DD"));
      setEndDate(value[1].format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const getLiveStreamList = async () => {
    setLoading(true);
    const { data, totalPage } = await LivestreamApi.getLivestreamList({
      limit: pagination.pageSize,
      page: pagination.page,
      name: searchPhrase,
      started_at: startDate,
      ended_at: endDate,
    });
    setLivestreamApps(data);
    setPagination({
      ...pagination,
      total: totalPage * pagination.pageSize,
    });
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 flex-wrap justify-between">
        <TitlePage title="Livestream trên app" />
        <div className="flex gap-x-4">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = "/livestream/app/add")}
          >
            Thêm mới
          </Button>
          <Button
            variant="no-outlined"
            width={62}
            color="white"
            icon={<Icon icon="question" size={16} />}
          >
            <a
              href="https://docs.google.com/document/d/1wXPHowLeFIU6q-iXi-ryM56m7GuLahu4FFxsNPzJXYw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hỗ trợ
            </a>
          </Button>
        </div>
      </div>
      {/* <div className="flex gap-2 my-3 flex-wrap">
        <Input
          className="flex-1 w-[306px]"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Tìm tên livestream"
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <DatePicker
          width={306}
          onChange={handleSelectDateRange}
          isFutureDate={false}
        />
      </div> */}
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = "/livestream/app/live/" + record.id;
            },
          };
        }}
        loading={loading}
        columns={columns}
        dataSource={liveStreamApps}
        pagination={false}
        scroll={{ x: 50, y: 1000 }}
      />
      <PaginationCustom
        defaultPageSize={pagination.pageSize}
        total={pagination.total}
        current={pagination.page}
        onChangePage={(page) =>
          setPagination({
            ...pagination,
            page,
          })
        }
        onChangePageSize={(pageSize) => {
          setPagination({
            ...pagination,
            page: 1,
            pageSize,
          });
        }}
      />
    </div>
  );
};

ReactDOM.render(<LivestreamAppList />, document.getElementById("root"));
