import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import { StatusColorEnum, StatusEnum, StatusList } from "../../../types";
import Modal from "../../../components/Modal/Modal/Modal";
import Upload from "../../../components/Upload/Upload";
import ImageApi from "../../../services/images";
import DebtApi from "../../../services/debt";
import { message as messageAntd } from "antd";
import { uuid } from "uuidv4";

interface ModalPayDebtProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  debtId?: string;
  onReload?: (uuid: string) => void;
}
const ModalPayDebt = (props: ModalPayDebtProps) => {
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    debtId,
    onReload,
  } = props;

  const [note, setNote] = useState<string>("");
  const [money, setMoney] = useState<number | string>(0);
  // const [images, setImages] = useState<Array<string>>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileTemp, setFileTemp] = useState<any>();
  const [paymentType, setPaymentType] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);

  const methodList = [
    {
      label: "Chuyển khoản",
      value: "Chuyển khoản",
    },
    {
      label: "Tiền mặt",
      value: "Tiền mặt",
    },
  ];

  const handleChangeImage = async (e) => {
    setFileList(
      fileList.filter((v: any) => !v.status || v.status !== "removed")
    );
  };

  useEffect(() => {
    if (fileTemp) {
      setFileList([...fileList, { url: fileTemp }]);
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

  const onSubmit = async () => {
    let images: Array<string> = [];
    fileList?.map((item) => {
      images.push(item?.url);
    });

    if (!money) {
      messageAntd.error("Vui lòng nhập số tiền!");
      return;
    }

    if (!paymentType) {
      messageAntd.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    setLoading(true);
    setDisabledBtn(true);

    let params = {
      money,
      note,
      images,
      debtId,
      paymentType,
      itemType: "paid",
    };

    const { data, error, message } = await DebtApi.addDebtItem(params);
    if (error === 0) {
      messageAntd.success("Thêm thành công");
      onClose?.();
      onReload?.(uuid());
      setFileList([]);
      setPaymentType(undefined);
      setMoney(0);
      setNote("");
    } else {
      messageAntd.error(
        message || "Thêm thất bại! vui lòng kiểm tra thông tin"
      );
    }
    setLoading(false);
    setDisabledBtn(false);
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={836}
      footer={false}
      className="p-[16px] "
    >
      <div>
        <div className="flex justify-between w-full mb-[16px] items-center">
          <p className="text-medium font-medium w-[100px] text-[#2E2D3D]">
            Số tiền
          </p>
          <Input
            width={662}
            value={money}
            type="number"
            onChange={(e) => setMoney(e.target.value)}
          />
        </div>
        <div className="flex justify-between w-full mb-[16px] items-center">
          <p className="text-medium font-medium w-[100px] text-[#2E2D3D]">
            Hình thức
          </p>
          <Select
            width="100%"
            onChange={(val) => setPaymentType(val)}
            placeholder="Chọn"
            options={methodList}
          />
        </div>
        <div className="w-full flex flex-col p-[12px]">
          <div className="flex w-full">
            <div className="text-medium font-medium w-[60%] mr-[12px] mb-[8px]">
              <p className="mb-[8px]">Ghi chú</p>
              <TextArea
                className="bg-slate-100 !h-[104px]"
                placeholder="Công nợ theo đơn hoàn"
                onChange={(e) => setNote(e.target.value)}
                value={note}
              />
            </div>
            <div className="mb-[16px]">
              <div className="text-medium font-medium mb-[12px]">Hình ảnh</div>
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
          <div className="w-full flex justify-end mt-[32px]">
            <Button
              variant="outlined"
              className="mr-[12px]"
              width={246}
              height={44}
              text="HUỶ BỎ"
            />
            <Button
              variant="secondary"
              width={246}
              height={44}
              text="XÁC NHẬN"
              onClick={onSubmit}
              disabled={disabledBtn}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPayDebt;
