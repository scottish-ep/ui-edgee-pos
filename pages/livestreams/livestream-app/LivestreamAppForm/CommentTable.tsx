/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import TableEmpty from "../../../../components/TableEmpty";
import { IComment } from "../livestream-app.type";
import { get } from "lodash";

interface CommentTableProps {
  commentList: IComment[];
  isFilterComment?: boolean;
}

const CommentTable: React.FC<CommentTableProps> = ({
  commentList,
  isFilterComment = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [listComment, setListComment] = useState<any[]>([]);

  useEffect(() => {
    if (isFilterComment) {
      console.log("commentList", commentList);
      const listNewComment = commentList.filter(
        (item) => !!get(item, "user.phone")
      );
      setListComment(listNewComment);
    } else {
      setListComment(commentList);
    }
  }, [commentList, isFilterComment]);

  const columns: ColumnsType<IComment> = [
    {
      title: "Thời gian",
      width: 150,
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record.created_at
            ? format(new Date(record.created_at), "HH:mm:ss")
            : "--"}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      width: 250,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record.user.customer.name || record.user.name || "--"}
        </span>
      ),
    },
    {
      title: "Bình luận",
      width: 300,
      dataIndex: "comment",
      key: "comment",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D]">
          {record.comment || "--"}
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      width: 150,
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {get(record, "user.phone", "--")}
        </span>
      ),
    },
    // {
    //   title: "Nhà mạng",
    //   width: 100,
    //   dataIndex: "networkProviders",
    //   key: "networkProviders",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#1D1C2D] font-medium">
    //       {get(record, 'user.network_provider', '--')}
    //     </span>
    //   ),
    // },
  ];
  // validate number

  return (
    <Table
      rowKey={(record) => record.id}
      locale={{
        emptyText: <TableEmpty />,
      }}
      loading={loading}
      columns={columns}
      dataSource={listComment}
      pagination={false}
      scroll={{ x: 50, y: 1000 }}
    />
  );
};

export default CommentTable;
