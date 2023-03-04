/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import TitlePage from "../../../components/TitlePage/Titlepage";
import { ITartget } from "../staff.type";
import type { ColumnsType } from "antd/es/table";
import { StatusColorEnum, StatusList } from "../../../types";
import TargetApi from "../../../services/targets";
import { get } from "lodash";
import { format } from "date-fns";
import { calcTimeTarget } from "../../../utils/utils";
import { TargetStatusEnum } from "../../../enums/enums";

const ListTarget = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<any>({});
  const [pagination, setPagination] = useState<{
    current: number;
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [targets, setTargets] = useState<any[]>([]);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getListTarget();
  }, [pagination.page, pagination.pageSize]);

  const getListTarget = async () => {
    setLoading(true);
    const data = await TargetApi.getList({
      limit: pagination.pageSize,
      page: pagination.page,
    });
    setTargets(data.data);
    setPagination({
      ...pagination,
      total: get(data, "totalPage") * get(data, "totalTargets"),
    });
    setLoading(false);
  };

  const colsData: ITartget[] = Array(50)
  .fill({
    name: "Hoan Thanh 100 bai",
    from : Date.now(),
    to: Date.now(),
  })
  .map((item, index) => ({...item, id: index++}))

  const columns: ColumnsType<ITartget> = [
    {
      title: "Tên chỉ tiêu",
      width: 600,
      key: "id",
      align: "left",
      render: (_, record) => {
        return <div>{record.name}</div>;
      },
    },
    {
      title: "Thời gian áp dụng",
      width: 300,
      key: "id",
      align: "center",
      render: (_, record: any) => {
        return (
          <div>
            <span>
              {record.from && format(new Date(record.from), "dd/MM/yyyy")}
            </span>
            <span> {record.to && "-"} </span>
            <span>
              {record.to && format(new Date(record.to), "dd/MM/yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      width: 220,
      key: "id",
      align: "center",
      render: (_, record: any) => {
        const { color, label } = calcTimeTarget(
          new Date(record.from),
          new Date(record.to)
        );
        return <span className={`font-semibold text-[${color}]`}>{label}</span>;
      },
    },
    // {
    //   title: "",
    //   width: 50,
    //   key: "id",
    //   align: "center",
    //   render: (_, record: any) => {
    //     const { status } = calcTimeTarget(
    //       new Date(record.from),
    //       new Date(record.to)
    //     );
    //     return (
    //       status !== TargetStatusEnum.COMPLETED && (
    //         <div
    //           onClick={() => window.location.href = `/staff/target/edit/${record.id}`}
    //           className="cursor-pointer"
    //         >
    //           <Icon icon="edit-2" />
    //         </div>
    //       )
    //     );
    //   },
    // },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Danh sách chỉ tiêu" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => (window.location.href = "/staff/target/create")}
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
      <Table
        loading={loading}
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = `/staff/target/${record.id}`;
            },
          };
        }}
        columns={columns}
        // dataSource={[...targets]}
        dataSource={colsData}
        pagination={{
          total: pagination.total,
          defaultPageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onChange={(e) => {
          setPagination({
            ...pagination,
            current: e.current || 1,
            page: e.current || 1,
            pageSize: e.pageSize || 10,
          });
        }}

        scroll={{ y: 500 }}
      />
    </div>
  );
};

export default ListTarget;
