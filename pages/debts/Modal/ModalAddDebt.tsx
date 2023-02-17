/* eslint-disable react-hooks/exhaustive-deps */
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/TextArea";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../../../components/Button/Button";
import {
  DebtStatus,
  StatusColorEnum,
  StatusEnum,
  StatusList,
} from "../../../types";
import Modal from "../../../components/Modal/Modal/Modal";
import { message, Table } from "antd";
import Icon from "../../../components/Icon/Icon";
import { ColumnsType } from "antd/es/table";
import { listDebtDetail } from "../../../const/constant";
import Upload from "../../../components/Upload/Upload";
import SearchBox from "../../../components/SearchBox";
import { useDebounce } from "usehooks-ts";
import DebtApi from "../../../services/debt";
import { ICustomer, IDebt, IDebtItem } from "../listdebt.type";
import ImageApi from "../../../services/images";
import { format, parseISO } from "date-fns";
import { IOption } from "../../../types/permission";
import { uuid } from "uuidv4";
import { colorStatus } from "../ListDebt";

interface ModalAddDebtProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose: (event?: any) => void;
  onOpen?: (event?: any) => void;
  onReload?: (uuid: string) => void;
  curentDebt?: IDebt;
}

const ModalAddDebt = (props: ModalAddDebtProps) => {
  const columns: ColumnsType<IDebtItem> = [
    {
      title: "Thời gian",
      width: 150,
      dataIndex: "time",
      key: "time",
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {format(parseISO(record.created_at), "dd/MM/yyyy - HH:mm")}
        </span>
      ),
    },
    {
      title: "Giao dịch",
      width: 150,
      dataIndex: "deal",
      key: "deal",
      align: "left",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {record?.total_money || 0} đ
        </span>
      ),
    },
    {
      title: "Hình thức",
      width: 136,
      dataIndex: "method",
      key: "method",
      align: "center",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {record?.payment_type}
        </span>
      ),
    },
    {
      title: "Nội dung",
      width: 250,
      dataIndex: "content",
      key: "content",
      align: "left",
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {record?.note}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      width: 136,
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (_, record) => (
        <>
          {record?.status === DebtStatus.WAITING ? (
            <div className="custom__status__sele">
              <Select
                className="w-[100%]"
                defaultValue={DebtStatus.WAITING}
                options={[
                  {
                    label: DebtStatus.WAITING,
                    value: DebtStatus.WAITING,
                  },
                  {
                    label: DebtStatus.CONFIRM,
                    value: DebtStatus.CONFIRM,
                  },
                ]}
                onChange={(value) => handleUpdateStatus(value, record?.id)}
              />
            </div>
          ) : (
            <div
              className={`font-semibold pl-[12px] text-[${
                colorStatus.find((status) => status.key === record.status)
                  ?.value
              }]`}
            >
              {record?.status}
            </div>
          )}
        </>
      ),
    },
    {
      title: "",
      width: 24,
      dataIndex: "remove",
      key: "remove",
      align: "right",
      render: (_, record) => {
        return (
          <div>
            {record.status !== DebtStatus.CONFIRM ? (
              <div
                className="flex items-center justify-content-end d-block"
                onClick={() => handleRemoveDebtItem(record?.id)}
              >
                <Icon icon="cancel" size={24} color="#7b7b7b" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },
  ];
  const {
    isVisible,
    title,
    iconClose = "Đóng",
    onClose,
    onOpen,
    onReload,
    curentDebt,
  } = props;

  const [searchPhrase, setSearchPhrase] = useState<string | null>(null);
  const debouncedValue = useDebounce<string | null>(searchPhrase, 500);
  const [customers, setCustomers] = useState<Array<ICustomer>>([]);
  const [customerSelected, setCustomerSelected] = useState<ICustomer>();
  const [showSearchPopup, setShowSearchPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [money, setMoney] = useState<number | string>(0);
  // const [images, setImages] = useState<Array<string>>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileTemp, setFileTemp] = useState<any>();
  const [code, setCode] = useState<string>("");
  const [debtId, setDebtId] = useState<string>("");
  const [totalDebt, setTotalDebt] = useState<any>(0);
  const [userList, setUserList] = useState<Array<IOption>>([]);
  const [userIdSelected, setUserIdSelected] = useState<string | undefined>(
    undefined
  );
  const [isFormChange, setIsFormChange] = useState(false);
  const [debtItems, setDebtItems] = useState<Array<IDebtItem>>([]);
  // const [reload, setReload] = useState<string>("");
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  useEffect(() => {
    if (debouncedValue !== null) {
      getAllCustomer();
    }
  }, [debouncedValue]);

  const getAllCustomer = async () => {
    setLoading(true);
    setShowSearchPopup(true);
    const { data } = await DebtApi.getAllCustomer({
      searchText: searchPhrase,
    });

    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (customerSelected?.id) {
      findDebt(customerSelected.id);
    }
  }, [customerSelected]);

  const findDebt = async (id: string) => {
    setLoading(true);
    const { data, maxId } = await DebtApi.findDebt(id);
    if (data) {
      await getDebtItems(data?.id);
      setCode(data?.code || "");
      setDebtId(data?.id);
      setTotalDebt(data?.debt_total || 0);
    } else {
      setCode(`CN00${maxId + 1}`);
      // setDebtId("");
      setDebtItems([]);
      setTotalDebt(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (curentDebt) {
      setLoading(true);
      getDebtItems(curentDebt?.id);
      setCustomerSelected(curentDebt?.detail_customer);
      setLoading(false);
    }
  }, [curentDebt]);

  const getDebtItems = async (debt_id: any) => {
    const { data } = await DebtApi.getDebtItems(debt_id);
    if (data) {
      setDebtItems(data);
    }
  };

  const handleRemoveDebtItem = async (debtItemId: any) => {
    setLoading(true);
    const { data, debt_total } = await DebtApi.deleteDebtItem(debtItemId, {
      debtId,
    });
    if (data) {
      await getDebtItems(debtId);
      setIsFormChange(true);
      setTotalDebt(debt_total);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (status: string, debtItemId: any) => {
    setLoading(true);
    const { data, messageRes } = await DebtApi.updateStatusDebtItem(
      debtItemId,
      { status, debtId }
    );
    if (data) {
      await getDebtItems(debtId);
      setIsFormChange(true);
    } else {
      message.error(messageRes);
    }
    setLoading(false);
  };

  const RenderCustomerItem = () => {
    return (
      <ul className="customer__list__popup">
        {customers?.map((item) => {
          return (
            <li
              className="pointer mb-[8px] font-semibold"
              onClick={() => {
                setCustomerSelected(item);
                setShowSearchPopup(false);
              }}
              key={item?.id}
            >
              {item?.name}{" "}
              {item?.phone_number ? ` - ${item?.phone_number}` : ""}
            </li>
          );
        })}
      </ul>
    );
  };

  const handleChangeImage = async (e) => {
    setFileList(
      fileList.filter((v: any) => !v.status || v.status !== "removed")
    );
  };

  useEffect(() => {
    if (fileTemp) {
      setFileList([...fileList, { url: fileTemp }]);
    }
  }, [fileTemp]);

  const handleUploadImage = async (options: any) => {
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
    if (!customerSelected?.id) {
      message.error("Vui lòng tìm và chọn khách hàng cần thêm công nợ");
      return;
    }

    if (!money) {
      message.error("Vui lòng nhập số tiền!");
      return;
    }

    setLoading(true);
    setDisabledBtn(true);
    let images: Array<string> = [];
    fileList?.map((item) => {
      images.push(item?.url);
    });

    let params = {
      customerId: customerSelected?.id,
      code,
      money,
      note,
      images,
      debtId,
    };

    const { data, error, noti, totalMoney } = await DebtApi.addOrUpdateDebt(
      params
    );

    if (error === 0) {
      message.success(noti || "Thành công");
      await getDebtItems(debtId);
      setNote("");
      setMoney(0);
      setFileList([]);
      setTotalDebt(totalMoney || 0);
      // onReload?.(uuid());
      setIsFormChange(true);
    }
    setLoading(false);
    setDisabledBtn(false);
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={() => onClose(isFormChange)}
      onOpen={onOpen}
      iconClose={iconClose}
      width={908}
      footer={false}
      className="p-[16px] modal-add-debt"
    >
      <div className="modal-add-debt">
        <div className="w-full">
          <SearchBox
            onChange={(e) => setSearchPhrase(e.target.value)}
            placeholder="Nhập tên KH, số điện thoại"
            popupContent={
              loading ? (
                <div>Loading...</div>
              ) : customers?.length > 0 ? (
                <RenderCustomerItem />
              ) : (
                <div>Không tìm thấy khách hàng</div>
              )
            }
            value={searchPhrase || ""}
            showPopup={showSearchPopup}
            onClose={() => setShowSearchPopup(false)}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[48%] flex flex-col p-[12px] bg-white rounded-lg mt-[12px]">
            <div className="flex justify-between mb-[16px]">
              <p className="text-medium font-medium text-[#2E2D3D]">
                Mã công nợ
              </p>
              <p className="text-medium font-medium text-[#2E2D3D]">
                {code || "--"}
              </p>
            </div>
            <div className="flex justify-between mb-[16px]">
              <p className="text-medium font-medium text-[#2E2D3D]">
                Ngày tạo nợ
              </p>
              <p className="text-medium font-medium text-[#2E2D3D]">
                {format(new Date(), "dd/MM/yyyy - HH:mm")}
              </p>
            </div>
            {/* <div className="mb-[16px]">
              <p className="text-medium font-medium text-[#2E2D3D] mb-[8px]">
                Nhân viên xử lý
              </p>
              <Select
                className="w-[100%]"
                placeholder="chọn nhân viên"
                options={userList}
                onChange={(value) => setUserIdSelected(value)}
                value={userIdSelected}
              />
            </div> */}
          </div>
          <div className="w-[48%] flex flex-col p-[12px] bg-white rounded-lg mt-[12px]">
            <div className="flex justify-between mb-[16px]">
              <p className="text-medium font-medium text-[#2E2D3D]">
                Họ và tên khách hàng
              </p>
              <p className="text-medium font-medium text-[#2E2D3D]">
                {customerSelected?.name || "--"}
              </p>
            </div>
            <div className="mb-[16px] flex justify-between">
              <p className="text-medium font-medium text-[#2E2D3D]">
                Số điện thoại
              </p>
              <p className="text-medium font-medium text-[#2E2D3D]">
                {customerSelected?.phone_number || "--"}
              </p>
            </div>
            <div className="mb-[16px] flex justify-between">
              <p className="text-medium font-medium text-[#2E2D3D]">
                Tiền công nợ hiện tại
              </p>
              <p className="text-medium font-medium text-[#F97316]">
                {parseFloat(totalDebt || 0).toLocaleString()} đ
              </p>
            </div>
          </div>
        </div>
        <div className="w-full my-[12px]">
          <Table
            columns={columns}
            dataSource={debtItems}
            pagination={false}
            loading={loading}
          />
        </div>
        <div className="mb-[24px] w-[409px] flex justify-between items-center">
          <p className="mr-[24px] text-medium font-medium text-[#2E2D3D]">
            Số tiền công nợ
          </p>
          <Input
            width={267}
            type="number"
            placeholder="0 đ"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
          />
        </div>
        <div className="flex w-full rounded-lg bg-white p-[12px]">
          <div className="text-medium font-medium w-[60%] mr-[12px] mb-[8px]">
            <div className="mb-[12px]">Ghi chú</div>
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
            onClick={() => onClose(isFormChange)}
            variant="outlined"
            className="mr-[12px] bg-white"
            width={246}
            height={44}
            text="TRỞ LẠI"
          />
          <Button
            variant="secondary"
            width={246}
            height={44}
            text="CẬP NHẬT"
            onClick={onSubmit}
            disabled={disabledBtn}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddDebt;
