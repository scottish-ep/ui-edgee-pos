/* eslint-disable react-hooks/exhaustive-deps */
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import Modal from "../../../components/Modal/Modal/Modal";
import { message, Radio } from "antd";
import DatePicker from "../../../components/DatePicker/DatePicker";
import Icon from "../../../components/Icon/Icon";
import Upload from "../../../components/Upload/Upload";
import ImageApi from "../../../services/images";
import { IRevenueExpenditure } from "../listdebt.type";
import RevenueExpenditureApi from "../../../services/revenue-expenditure";
import { uuid } from "uuidv4";
import { IOption } from "../../../types/permission";
import { format } from "date-fns";
import moment from "moment";
import Api from "../../../services";
import DebtApi from "../../../services/debt";

interface ModalPayDetailProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  itemSelected?: IRevenueExpenditure | null;
  onReload?: (uuid: string) => void;
  warehouses?: Array<IOption>;
  userSelected?: any;
}

const ModalPayDetail = (props: ModalPayDetailProps) => {
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    itemSelected,
    onReload,
    userSelected,
    warehouses = [],
  } = props;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [createdById, setCreatedById] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [money, setMoney] = useState<string | number>("");
  const [paymentType, setPaymentType] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<Array<string>>([]);
  const [status, setStatus] = useState("Chờ duyệt");
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileTemp, setFileTemp] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IOption>>([]);

  useEffect(() => {
    if (itemSelected) {
      console.log(
        "🚀 ~ file: ModalPayDetail.tsx:67 ~ useEffect ~ itemSelected",
        itemSelected
      );

      setName(itemSelected?.name || "");
      setCode(itemSelected?.code || "");
      setType(itemSelected?.type || "");
      setCreatedById(itemSelected?.created_by_id || "");
      setWarehouseId(itemSelected?.warehouse_id || "");
      setCustomerName(itemSelected?.customer_name || "");
      setCustomerPhone(itemSelected?.customer_phone || "");
      setMoney(itemSelected?.money || 0);
      setPaymentType(itemSelected?.payment_type || "");
      setNote(itemSelected?.note || "");
      setImages(itemSelected?.images || []);
      setStatus(itemSelected?.status || "");

      let arr: Array<{
        uid: number | string;
        url: string;
      }> = [];
      itemSelected?.images?.map((item, index) => {
        arr.push({
          uid: index,
          url: item,
        });
      });

      setFileList(arr);
    }
  }, [itemSelected]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const { data } = await DebtApi.getUsers();
    if (data) {
      let arr: Array<IOption> = [];
      data?.map((item) => {
        arr.push({
          label: item?.name,
          value: item?.id,
        });
      });
      setUsers(arr);
    }
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setType("");
    setCreatedById("");
    setWarehouseId("");
    setCustomerName("");
    setCustomerPhone("");
    setMoney("");
    setPaymentType("");
    setNote("");
    setImages([]);
    setStatus("");
    setFileList([]);
  };

  const handleChangeImage = async (e) => {
    setFileList(
      fileList.filter((v: any) => !v.status || v.status !== "removed")
    );
  };

  useEffect(() => {
    if (fileTemp) {
      setFileList([...fileList, { url: fileTemp }]);
      setImages([...images, fileTemp]);
    }
    console.log(
      "🚀 ~ file: ModalAddDebt.tsx:237 ~ useEffect ~ fileList",
      fileList
    );
  }, [fileTemp]);

  const handleUploadImage = async (options: any) => {
    console.log(
      "🚀 ~ file: ModalAddDebt.tsx:178 ~ handleUploadImage ~ options",
      options
    );
    const { onSuccess, onError, file, onProgress } = options;
    try {
      const data = await ImageApi.upload(file);
      setFileTemp(data.url);
    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const onSubmit = async (submitType: string) => {
    let obj = {
      name,
      code,
      type,
      created_by_id: userSelected,
      warehouse_id: warehouseId,
      customer_name: customerName,
      customer_phone: customerPhone,
      money,
      payment_type: paymentType,
      note,
      images,
      status,
    };

    if (!name) {
      message.error("Vui lòng nhập tên giao dịch!");
      return;
    }

    if (!type) {
      message.error("Vui lòng chọn loại giao dịch!");
      return;
    }

    if (!warehouseId) {
      message.error("Vui lòng chọn kho!");
      return;
    }

    if (!money) {
      message.error("Vui lòng nhập số tiền!");
      return;
    }

    if (type === "expenditure" && status === "Đã nhận") {
      message.error("Phiếu chi không được chọn trạng thái đã nhân!");
      setStatus("Đã chi");
      return;
    }
    if (type === "revenue" && status === "Đã chi") {
      message.error("Phiếu thu không được chọn trạng thái đã chi!");
      setStatus("Đã nhận");
      return;
    }

    setLoading(true);
    setDisabledBtn(true);
    if (submitType === "add") {
      const { data } = await RevenueExpenditureApi.add(obj);
      if (data) {
        message.success("Thêm thành công");
      }
    } else {
      const { data } = await RevenueExpenditureApi.update(
        itemSelected?.id,
        obj
      );
      if (data) {
        message.success("Cập nhật thành công");
      }
    }

    setLoading(false);
    setDisabledBtn(false);
    onClose?.();
    onReload?.(uuid());
    resetForm();
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={() => {
        onClose?.();
        resetForm();
      }}
      onOpen={onOpen}
      iconClose={iconClose}
      width={658}
      footer={false}
      className="p-[16px] modal-pay-detail"
    >
      <div>
        <div className="w-full">
          <div className="w-full flex flex-col p-[12px] bg-white rounded-lg">
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Tên Giao dịch
              </p>
              <Input
                className="flex-1"
                placeholder="Nhập tên"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Mã giao dịch
              </p>
              <div className="flex-1 flex">{code || "--"}</div>
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Loại hoá đơn
              </p>
              <Radio.Group className="flex-1" value={type}>
                <div className="mr-[95px]">
                  <Radio value="revenue" onClick={() => setType("revenue")}>
                    Phiếu thu
                  </Radio>
                </div>
                <Radio
                  value="expenditure"
                  onClick={() => setType("expenditure")}
                >
                  Phiếu chi
                </Radio>
              </Radio.Group>
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Ngày tạo
              </p>
              <div className="flex-1 flex">
                {moment(new Date()).format("H:mm DD/MM/YYYY")}
              </div>
            </div>
            {itemSelected && (
              <div className="flex justify-between mb-[12px] items-center mb-[24px] items-center">
                <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                  Nhân viên xử lý
                </p>
                <Select
                  value={createdById}
                  containerClassName="flex-1"
                  placeholder="--"
                  onChange={(val) => setCreatedById(val)}
                  options={users}
                  disabled
                />
              </div>
            )}
            <div className="flex justify-between mb-[12px] items-center mb-[24px] items-center">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Chọn kho
              </p>
              <Select
                containerClassName="flex-1"
                value={warehouseId}
                placeholder="--"
                onChange={(val) => setWarehouseId(val)}
                options={warehouses}
              />
            </div>
          </div>
          <div className="mt-[12px] flex flex-col w-full bg-white rounded-lg p-[12px]">
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Người nhận
              </p>
              <Input
                className="flex-1"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nhập họ tên người nhận"
              />
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Số điện thoại
              </p>
              <Input
                className="flex-1"
                value={customerPhone}
                placeholder="Nhập SĐT"
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px]">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Số tiền
              </p>
              <Input
                className="flex-1"
                type="number"
                value={money}
                placeholder="Nhập giá trị"
                onChange={(e) => setMoney(e.target.value)}
              />
            </div>
            <div className="flex justify-between mb-[12px] items-center mb-[24px] items-center">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Hình thức
              </p>
              <Select
                containerClassName="flex-1"
                value={paymentType}
                placeholder="Chọn"
                options={[
                  {
                    label: "Chuyển khoản",
                    value: "Chuyển khoản",
                  },
                  {
                    label: "Tiền mặt",
                    value: "Tiền mặt",
                  },
                ]}
                onChange={(val) => setPaymentType(val)}
              />
            </div>
          </div>
          <div className="mt-[12px] w-full flex flex-col bg-white p-[12px] rounded-lg">
            <div className="w-full flex flex-col p-[12px]">
              <div className="flex w-full">
                <div className="text-medium font-medium w-[60%] min-w-[60%] mr-[12px] ">
                  <p className="mb-[8px]">Ghi chú</p>
                  <TextArea
                    className="bg-slate-100 !h-[104px]"
                    placeholder="Công nợ theo đơn hoàn"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                  />
                </div>
                <div className="mb-[16px]">
                  <div className="text-medium font-medium mb-[12px]">
                    Hình ảnh
                  </div>
                  <Upload
                    customRequest={handleUploadImage}
                    listType="picture-card"
                    fileList={fileList}
                    showUploadList={true}
                    onChange={handleChangeImage}
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white mt-[12px] rounded-lg p-[12px]">
            <div className="flex justify-between items-center">
              <p className="text-medium font-medium text-[#2E2D3D] w-[150px]">
                Trạng thái
              </p>
              <div className="flex-1"></div>
              <Radio.Group className="w-[440px]" value={status}>
                <div className="mr-[60px]">
                  <Radio
                    value="Chờ duyệt"
                    onClick={(e) => {
                      setStatus("Chờ duyệt");
                    }}
                  >
                    Chờ duyệt
                  </Radio>
                </div>
                <div className="mr-[60px]">
                  <Radio
                    value="Đã chi"
                    onClick={(e) => {
                      setStatus("Đã chi");
                    }}
                  >
                    Đã chi
                  </Radio>
                </div>
                <Radio
                  value="Đã nhận"
                  onClick={(e) => {
                    setStatus("Đã nhận");
                  }}
                >
                  Đã nhận
                </Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="w-full flex justify-end mt-[32px]">
            <Button
              variant="outlined"
              className="mr-[12px] font-bold bg-white"
              width={305}
              height={44}
              text="HUỶ BỎ"
              onClick={() => {
                resetForm();
                onClose?.();
              }}
            />
            {itemSelected ? (
              <Button
                variant="outlined"
                width={305}
                icon={<Icon icon="printer-1" size={24} />}
                className="font-bold mr-[13px] bg-white"
                onClick={() => {
                  window.open(
                    `/debt-management/revenue-expenditure-print/${itemSelected?.id}`
                  );
                }}
              >
                IN (Enter)
              </Button>
            ) : (
              ""
            )}

            <Button
              variant="secondary"
              width={305}
              height={44}
              text="LƯU (F12)"
              onClick={() =>
                itemSelected ? onSubmit("update") : onSubmit("add")
              }
              disabled={disabledBtn}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPayDetail;
