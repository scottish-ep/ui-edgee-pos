import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { message, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { warehouses, containerManagementList } from "../../../const/constant";
import TitlePage from "../../../components/TitlePage/Titlepage";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input/Input";
import ModalRemove from "../../../components/ModalRemove/ModalRemove";
import { onCoppy } from "../../../utils/utils";
import TableEmpty from "../../../components/TableEmpty";
import { IContainerManagement } from "../orders.type";
import ModalAddContainerManagement from "./ModalAddContainerManagement";
import PaginationCustom from "../../../components/PaginationCustom";
import WarehouseApi from "../../../services/warehouses";
import { IOption } from "../../../types/permission";
import ItemBoxApi from "../../../services/item-box";
import {
  IWarehouseList,
  IWareHouseManagement,
} from "../../warehouses/warehouse.type";
import Api from "../../../services";
import { useDebounce } from "usehooks-ts";
import { uuid } from "uuidv4";

const ContainerManagementList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [containerManagements, setContainerManagements] = useState<
    IContainerManagement[]
  >([...containerManagementList]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: containerManagements.length,
    pageSize: 10,
    page: 1,
  });
  const [
    isShowModalAddContainerManagement,
    setIsShowModalAddContainerManagement,
  ] = useState(false);
  const [
    isShowModalRemoveContainerManagement,
    setIsShowModalRemoveContainerManagement,
  ] = useState(false);
  const [warehouses, setWarehouses] = useState<IOption[]>([]);
  const [warehouseList, setWarehouseList] = useState<IWarehouseList[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | string>();
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [reload, setReload] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemBoxes, setItemBoxes] = useState<IContainerManagement[]>([]);
  const [itemCategories, setItemCategories] = useState<Array<IOption>>([]);
  const debouncedValue = useDebounce<string>(searchPhrase, 500);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getAllItemBox();
  }, [
    pagination.page,
    pagination.pageSize,
    warehouseId,
    debouncedValue,
    reload,
  ]);

  useEffect(() => {
    console.log(
      "🚀 ~ file: container-management-list.tsx ~ line 66 ~ useEffect ~ itemCategories",
      itemCategories
    );
  });

  const getAllItemBox = async () => {
    setLoading(true);
    const { data, totalPage, totalItems } = await ItemBoxApi.getListItemBox({
      limit: pagination.pageSize,
      page: pagination.page,
      name: searchPhrase,
      warehouse_id: warehouseId,
    });

    setItemBoxes(data);
    setTotalItems(totalItems);
    setLoading(false);
  };

  useEffect(() => {
    getAllWarehouse();
    getAllCategories();
  }, []);

  const getAllWarehouse = async () => {
    const url = `/api/v2/warehouses/list`;
    const { data } = await Api.get(url);

    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];

    data?.data?.map((item) => {
      arr.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setWarehouses(arr);
    setWarehouseList(data?.data);
  };

  const getAllCategories = async () => {
    const url = `/api/v2/item-categories/list`;
    const { data } = await Api.get(url);
    console.log(
      "🚀 ~ file: container-management-list.tsx ~ line 110 ~ getAllCategories ~ data2",
      data
    );

    let arr: Array<IOption> = [
      {
        value: "",
        label: "--chọn--",
      },
    ];

    data?.data?.data?.map((item) => {
      arr.push(item);
    });
    setItemCategories(arr);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onToggleIsAllowWholesale = async (
    checked: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
    id: number | string
  ) => {
    console.log(
      "🚀 ~ file: wholesale-list.tsx ~ line 106 ~ onToggleIsAllowWholesale ~ checked",
      checked
    );
    e.stopPropagation();
    const { data } = await ItemBoxApi.toggleIsAllowWholesale(id);
    if (data) {
      message.success("Cập nhật thành công");
    }
    setReload(uuid);
  };

  const columns: ColumnsType<IContainerManagement> = [
    {
      title: "Sử dụng",
      width: 100,
      key: "apply",
      align: "center",
      render: (_, record) => {
        return (
          <Switch
            className="button-switch"
            defaultChecked={record?.is_enable}
            onChange={(checked, event) =>
              onToggleIsAllowWholesale(checked, event, record.id)
            }
          />
        );
      },
    },
    {
      title: "Mã thùng",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="text-medium text-[#1D1C2D]"
          onClick={(e) => onCoppy(e, record.code)}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên loại thùng hàng",
      width: 150,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D]">{record.name}</span>
      ),
    },
    {
      title: "Kích cỡ",
      width: 100,
      dataIndex: "size",
      key: "size",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D]">{record.size}</span>
      ),
    },
    {
      title: "Đơn giá",
      width: 100,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record.price.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Số lượng nhập",
      width: 100,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record?.item_box_warehouse_inventory_sum_quantity}
        </span>
      ),
    },
    // {
    //   title: "Đã đóng đi",
    //   width: 100,
    //   dataIndex: "close",
    //   key: "close",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#1D1C2D] font-medium">
    //       {/* {record.} */} đã đóng đi
    //     </span>
    //   ),
    // },
    // {
    //   title: "Còn lại",
    //   width: 100,
    //   dataIndex: "total",
    //   key: "total",
    //   align: "center",
    //   render: (_, record) => (
    //     <span className="text-medium text-[#1D1C2D] font-medium">
    //       {/* {record.total} */} còn lại
    //     </span>
    //   ),
    // },
    {
      title: "Loại sản phẩm",
      width: 150,
      dataIndex: "category_ids",
      key: "category_ids",
      align: "left",
      render: (_, record) => (
        <div className="inline-block">
          {record.categories.map((category, index) => (
            <React.Fragment key={index}>
              <span className="text-medium text-[#1D1C2D] font-medium">
                {category?.name}
              </span>
              {index !== record.categories.length - 1 && (
                <span className="text-medium text-[#1D1C2D] font-medium mx-1">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      title: "Trọng lượng tối đa",
      width: 150,
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#1D1C2D] font-medium">
          {record?.max_weight_product || "--"} kg
        </span>
      ),
    },
  ];

  const onDeleteMany = async () => {
    console.log("delete: ", selectedRowKeys);
    const { data } = await ItemBoxApi.deleteMany(selectedRowKeys);
    if (data) {
      message.success("Xóa thành công");
    }
    setReload(uuid);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Quản lý thùng hàng" />
        <div className="flex gap-[8px] flex-wrap">
          <div className="flex items-center">
            <div className="font-medium mr-[12px] text-medium min-w-[70px]">
              Chọn kho
            </div>
            <Select
              placeholder="Chọn kho"
              style={{ width: 248 }}
              options={warehouses}
              onChange={(value) => {
                setPagination({
                  ...pagination,
                  page: 1,
                });
                setWarehouseId(value);
              }}
              value={warehouseId}
            />
          </div>
          <Button
            variant="outlined"
            width={109}
            icon={<Icon icon="export" size={24} />}
          >
            Xuất file
          </Button>
          <Button
            variant="primary"
            width={151}
            color="white"
            suffixIcon={<Icon icon="add" size={24} />}
            onClick={() => setIsShowModalAddContainerManagement(true)}
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
      <div className="flex items-center flex-wrap gap-[8px] mb-[12px]">
        <Input
          className="flex-1"
          prefix={<Icon icon="search" color="#FF970D" size={24} />}
          placeholder="Tên, mã thùng hàng"
          value={searchPhrase}
          onChange={(e) => {
            setPagination({
              ...pagination,
              page: 1,
            });
            setSearchPhrase(e.target.value);
          }}
        />
        <Button
          variant="danger-outlined"
          width={134}
          icon={<Icon icon="trash" size={24} />}
          disabled={!selectedRowKeys.length}
          onClick={() => setIsShowModalRemoveContainerManagement(true)}
        >
          Xóa
        </Button>
      </div>
      <Table
        rowKey={(record) => record.id}
        locale={{
          emptyText: <TableEmpty />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              window.location.href = `/order-management/container-management/detail?id=${record?.id}`;
            },
          };
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={itemBoxes}
        pagination={false}
        scroll={{ x: 50 }}
      />

      <PaginationCustom
        total={totalItems}
        defaultPageSize={pagination.pageSize}
        current={pagination.page}
        onChangePage={(page) =>
          setPagination({
            ...pagination,
            page,
          })
        }
        onChangePageSize={(pageSize) =>
          setPagination({
            ...pagination,
            pageSize,
          })
        }
      />

      <ModalAddContainerManagement
        isVisible={isShowModalAddContainerManagement}
        onClose={() => setIsShowModalAddContainerManagement(false)}
        onSuccess={(uuid) => {
          setReload(uuid);
          setIsShowModalAddContainerManagement(fail);
        }}
        warehouseList={warehouseList}
        categories={itemCategories}
      />

      <ModalRemove
        isVisible={isShowModalRemoveContainerManagement}
        onClose={() => setIsShowModalRemoveContainerManagement(false)}
        onOpen={() => setIsShowModalRemoveContainerManagement(false)}
        titleBody="Xóa thùng hàng này?"
        content="Dữ liệu của thùng hàng sẽ không còn nữa."
        onOk={onDeleteMany}
      />
    </div>
  );
};

ReactDOM.render(<ContainerManagementList />, document.getElementById("root"));
