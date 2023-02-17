import React, { useEffect } from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { Table, Switch, Tag, Form, Upload, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import DatePicker from "../../components/DatePicker/DatePicker";
import { Radio, notification } from "antd";
import Select from "../../components/Select/Select";
import Icon from "../../components/Icon/Icon";
import TitlePage from "../../components/TitlePage/Titlepage";
import { Popover } from "antd";
import TextArea from "../../components/TextArea/TextArea";
import styles from "../../styles/DetailCustomer.module.css";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import DefaultAvatar from "../../assets/big-default-avatar.svg";
import Image from "next/image";
import ModalUnblockCustomer from "./ModalAddCustomer/ModalUnblockCustomer";
import ModalUnreportCustomer from "./ModalAddCustomer/ModalUnreportCustomer";
import ModalAddress from "./ModalAddCustomer/ModalAdress";
import { get, isArray, isEmpty } from "lodash";
import { IUser } from "../../types/users";
import ModalConfirm from "../../components/Modal/ModalConfirm/ModalConfirm";
import { calcWithPoints, formatCustomer } from "../../utils/utils";
import { LevelCustomer, OrderEnumId } from "../../enums/enums";
import { format } from "date-fns";
import moment from "moment";
import classNames from "classnames";
import CustomerApi from "../../services/customers";
import { usersList } from "../../dummy-data/dummyData";
import CustomerTagApi from "../../services/customer-tags";
import ImageApi from "../../services/images";
import { OrderEnum } from "../../enums/enums";
import YellowStart from "../../../public/images/yellow-star.svg";
import TableEmpty from "../../components/TableEmpty";
import ReviewManagementApi from "../../services/reviews";

interface DataType {
  id?: string | number;
  img?: string;
  created_at: string;
  name?: string;
  status?: string;
  order_type?: number;
  order_status?: any;
  price?: number;
  href?: string;
  total_cost: number;
  order_id: string;
  [x: string]: any;
}

interface TagProps extends CustomTagProps {
  id?: string;
}

const TagRender = (props: TagProps) => {
  const { label, value, closable, onClose, id } = props;
  const [itemList, setItemList] = useState([{ id: "10", value: "Nhom 1" }]);
  const [name, setName] = useState<any>("");
  const onNameChange = (event: any) => {
    setName(event.target.value);
  };
  const handleAdd = (e: any) => {
    setItemList((current: any) => [
      ...current,
      { id: Math.floor(Math.random() * 10000000).toString(), value: value },
    ]);
  };
  const handleClear = () => {
    setName("");
  };
  // const handleDelete = (id: string) => {
  //   setItemList((prevItemList) =>
  //     prevItemList.filter((product) => product.id !== id)
  //   );
  // };
  const addInput = (e: any) => {
    handleAdd(e);
    handleClear();
  };

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const DetailsCustomer = (props) => {
  // const urlParams = new URLSearchParams(window.location.search);
  // const id = urlParams.get("id");
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];

  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
  });
  const [listSource, setListSource] = useState<
    {
      label: string;
      value: string | number;
      id: number | string;
    }[]
  >([]);
  const [listOrder, setListOrder] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>();
  const [listAddress, setListAddress] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [noteBad, setNoteBad] = useState("");
  const [isBad, setIsBad] = useState(false);
  const [isBlock, setIsBlock] = useState(false);

  const [loading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowAddress, setIsShowAddress] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isShowModalDeleteAddress, setIsShowModalDeleteAddress] =
    useState(false);
  const [isShowModalDeleteReview, setIsShowModalDeleteReview] = useState(false);
  const [isShowModalConfirmBlock, setIsShowModalConfirmBlock] = useState(false);
  const [isShowModalConfirmReport, setIsShowModalConfirmReport] =
    useState(false);
  const [isShowEditAddress, setIsShowEditAddress] = useState(false);
  const [idAddressSelect, setIdAddessSelected] = useState(-1);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>({});
  const [listTag, setListTag] = useState<any[]>([]);

  const [totalMoneyBuy, setTotalMoneyBuy] = useState(0);
  const [order, setOrder] = useState<any>({
    PRINTED: 0,
    SUCCESSRECEIVE: 0,
    RETURNAPARTIAL: 0,
    RETURN: 0,
  });
  const [widthProgress, setWidthProgress] = useState(0);
  const [avatar, setAvatar] = useState("");

  const [reviews, setReviews] = useState<any[]>([]);
  const [currenReviewId, setCurrenReviewId] = useState<any>(-1);
  const [paginationReview, setPaginationReview] = useState({
    current: 1,
    page: 1,
    total: 0,
    pageSize: 5,
  });
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
    getDetailCustomers();
    getListSource();
    getListAddress();
    getListOrder();
    getListTag();

    window.addEventListener("keydown", (e) => {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 123) {
        form.submit();
        e.preventDefault();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationReview.page,
    paginationReview.pageSize,
    paginationReview.current,
  ]);

  const getReview = async () => {
    setLoadingReview(true);
    const { data, totalReviews, totalPage } = await ReviewManagementApi.list({
      customer_id: id,
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
    setLoadingReview(false);
  };

  const getListSource = () => {
    const url = "/api/v2/customer-sources/list";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const result = res.data;
        const newListSource = isArray(result)
          ? result.map((item: IUser) => ({
              label: item.name,
              value: item.id,
              id: item.id,
            }))
          : [];
        setListSource(newListSource);
      })
      .catch((error) => console.log(error));
  };

  const getListTag = async () => {
    const data = await CustomerTagApi.list();
    if (data) {
      const rawListTag = isArray(data)
        ? data.map((item) => ({
            label: item.label,
            value: item.id,
            id: item.id,
          }))
        : [];
      setListTag(rawListTag);
    }
  };

  const getListAddress = () => {
    if (id) {
      const url =
        "/api/v2/customer-addresses/list?" +
        new URLSearchParams({
          customer_id: id,
        });
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const result = get(res, "data.data");
          const rawProvinces = get(res, "data.provinces").map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawDistricts = get(res, "data.districts").map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawWards = get(res, "data.wards").map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          const rawAddresses = get(res, "data.data").map((item) => {
            const itemProvince = rawProvinces.find(
              (province) => province.id == item.province_id
            );
            const itemDistrict = rawDistricts.find(
              (district) => district.id == item.district_id
            );
            const itemWard = rawWards.find((ward) => ward.id == item.ward_id);
            const fullAddress =
              item.address +
              ", " +
              itemWard.prefix +
              " " +
              itemWard.name +
              ", " +
              itemDistrict.prefix +
              " " +
              itemDistrict.name +
              " " +
              itemProvince.name;
            return {
              ...item,
              full_address: fullAddress,
            };
          });
          setListAddress(rawAddresses);
          setProvinces(rawProvinces);
          setDistricts(rawDistricts);
          setWards(rawWards);
        })
        .catch((error) => console.log(error));
    }
  };

  const getListOrder = () => {
    if (id) {
      const url =
        "/api/v2/orders/list?" +
        new URLSearchParams({
          customer_id: id,
        });
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const result = res.data;
          let rawTotalMoney = 0;
          let printed_order_number = 0;
          let received_order_number = 0;
          let refunded_order_number = 0;
          let partial_refund_order_number = 0;

          result.map((item: any) => {
            if (
              [OrderEnum.PICKUP_RECEIVED, OrderEnum.RETURN_PARTIAL].includes(
                item.order_status?.name_en
              )
            ) {
              rawTotalMoney = rawTotalMoney + parseInt(item.total_cost);
            }

            if (item.order_status?.name_en == OrderEnum.PRINT_OK) {
              printed_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.PICKUP_RECEIVED) {
              received_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.PICKUP_RETURNED) {
              refunded_order_number += 1;
            }
            if (item.order_status?.name_en == OrderEnum.RETURN_PARTIAL) {
              partial_refund_order_number += 1;
            }
          });
          setOrder({
            PRINTED: printed_order_number,
            SUCCESSRECEIVE: received_order_number,
            RETURNAPARTIAL: refunded_order_number,
            RETURN: partial_refund_order_number,
          });
          setTotalMoneyBuy(rawTotalMoney);
          setListOrder(result);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const getDetailCustomers = () => {
    const url = `/api/v2/customers/detail/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let result = formatCustomer(res.data);
        setCustomer(result);
        setAvatar(result.avatar);
        setIsBlock(result.is_block || false);
        setIsBad(result.is_bad || false);
        setNote(result.note);
        setNoteBad(result.note_bad);
        if (result.points && result.points > 0) {
          let rawWidth = calcWithPoints(result.points);
          setWidthProgress(rawWidth);
        }
        result.birthday = result.birthday
          ? moment(new Date(result.birthday))
          : null;

        console.log("result", result);
        form.setFieldsValue(result);
        if (!result?.source_id && result.is_in_app == true) {
          form.setFieldValue("source_id", 1);
        }
      })
      .catch((error) => console.log(error));
  };

  const renderLevel = (points: any) => {
    if (parseFloat(points) == 0) {
      return <div className="font-semibold text-[#0EA5E9]">KH mới</div>;
    } else if (parseFloat(points) <= 100) {
      return <div className="font-semibold text-[#F97316]">Đồng</div>;
    } else if (parseFloat(points) <= 500) {
      return <div className="font-semibold text-[#909098]">Bạc</div>;
    } else if (parseFloat(points) <= 1000) {
      return <div className="font-semibold text-[#EAB308]">Vàng</div>;
    } else if (parseFloat(points) <= 2000) {
      return <div className="font-semibold text-[#8B5CF6]">Kim cương</div>;
    } else if (parseFloat(points) > 2000) {
      return <div className="font-semibold text-[#5B6B95]">Bạch kim</div>;
    }
  };

  const renderOrderWarning = () => {
    const orders = listOrder.filter(
      (item) =>
        ![
          OrderEnum.PICKUP_RECEIVED,
          OrderEnum.RETURN_PARTIAL,
          OrderEnum.PICKUP_RETURNED,
          OrderEnum.CANCELLED,
          OrderEnum.DELETED,
        ].includes(item.order_status?.name_en)
    );

    if (orders.length > 0) {
      return (
        <div className="font-semibold text-red-500">
          Khách hàng này có {orders.length} đơn ở trạng thái chưa hoàn thành
        </div>
      );
    } else {
      return "";
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã đơn hàng",
      width: 150,
      key: "id",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <div className="cursor-pointer text-[#384ADC] font-medium text-medium">
          {record.order_id}
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      width: 190,
      dataIndex: "time",
      key: "time",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <div className="font-medium text-medium">
          <span>{format(new Date(record.created_at), "HH:mm")} - </span>
          <span>{format(new Date(record.created_at), "dd/MM/yyyy")}</span>
        </div>
      ),
    },
    // {
    //   title: "Sản phẩm",
    //   width: 246,
    //   dataIndex: "name",
    //   key: "name",
    //   align: "left",
    //   render: (_, record) => (
    //     <div className="font-medium text-medium">
    //       {
    //         // record.name
    //       }
    //     </div>
    //   ),
    // },
    {
      title: "Giá trị đơn hàng",
      width: 200,
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (_, record) => (
        <div className="font-medium text-medium">
          {record.total_cost ? record.total_cost.toLocaleString() : 0} đ
        </div>
      ),
    },
    {
      title: "Giỏ hàng",
      width: 110,
      dataIndex: "items",
      key: "items",
      align: "center",
      render: (_, record) => {
        const ContentItemSku = (
          <div className="td_items_skus">
            {isArray(record.order_item_skus) &&
              record.order_item_skus &&
              record.order_item_skus.map((orderItemSku, index) => {
                const inforItem = `${get(orderItemSku, "item_sku.item.name")} | 
                ${get(orderItemSku, "item_sku.sku_code")} x${get(
                  orderItemSku,
                  "quantity"
                )}`;
                return <p key={index}>{inforItem}</p>;
              })}
          </div>
        );
        return (
          <Popover
            className="flex flex-row items-start"
            placement="bottomLeft"
            content={ContentItemSku}
            trigger="hover"
          >
            <div>
              <span>{record?.order_item_skus?.length} sản phẩm</span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: "Kênh bán",
      width: 200,
      dataIndex: "channel",
      key: "channel",
      align: "center",
      render: (_, record) => (
        <div className="font-medium text-medium">
          {record?.order_status?.is_online ? "Online" : "Tại quầy"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: 160,
      dataIndex: "order",
      key: "order",
      align: "center",
      render: (_, record) => (
        <div className="text-[#8B5CF6] font-medium text-medium">
          {record.order_status?.name}
        </div>
      ),
    },
  ];

  const popeverActionAddress = (
    <div className="w-[148px] flex flex-col detail-customer">
      <div
        className="w-full flex justify-start mb-[8px] cursor-pointer"
        onClick={() => {
          setIsShowEditAddress(true);
          setIdAddessSelected(-1);
        }}
      >
        <Icon icon="edit-2" size={24} />
        <p className="text-medium font-medium ml-[5px]">Chỉnh sửa</p>
      </div>
      <div
        className="cursor-pointer w-full flex justify-start"
        onClick={() => {
          setIsShowModalDeleteAddress(true);
          setIdAddessSelected(-1);
        }}
      >
        <Icon icon="trash" size={24} />
        <p className="text-medium font-medium ml-[5px] text-[#EF4444]">
          Xóa địa chỉ
        </p>
      </div>
    </div>
  );

  const reviewColumns: ColumnsType<any> = [
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
      width: 210,
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
      title: "TRẠNG THÁI",
      width: 100,
      dataIndex: "description",
      key: "description",
      align: "left",
      render: (_, record: any) => (
        <div
          className="font-semibold text-[#384ADC] cursor-pointer"
          onClick={() => {
            console.log("record", record);
          }}
        >
          {record.is_show == 0 ? "Hiện" : "Ẩn"}
        </div>
      ),
    },
    {
      title: "THAO TÁC",
      width: 170,
      dataIndex: "action",
      key: "action",
      align: "left",
      render: (_, record) => (
        <div
          className="cursor-pointer w-full flex justify-start"
          onClick={() => {
            setIsShowModalDeleteReview(true);
            setCurrenReviewId(record.id);
          }}
        >
          <Icon icon="trash" size={24} />
          <p className="text-medium font-medium ml-[5px] text-[#EF4444]">Xóa</p>
        </div>
      ),
    },
  ];

  const deleteReview = async () => {
    setIsShowModalDeleteReview(false);
    setLoadingReview(true);
    const data = await ReviewManagementApi.deleteReview(currenReviewId);
    if (data) {
      notification.success({
        message: "Xoá đánh giá thành công!",
      });
      const newReviews = reviews.filter(
        (review) => review.id != currenReviewId
      );
      setReviews(newReviews);
    } else {
      notification.success({
        message: "Xoá đánh giá thất bại!",
      });
    }
    setLoadingReview(false);
    setCurrenReviewId(-1);
  };

  const handleSubmit = (data: any) => {
    const url = `/api/v2/customers/update/${id}`;
    const body = {
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      birthday: data.birthday,
      sex: data.sex,
      source_id: data.source_id,
      customer_tags: data.customer_tags,
      avatar: avatar,
    };

    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log("data return", data);
        if (data.success) {
          notification.success({
            message: "Cập nhật khách hàng thành công!",
          });
        } else {
          notification.error({
            message: data.message,
          });
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteCustomer = () => {
    console.log("delete");
    const url = `/api/v2/customers/delete/${id}`;
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log("data return", data);
        if (data.success) {
          notification.success({
            message: "Xóa thành công!",
          });
          window.location.href = "/customer/customer-list";
        } else {
          notification.error({
            message: data.message,
          });
          console.log("error");
        }
      });
    // setIsShowModalNotice(true);
  };

  const handleBlockUser = (checked, event) => {
    console.log(
      "🚀 ~ file: DetailCustomer.tsx:536 ~ handleBlockUser ~ checked",
      checked
    );
    if (!checked) {
      if (isBad) {
        message.error("Bạn phải bỏ báo xấu trước khi bỏ chặn!");
        return null;
      }
    }
    setIsShowModalConfirmBlock(true);
  };

  const handleReportUser = (checked, event) => {
    setIsShowModalConfirmReport(true);
  };

  const handleBlock = () => {
    const url = `/api/v2/customers/update/${id}`;
    const body = {
      is_block: !isBlock ? 1 : 0,
      note: note,
    };

    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log("data return", data);
        setIsBlock(!isBlock);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsShowModalConfirmBlock(false);
  };

  const handleReport = () => {
    const url = `/api/v2/customers/update/${id}`;
    let body: any = {
      is_bad: !isBad,
      note_bad: noteBad,
    };
    if (!isBad == true) {
      setIsBlock(true);
      body = {
        ...body,
        is_block: 1,
      };
    }

    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log("data return", data);
        setIsBad(!isBad);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsShowModalConfirmReport(false);
  };

  const createCustomerAddress = async (data: any) => {
    const response = await CustomerApi.createAddress({
      ...data,
      customer_id: id,
      is_default: false,
    });
    if (response) {
      const itemProvince = provinces.find(
        (province) => province.id == data.province_id
      );
      const itemDistrict = districts.find(
        (district) => district.id == data.district_id
      );
      const itemWard = wards.find((ward) => ward.id == data.ward_id);
      const fullAddress =
        data.address +
        ", " +
        itemWard.prefix +
        " " +
        itemWard.name +
        ", " +
        itemDistrict.prefix +
        " " +
        itemDistrict.name +
        " " +
        itemProvince.name;
      setListAddress(
        listAddress.concat({
          ...data,
          id: response.id,
          full_address: fullAddress,
        })
      );
    }
  };

  const deleteCustomerAddress = async () => {
    const result = await CustomerApi.deleteAddress(selectedAddress.id);
    if (result) {
      const newListAddress = listAddress.filter(
        (item) => item.id != selectedAddress.id
      );
      setListAddress(newListAddress);
      setSelectedAddress({});
      setIsShowModalDeleteAddress(false);
      notification.success({
        message: "Xóa địa chỉ thành công !",
      });
    }
  };

  const updateAddress = async (data) => {
    const result = await CustomerApi.updateAddress(selectedAddress.id, data);
    if (result) {
      let newListAddress = listAddress;
      const indexSelected = listAddress.findIndex(
        (item) => item.id === selectedAddress.id
      );
      const itemProvince = provinces.find(
        (province) => province.id == data.province_id
      );
      const itemDistrict = districts.find(
        (district) => district.id == data.district_id
      );
      const itemWard = wards.find((ward) => ward.id == data.ward_id);
      const fullAddress =
        data.address +
        ", " +
        itemWard.prefix +
        " " +
        itemWard.name +
        ", " +
        itemDistrict.prefix +
        " " +
        itemDistrict.name +
        " " +
        itemProvince.name;
      newListAddress[indexSelected] = {
        ...data,
        id: selectedAddress.id,
        full_address: fullAddress,
      };
      setListAddress(newListAddress);
      setSelectedAddress({});
      setIsShowEditAddress(false);
      notification.success({
        message: "Cập nhật địa chỉ thành công!",
      });
    }
  };

  const handleUploadImage = async (options) => {
    const { file } = options;

    try {
      const data = await ImageApi.upload(file);
      setAvatar(data.url);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full">
      <div className="flex justify-between items-center mb-[32px]">
        <TitlePage href="/customer/customer-list" title="Khách hàng" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="danger-outlined"
            width={113}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => {
              setIsShowModalConfirm(true);
            }}
          >
            Xóa KH
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            variant="secondary"
            width={187}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between gap-[12px]">
          <div className="flex flex-col flex-1">
            <div
              className={styles.table}
              style={{ marginBottom: 0, height: "100%" }}
            >
              <div className={styles.row}>
                <div className={styles.row_label}>Ảnh đại diện</div>
                <div className="flex flex-1">
                  <Upload
                    customRequest={handleUploadImage}
                    listType="picture-card"
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      if (file.type.startsWith("image")) {
                        return true;
                      }

                      return false;
                    }}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{
                          width: 75,
                          height: 75,
                          borderRadius: 100,
                        }}
                      />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </Upload>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>
                  Họ và tên <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Họ và tên là bắt buộc!",
                    },
                  ]}
                >
                  <Input width="100%" />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>
                  Số điện thoại <span className="text-[#EF4444]">*</span>
                </div>
                <Form.Item
                  className="flex flex-1"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại là bắt buộc!",
                    },
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input type="phone-number" width="100%" />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Giới tính</div>
                <div className="flex flex-1">
                  <div style={{ width: 296 }}>
                    <Form.Item name="sex">
                      <Radio.Group>
                        <div className="mr-[95px]">
                          <Radio value="Male">Nam</Radio>
                        </div>
                        <Radio value="Female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Sinh nhật</div>
                <Form.Item className="flex flex-1" name="birthday">
                  <DatePicker width="100%" placeholder="Ngày/tháng/năm" />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Email</div>
                <Form.Item
                  className="flex flex-1"
                  name="email"
                  rules={[
                    {
                      pattern: new RegExp(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      ),
                      message: "Địa chỉ email không hợp lệ",
                    },
                  ]}
                >
                  <Input type="email" width="100%" placeholder="Nhập email" />
                </Form.Item>
              </div>
              <div className={styles.row}>
                <div className={styles.row_label}>Chọn nguồn</div>
                <Form.Item className="flex flex-1" name="source_id">
                  <Select
                    placeholder="Chọn nguồn"
                    style={{ width: "100%" }}
                    options={listSource}
                  />
                </Form.Item>
              </div>
              <div className={classNames(styles.row, "mt-[24px]")}>
                <div className={styles.row_label}>Người tạo</div>
                <div className="flex flex-1 flex-row">
                  <div className="text-medium font-medium max-w-max mr-[5px]  ">
                    {get(customer, "create_user.name")}
                  </div>
                  <div className="text-medium font-normal">
                    {get(customer, "created_at") && (
                      <div>
                        {format(
                          new Date(get(customer, "created_at")),
                          "dd/MM/yyyy"
                        )}
                        -
                        <span>
                          {format(
                            new Date(
                              get(customer, "created_at") ||
                                get(customer, "user.created_at")
                            ),
                            "HH:mm"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div
                  className={classNames(
                    "text-[#4B4B59] font-semibold mb-[6px]",
                    styles.row_label
                  )}
                >
                  <span className="ml-[8px]">Thẻ</span>
                </div>
                <Form.Item className="flex flex-1" name="customer_tags">
                  <Select
                    options={listTag}
                    placeholder="Chọn loại khách hàng"
                    mode="multiple"
                    style={{ width: "100%" }}
                    // tokenSeparators={[","]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className={styles.table}>
              <div
                className="flex items-center justify-between pt-[17px] mb-[12px] mb-[31px]"
                style={{ width: "85%" }}
              >
                <div className="text-medium font-medium">Cấp độ khách hàng</div>
                <div className="text-medium font-semibold max-w-max text-[#EAB308]">
                  {renderLevel(get(customer, "points"))}
                </div>
                <div className="text-medium font-semibold">
                  ({get(customer, "points")} điểm)
                </div>
              </div>
              <div className="mb-[21px]" style={{ height: 41 }}>
                <div className={styles.point_level}>
                  <div
                    className={styles.bg_point}
                    style={{
                      width: `${widthProgress}%`,
                    }}
                  />
                  <div
                    className={classNames(
                      "font-semibold text-[#0EA5E9]",
                      styles.new_level
                    )}
                  >
                    KH mới
                  </div>
                  <div
                    className={classNames(
                      "font-semibold text-[#F97316]",
                      styles.brozen_level
                    )}
                  >
                    Đồng
                  </div>
                  <div
                    className={classNames(
                      "font-semibold text-[#909098]",
                      styles.silver_level
                    )}
                  >
                    Bạc
                  </div>
                  <div
                    className={classNames(
                      "font-semibold text-[#EAB308]",
                      styles.gold_level
                    )}
                  >
                    Vàng
                  </div>
                  <div
                    className={classNames(
                      "font-semibold text-[#8B5CF6]",
                      styles.diomand_level
                    )}
                  >
                    Kim cương
                  </div>
                  <div
                    className={classNames(
                      "font-semibold text-[#5B6B95]",
                      styles.platinum_level
                    )}
                  >
                    Bạch kim
                  </div>
                  <div
                    className={classNames(
                      styles.new_level,
                      styles.dots,
                      styles.new_level,
                      get(customer, "points")
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.brozen_level,
                      styles.dots,
                      get(customer, "points") > 0
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.silver_level,
                      styles.dots,
                      get(customer, "points") > 100
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.gold_level,
                      styles.dots,
                      get(customer, "points") > 500
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.diomand_level,
                      styles.dots,
                      get(customer, "points") > 1000
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                  <div
                    className={classNames(
                      styles.platinum_level,
                      styles.dots,
                      get(customer, "points") > 2000
                        ? styles.active
                        : styles.none_active
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center mb-[12px] mb-[31px]">
                <div className={styles.row_left_table}>
                  Tổng tiền hàng đã mua
                </div>
                <div className={styles.row_left}>
                  {totalMoneyBuy.toLocaleString()} đ
                </div>
              </div>
              <div className="flex flex-row mb-[25px]">
                <div className={styles.order_printed} />
                <div className={styles.order_receive} />
                <div className={styles.order_return} />
                <div className={styles.order_return_part} />
              </div>
              <div className="flex flex-row justify-between mb-[20px]">
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, "bg-[#6366F1]")} />
                  <div>
                    Đã in{" "}
                    <span className="text-[#6366F1] font-semibold">
                      {" "}
                      {order.PRINTED}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, "bg-[#10B981]")} />
                  <div>
                    Đã nhận{" "}
                    <span className="text-[#10B981] font-semibold">
                      {" "}
                      {order.SUCCESSRECEIVE}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, "bg-[#F97316]")} />
                  <div>
                    Đã hoàn{" "}
                    <span className="text-[#F97316] font-semibold">
                      {" "}
                      {order.RETURNAPARTIAL}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <div className={classNames(styles.block, "bg-[#EAB308]")} />
                  <div>
                    Hoàn 1 phần{" "}
                    <span className="text-[#EAB308] font-semibold">
                      {" "}
                      {order.RETURN}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-[12px] mb-[31px]">
                <div className={styles.row_left_table}>Tổng số đơn hàng</div>
                <div className={styles.row_left}>{listOrder.length}</div>
              </div>
              <div className="flex flex-row justify-start">
                <div className={styles.row_left_table}>Tiền nợ khách</div>
                <div className="w-1/2">
                  <div className="font-semibold">
                    0 đ{" "}
                    <span
                      className="ml-[8px] cursor-pointer text-medium font-medium text-[#384ADC]"
                      onClick={() =>
                        (window.location.href = "/debts/Modall/ModalDebtDetail")
                      }
                    >
                      Xem chi tiết
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(styles.table, "flex flex-row gap-[12px]")}
            >
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-[12px]">
                  <div
                    className="text-medium font-medium "
                    style={{ width: "80%", maxWidth: 243, height: 30 }}
                  >
                    {!isBlock ? (
                      <span>Chặn khách hàng này?</span>
                    ) : (
                      <div className="rounded-[4px] bg-[#EF4444] h-[30px] text-[#FFF] flex flex-1 justify-center items-center font-medium text-medium">
                        <Icon icon="danger-1" size={16} className="mr-[5px]" />
                        Khách hàng bị chặn online
                      </div>
                    )}
                  </div>
                  <Switch
                    className="button-switch"
                    checked={isBlock}
                    onChange={(checked, event) =>
                      handleBlockUser(checked, event)
                    }
                  />
                </div>
                <TextArea
                  rows={4}
                  value={note}
                  onChange={(e: any) => setNote(e.target.value)}
                >
                  Nhập ghi chú
                </TextArea>
              </div>
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-[12px]">
                  <div
                    className="text-medium font-medium"
                    style={{ height: 30, width: "70%", maxWidth: 170 }}
                  >
                    {!isBad ? (
                      <span>Báo xấu khách hàng này?</span>
                    ) : (
                      <div className="rounded-[4px] bg-[#8B5CF6] h-[30px] text-[#FFF] flex justify-center items-center font-medium text-medium">
                        Khách hàng xấu
                      </div>
                    )}
                  </div>
                  <Switch
                    className="button-switch"
                    checked={isBad}
                    onChange={(checked, event) =>
                      handleReportUser(checked, event)
                    }
                  />
                </div>
                <TextArea
                  rows={4}
                  value={noteBad}
                  onChange={(e: any) => setNoteBad(e.target.value)}
                >
                  Nhập ghi chú
                </TextArea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-[12px]">
          <div style={{ width: 500 }}>
            <div className={styles.table}>
              <div className="flex justify-between w-full">
                <p className="text-medium font-medium mb-[12px]">
                  Địa chỉ nhận hàng
                </p>
                <p
                  className="text-medium font-medium text-[#384ADC] cursor-pointer"
                  onClick={() => {
                    setIsEdit(false);
                    setIsShowAddress(true);
                  }}
                >
                  Thêm mới
                </p>
              </div>

              {isArray(listAddress) &&
                listAddress.map((item, index) => (
                  <div className={styles.address} key={index}>
                    <div className="flex w-full justify-between">
                      <div className="flex gap-[12px]">
                        <div className="text-medium font-medium">
                          {item.full_name}
                        </div>
                        <div>|</div>
                        <div className="text-medium font-medium">
                          {item.phone_number}
                        </div>
                      </div>
                      <div>
                        <Popover
                          placement="bottomLeft"
                          content={popeverActionAddress}
                          className="detail-customer"
                          trigger="click"
                          overlayStyle={{
                            width: "160px",
                            padding: "0px",
                          }}
                          open={idAddressSelect == item.id}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                            }}
                            className="flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              setIsEdit(true);
                              setSelectedAddress(item);
                              setIdAddessSelected(
                                idAddressSelect == item.id ? -1 : item.id
                              );
                            }}
                          >
                            <Icon icon="toolbar" color="black" size={24} />
                          </div>
                        </Popover>
                      </div>
                    </div>
                    <div>{item.full_address}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-1">
            <Table
              columns={columns}
              dataSource={[...listOrder]}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10],
              }}
              loading={loading}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (record.order_type === 1) {
                      window.open(
                        `/order-management/edit/order-online/${record.id}`,
                        "_blank"
                      );
                    } else if (record.order_type === 2) {
                      window.open(
                        `/order-management/edit/order-offline/${record.id}`,
                        "_blank"
                      );
                    } else if (record.order_type === 3) {
                      window.open(
                        `/order-management/edit/order-in-app/${record.id}`,
                        "_blank"
                      );
                    }
                  },
                };
              }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-[12px]">
          <div className={styles.table}>
            <Table
              loading={loadingReview}
              columns={reviewColumns}
              dataSource={[...reviews]}
              locale={
                !loadingReview
                  ? {
                      emptyText: <TableEmpty />,
                    }
                  : { emptyText: <></> }
              }
              scroll={{ x: 50 }}
              pagination={{
                current: paginationReview.current,
                total: paginationReview.total,
                defaultPageSize: paginationReview.pageSize,
                showSizeChanger: true,
                pageSizeOptions: [5, 10],
              }}
              onChange={(e) => {
                setPaginationReview({
                  ...pagination,
                  current: e.current || 1,
                  page: e.current || 1,
                  pageSize: e.pageSize || 5,
                });
              }}
            />
          </div>
        </div>
      </div>
      <ModalAddress
        provinces={provinces}
        districts={districts}
        wards={wards}
        title="Địa chỉ nhận hàng"
        isEdit={isEdit}
        isVisible={isShowAddress}
        onClose={() => setIsShowAddress(false)}
        onOpen={(data) => {
          createCustomerAddress(data);
          setIsShowAddress(false);
        }}
      />
      {/* Modal update Address */}
      <ModalAddress
        provinces={provinces}
        districts={districts}
        wards={wards}
        title="Địa chỉ nhận hàng"
        isEdit={isEdit}
        data={selectedAddress}
        isVisible={isShowEditAddress}
        onClose={() => setIsShowEditAddress(false)}
        onOpen={(data) => {
          updateAddress(data);
          setIsShowEditAddress(false);
        }}
      />
      {/* Modal delete customer */}
      <ModalConfirm
        titleBody="Xóa thông tin khách hàng?"
        content={
          <div className="text-center">
            Mọi dữ liệu của khách hàng này <br />
            sẽ bị xoá khỏi hệ thống.
            <br />
            {renderOrderWarning()}
          </div>
        }
        onOpen={handleDeleteCustomer}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
      {/* Modal delete address customer */}
      <ModalConfirm
        titleBody="Xóa địa chỉ khách hàng?"
        onOpen={deleteCustomerAddress}
        onClose={() => setIsShowModalDeleteAddress(false)}
        isVisible={isShowModalDeleteAddress}
      />
      <ModalConfirm
        titleBody="Xóa đánh giá khách hàng?"
        onOpen={deleteReview}
        onClose={() => setIsShowModalDeleteReview(false)}
        isVisible={isShowModalDeleteReview}
      />
      <ModalConfirm
        titleConfirm={isBlock ? "Bỏ chặn" : "Chặn"}
        titleBody={isBlock ? "Bỏ chặn khách hàng?" : "Chặn khách hàng?"}
        content={
          <div>
            <div className="text-center mb-[12px]">
              Bạn có chắc chắn muốn {isBlock ? "bỏ chặn" : "chặn"} khách hàng
              này không?
            </div>
            <TextArea
              rows={4}
              onChange={(e: any) => setNote(e.target.value)}
              value={note}
            >
              Nhập ghi chú
            </TextArea>
          </div>
        }
        onOpen={() => handleBlock()}
        onClose={() => setIsShowModalConfirmBlock(false)}
        isVisible={isShowModalConfirmBlock}
      />
      <ModalConfirm
        titleConfirm={isBad ? "Bỏ báo xấu" : "Báo xấu"}
        titleBody={isBad ? "Bỏ báo xấu khách hàng?" : "Báo xấu khách hàng?"}
        content={
          <div>
            <div className="text-center mb-[12px]">
              Bạn có chắc chắn muốn {isBad ? "bỏ báo xấu" : "báo xấu"} khách
              hàng này không?
            </div>
            <TextArea
              rows={4}
              onChange={(e: any) => setNoteBad(e.target.value)}
              value={noteBad}
            >
              Nhập ghi chú
            </TextArea>
          </div>
        }
        onOpen={() => handleReport()}
        onClose={() => setIsShowModalConfirmReport(false)}
        isVisible={isShowModalConfirmReport}
      />
    </Form>
  );
};

ReactDOM.render(<DetailsCustomer />, document.getElementById("root"));
