/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getEnvironmentData } from "worker_threads";
import TitlePage from "../../components/TitlePage/Titlepage";
import styles from "../../styles/DetailCustomer.module.css";
import { notification, Popover, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableEmpty from "../../components/TableEmpty";
import ReviewManagementApi from "../../services/reviews";
import { isArray } from "../../utils/utils";
import { get } from "lodash";
import Item from "antd/lib/list/Item";
import { format } from "date-fns";
import YellowStart from "../../../public/images/yellow-star.svg";
import Select from "../../components/Select/Select";
import Icon from "../../components/Icon/Icon";

const ReviewManagementPage: React.FC = () => {
  const defaultPagination = {
    current: 1,
    page: 1,
    total: 0,
    pageSize: 10,
  };
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any>({});
  const [pagination, setPagination] = useState<{
    current: number;
    page: number;
    total: number;
    pageSize: number;
  }>(defaultPagination);
  const [orderOptions, setOrderOptions] = useState<any[]>([
    {
      label: "Mới nhất",
      value: 1,
    },
    {
      label: "Cũ nhất",
      value: 2,
    },
  ]);

  useEffect(() => {
    getData();
  }, [filter, pagination.page, pagination.pageSize, pagination.current]);

  const getData = async () => {
    setLoading(true);
    const { data, totalReviews, totalPage } = await ReviewManagementApi.list({
      ...filter,
      ...pagination,
    });
    let rawData: any[] = [];
    isArray(data) &&
      data.map((item: any) => {
        let name = get(item, "item_sku.item.name");
        if (get(item, "item_sku.item.item_category")) {
          name += " - " + get(item, "item_sku.item.item_category.name");
        }
        isArray(item.item_sku.item_attribute_values) &&
          item.item_sku.item_attribute_values.map((v: any) => {
            name = name + " - " + v.value;
          });
        rawData.push({
          id: item.id,
          name: name,
          star: item.star,
          is_show: item.is_show,
          images: item.images,
          content: item.content,
          tags: item.tags,
          user: item.user,
          created_at: item.created_at,
        });
      });
    setReviews(rawData);
    setPagination({
      ...pagination,
      total: totalReviews,
    });
    setLoading(false);
  };

  const handleChangeValue = (id: any, key: string, value: any) => {
    console.log("id", id);
    console.log("key", key);
    console.log("value", value);
    updateReview(id, value);
    setReviews((reviews) =>
      reviews.map((review) => {
        if (review.id === id) {
          return {
            ...review,
            [key]: value,
          };
        }
        return review;
      })
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "THỜI GIAN",
      width: 150,
      dataIndex: "created_at",
      key: "created_at",
      align: "left",
      render: (_, record) => (
        <div className="flex flex-col gap-y-1 text-medium text-[#1D1C2D]">
          <span>{format(new Date(record.created_at), "HH:mm")}</span>
          <span>{format(new Date(record.created_at), "dd/MM/yyyy")}</span>
        </div>
      ),
    },
    {
      title: "TÊN & ID KHÁCH HÀNG",
      width: 170,
      dataIndex: "user",
      key: "user",
      align: "left",
      render: (_, record) => <div>{get(record, "user.name")}</div>,
    },
    {
      title: "SP ĐÁNH GIÁ",
      width: 200,
      dataIndex: "user",
      key: "user",
      align: "left",
      render: (_, record: any) => <div>{record.name}</div>,
    },
    {
      title: "ĐÁNH GIÁ",
      width: 100,
      dataIndex: "start",
      key: "start",
      align: "left",
      render: (_, record: any) => (
        <div className="flex items-center gap-[4px]">
          {record.star}
          <span>
            <YellowStart />
          </span>
        </div>
      ),
    },
    {
      title: "CHI TIẾT",
      width: 250,
      dataIndex: "description",
      key: "description",
      align: "left",
      render: (_, record: any) => {
        return (
          <div>
            <div className="mb-[8px]">{record.content}</div>
            <div className="flex flex-wrap gap-[8px] mb-[8px]">
              {isArray(record.images) &&
                record.images.map((item, index) => {
                  return (
                    <img
                      key={index}
                      src={item}
                      alt="image"
                      style={{ width: 71, height: 71 }}
                    />
                  );
                })}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {isArray(record.tags) &&
                record.tags.map((tag, index) => {
                  return (
                    <div className={styles.tag} key={index}>
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      },
    },
    {
      title: "THAO TÁC",
      width: 100,
      dataIndex: "description",
      key: "description",
      align: "left",
      render: (_, record: any) => (
        <div
          className="font-semibold text-[#384ADC] cursor-pointer"
          onClick={() => {
            console.log("record", record);
            handleChangeValue(
              record.id,
              "is_show",
              record.is_show == 0 ? 1 : 0
            );
          }}
        >
          {record.is_show == 0 ? "Hiện" : "Ẩn"}
        </div>
      ),
    },
  ];

  const updateReview = async (id: any, value) => {
    const data = await ReviewManagementApi.updateReview(id, {
      is_show: value,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-[32px]">
        <TitlePage
          title="Quản lý đánh giá"
          description="Quản lý ứng dụng / Quản lý đánh giá"
        />
        <div className="flex gap-[8px] flex-wrap">
          <Select
            clearIcon={<Icon icon="cancel" size={16} />}
            containerClassName={styles.wrapper_select}
            style={{ width: 150 }}
            options={orderOptions}
            onChange={(e) => {
              setPagination({
                current: 1,
                page: 1,
                total: 0,
                pageSize: pagination.pageSize || 10,
              });
              setFilter({
                ...filter,
                sort: e,
              });
            }}
            placeholder="Sắp xếp theo"
          />
        </div>
      </div>
      <div className="relative mt-[25px]">
        <Table
          loading={loading}
          columns={columns}
          dataSource={[...reviews]}
          pagination={{
            total: pagination.total,
            defaultPageSize: pagination.pageSize,
            current: pagination.current,
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
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
          scroll={{ x: 50 }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<ReviewManagementPage />, document.getElementById("root"));
