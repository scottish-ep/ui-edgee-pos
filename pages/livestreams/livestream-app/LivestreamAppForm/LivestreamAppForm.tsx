/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../../../components/Button/Button";
import Icon from "../../../../components/Icon/Icon";
import Input from "../../../../components/Input/Input";
import Select from "../../../../components/Select/Select";
import TitlePage from "../../../../components/TitlePage/Titlepage";
import { filterCommentList } from "../../../../const/constant";
import {
  IComment,
  ILivestreamAppDetail,
  ILivestreamProduct,
} from "../livestream-app.type";
import CommentTable from "./CommentTable";
import ProductTable from "./ProductTable";
import { Form, message, notification } from "antd";
import LivestreamApi from "../../../../services/livestream";
import { LivestreamStatusEnum } from "../../../../enums/enums";
import ModalConfirm from "../../../../components/Modal/ModalConfirm/ModalConfirm";
import ModalRemove from "../../../../components/ModalRemove/ModalRemove";

interface LivestreamAppFormProps {
  detail?: ILivestreamAppDetail | null;
}
const LivestreamAppForm: React.FC<LivestreamAppFormProps> = ({ detail }) => {
  const [isInfo, setIsInfo] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  // const selectedUser = window.loggedInUser;
  let selectedUser = '';
  useRef(() => {
    selectedUser = window.loggedInUser;
  });
  const [productList, setProductList] = useState<ILivestreamProduct[]>([]);
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [form] = Form.useForm();
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isFilterComment, setIsFilterComment] = useState(false);

  let pathNameArr: any = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];

  useEffect(() => {
    const element = document.getElementById("loading__animation");
    if (element) {
      element.remove();
    }
  }, []);

  useEffect(() => {
    if (detail) {
      setLoading(true);

      const newProductList: ILivestreamProduct[] = detail.items.map(
        (v: any) => {
          return {
            id: v.item_sku_id,
            item_id: v.item_id,
            code: v.item_sku.sku_code,
            name: `${v.item_sku.sku_code} ${v.item.name}`,
            item_category: v.item.item_category,
            price: v.item_sku.price,
            discount_price: v.discount_price,
          };
        }
      );

      setProductList([...newProductList]);
      setLoading(false);
      if (detail.comments_latest) {
        const newCommentList: IComment[] = detail.comments_latest.map(
          (value) => ({
            id: value.id,
            comment: value.comment,
            created_at: value.created_at,
            network_provider: value.network_provider,
            updated_at: value.updated_at,
            user: {
              id: value.user?.id,
              name: value.user?.name,
              phone: value.user?.phone,
              customer: {
                id: value.user?.customer?.id,
                name: value.user?.customer?.name,
              },
            },
          })
        );
        setCommentList(newCommentList);
      }
      form.setFieldsValue(detail);
    }
  }, [detail]);

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      console.log("User pressed: ", event.key);
      if (event.key === "F12") {
        event.preventDefault();
        if (detail?.status !== "Ho??n t???t") {
          handleSaveLivestream();
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  const handleSaveLivestream = () => {
    setLoading(true);
    const formValue = form.getFieldsValue();

    // if (!productList.length) {
    //   window.alert("Danh s??ch s???n ph???m ??ang tr???ng");
    // }
    form
      .validateFields()
      .then(async () => {
        const params = {
          ...formValue,
          user_id: selectedUser,
          status: detail ? detail.status : LivestreamStatusEnum.CREATED,
          productList: productList.map((v: any) => ({
            id: v.id,
            item_id: v.item_id,
            discount_price: v.discount_price,
          })),
        };
        let response: any = null;
        if (detail) {
          delete params.status;
          response = await LivestreamApi.updateLivestream(detail.id, params);
        } else {
          response = await LivestreamApi.createLivestream(params);
        }
        setLoading(false);
        const { data } = response;
        console.log(response);
        if (data) {
          message.success("L??u th??nh c??ng");
          window.location.href = `/livestream/app/live/${
            data.id || detail?.id
          }`;
        } else {
          notification.error({
            message: "C?? l???i x???y ra !",
            description: "Kh??ng th??? l??u th??ng tin livestream",
            placement: "top",
          });
          console.log("SAVE LIVESTREAM", data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleStartStatusLivestream = async () => {
    if (detail) {
      setLoading(true);
      const formValue = form.getFieldsValue();
      form
        .validateFields()
        .then(async () => {
          if (productList.length !== detail.items.length) {
            setLoading(false);
            window.alert("Vui l??ng nh???n L??u");
          } else {
            const params = {
              ...formValue,
              status: LivestreamStatusEnum.PROCESSING,
              started_at: new Date(),
              // productList: productList.map((v: any) => ({
              //   id: v.id,
              //   item_id: v.item_id,
              //   discount_price: v.discount_price,
              // })),
            };
            const { data } = await LivestreamApi.startLivestream(
              detail.id,
              params
            );
            setLoading(false);
            if (data) {
              window.location.href = `/livestream/streaming/${id}`;
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      window.alertDanger("Kh??ng t??m th???y livestream");
    }
  };

  const handleExportLiveStreamCommentExcel = () => {
    console.log("START EXPORTING");
    setLoading(true);
    if (detail) {
      if (detail.comments_latest.length) {
        notification.success({
          message: "Th??nh c??ng",
          description: "Xu???t b??nh lu???n th??nh c??ng, xem file t???i v???",
          placement: "top",
          icon: <Icon icon={"checked-approved"} size={24} />,
        });
        window.location.href =
          "/api/v2/livestreams/export/" + detail.id + "/comments";
      } else {
        notification.error({
          message: "C?? l???i x???y ra",
          description: "Livestream ch??a c?? b??nh lu???n n??o",
          placement: "top",
        });
      }
      console.log("DATA EXPORTED");
    } else {
      notification.error({
        message: "C?? l???i x???y ra",
        description: "Kh??ng th??? xu???t file b??nh lu???t",
        placement: "top",
      });
      console.log("EXPORT ERROR");
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    const { data } = await LivestreamApi.deleteItem(detail?.id);
    if (data) {
      message.success("X??a th??nh c??ng");
      window.location.href = "/livestream/app";
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5 flex-wrap gap-2">
        <TitlePage
          href="/livestream/app"
          title={detail ? "Chi ti???t livestream" : "T???o livestream"}
          description="B??n h??ng Livestream / Livestream tr??n App"
        />
        <div className="flex gap-2 flex-wrap">
          {detail && (
            <Button
              variant="danger-outlined"
              width={153}
              icon={<Icon icon="trash" size={24} color="#EF4444" />}
              onClick={() => setIsShowModalConfirm(true)}
            >
              X??a
            </Button>
          )}
          {detail?.status !== "Ho??n t???t" && (
            <Button
              variant="secondary"
              width={166}
              style={{ fontWeight: "bold" }}
              onClick={handleSaveLivestream}
            >
              L??u (F12)
            </Button>
          )}

          {detail && detail?.status !== "Ho??n t???t" && (
            <Button
              variant="primary"
              width={229}
              style={{ fontWeight: "bold" }}
              onClick={handleStartStatusLivestream}
            >
              B???t ?????u Livestream
            </Button>
          )}

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
              H??? tr???
            </a>
          </Button>
        </div>
      </div>

      {detail && (
        <div className="flex justify-between mb-3 items-center gap-[50px]">
          <div className="flex flex-wrap gap-x-9 h-max">
            <span
              className={classNames(
                "text-medium font-semibold text-[#909098] cursor-pointer",
                {
                  "border-b-2 border-b-[#FF970D] text-[#FF970D]": isInfo,
                }
              )}
              onClick={() => setIsInfo(true)}
            >
              Th??ng tin
            </span>
            <span
              className={classNames(
                "text-medium font-semibold text-[#909098] cursor-pointer",
                {
                  "border-b-2 border-b-[#FF970D] text-[#FF970D]": !isInfo,
                }
              )}
              onClick={() => setIsInfo(false)}
            >
              T???t c??? b??nh lu???n ({commentList.length})
            </span>
          </div>

          {!isInfo && (
            <div className="flex gap-x-2">
              <div className="flex items-center">
                <div className="font-medium mr-[12px] text-medium">
                  L???c theo:
                </div>
                <Select
                  defaultValue=""
                  style={{ width: 220 }}
                  options={filterCommentList}
                  onChange={(e) => {
                    console.log("e", e);
                    setIsFilterComment(e === "phone" ? true : false);
                  }}
                />
              </div>
              <Button
                variant="outlined"
                width={113}
                icon={<Icon icon="export" size={24} />}
                onClick={handleExportLiveStreamCommentExcel}
              >
                Xu???t file
              </Button>
            </div>
          )}
        </div>
      )}

      {isInfo ? (
        <React.Fragment>
          <Form
            form={form}
            className="flex flex-col gap-y-3 bg-white rounded px-3 py-4"
          >
            <div className="text-medium font-medium text-[#1D1C2D]">
              T??n livestream
            </div>
            <Form.Item
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "T??n Livestream l?? b???t bu???c!",
                },
              ]}
            >
              <Input
                disabled={detail?.status === "Ho??n t???t"}
                placeholder={"-Nh???p-"}
                required={true}
                name={"name"}
              />
            </Form.Item>
          </Form>
          <ProductTable
            detail={detail}
            productList={productList}
            setProductList={setProductList}
            disabled={detail?.status === "Ho??n t???t"}
          />
        </React.Fragment>
      ) : (
        <CommentTable
          isFilterComment={isFilterComment}
          commentList={commentList}
        />
      )}

      <ModalRemove
        isVisible={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onOpen={() => setIsShowModalConfirm(true)}
        titleBody="X??a livestream n??y?"
        content="Th??ng tin c???a livestream s??? xo?? kh???i h??? th???ng"
        onOk={handleRemove}
      />
    </div>
  );
};

export default LivestreamAppForm;
