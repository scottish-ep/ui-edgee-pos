/* eslint-disable react-hooks/exhaustive-deps */
import Icon from '../../../components/Icon/Icon';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../../components/Modal/Modal/Modal';
import Button from '../../../components/Button/Button';
import { ReactNode } from 'react';
import Select from '../../../components/Select/Select';
import { message, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { StatusColorEnum, StatusEnum, StatusList } from '../../../types';
import { listDebtDetail } from '../../../const/constant';
import TextArea from 'antd/lib/input/TextArea';
import Upload from '../../../components/Upload/Upload';
import { IDebt, IDebtItem } from '../listdebt.type';
import { format } from 'date-fns';
// import { colorStatus } from '..';
import DebtApi from '../../../services/debt';
import { IOption } from '../../../types/permission';
import ImageApi from '../../../services/images';
import { uuid } from 'uuidv4';
interface ModalDebtDetailProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  titleBody?: string;
  debtSelected?: IDebt;
  onReload?: (uuid: string) => void;
  onShowModalAdd?: (debt?: IDebt) => void;
}
const ModalDebtDetail = (props: ModalDebtDetailProps) => {
  const {
    title,
    isVisible,
    onClose,
    onOpen,
    iconClose = 'Đóng',
    debtSelected = null,
    onReload,
    onShowModalAdd,
  } = props;

  const [userList, setUserList] = useState<Array<IOption>>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileTemp, setFileTemp] = useState<any>();
  const [note, setNote] = useState<string>('');
  const [debtItems, setDebtItems] = useState<Array<IDebtItem>>([]);
  const [images, setImages] = useState<Array<string>>([]);
  const [reload, setReload] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [debt, setDebt] = useState<IDebt | null>(debtSelected);
  const [debtTotal, setDebtTotal] = useState<any>(0);

  const colorStatus = [
    {
      key: 'Chờ duyệt',
      value: '#8B5CF6',
    },
    {
      key: 'Đã duyệt',
      value: '#0EA5E9',
    },
    {
      key: 'Hoàn tất',
      value: '#10B981',
    },
  ];

  const columns: ColumnsType<IDebtItem> = [
    {
      title: 'Thời gian',
      width: 150,
      dataIndex: 'time',
      key: 'dataIndex',
      fixed: 'left',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {format(new Date(record?.created_at), 'HH:mm - dd/MM/yyyy')}
        </span>
      ),
    },
    {
      title: 'Giao dịch',
      width: 150,
      dataIndex: 'deal',
      key: 'dataIndex',
      align: 'left',
      render: (_, record) => (
        <span
          className={`text-medium ${
            record?.item_type === 'debt' ? 'text-[#F97316]' : 'text-[#6366F1]'
          } flex  font-medium`}
        >
          {record?.item_type === 'debt' ? (
            <Icon icon="debt-arrow" size={24} className="mr-[10px]" />
          ) : (
            <Icon icon="arrow-up" size={24} className="mr-[10px]" />
          )}
          {new Intl.NumberFormat().format(record?.total_money || 0)} đ
        </span>
      ),
    },
    {
      title: 'Hình thức',
      width: 136,
      dataIndex: 'method',
      key: 'dataIndex',
      align: 'center',
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {record?.payment_type}
        </span>
      ),
    },
    {
      title: 'Nội dung',
      width: 250,
      dataIndex: 'content',
      key: 'dataIndex',
      align: 'left',
      render: (_, record) => (
        <span className="text-medium text-[#2E2D3D] font-medium">
          {record?.note}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      width: 136,
      dataIndex: 'status',
      key: 'dataIndex',
      align: 'left',
      render: (_, record) => (
        <>
          {record?.status === 'Chờ duyệt' ? (
            <div className="custom__status__sele">
              <Select
                className="w-[100%]"
                defaultValue="Chờ duyệt"
                options={[
                  {
                    label: 'Chờ duyệt',
                    value: 'Chờ duyệt',
                  },
                  {
                    label: 'Đã duyệt',
                    value: 'Đã duyệt',
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
      title: '',
      width: 24,
      dataIndex: 'remove',
      key: 'remove',
      align: 'right',
      render: (_, record) => {
        return (
          <div>
            {record.status != 'Đã duyệt' ? (
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

  useEffect(() => {
    setDebt(debtSelected);
    setDebtTotal(debtSelected?.debt_total || 0);
  }, [debtSelected]);

  const handleRemoveDebtItem = async (debtItemId: any) => {
    setLoading(true);
    const { data, debt_total } = await DebtApi.deleteDebtItem(debtItemId, {
      debtId: debt?.id,
    });
    if (data) {
      setReload(uuid());
      onReload?.(uuid());
      setDebtTotal(debt_total);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (status: string, debtItemId: any) => {
    setLoading(true);
    const { data, messageRes } = await DebtApi.updateStatusDebtItem(
      debtItemId,
      { status, debtId: debt?.id }
    );
    if (data) {
      setReload(uuid());
      onReload?.(uuid());
    } else {
      message.error(messageRes);
      setReload(uuid());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debt) {
      console.log(
        '🚀 ~ file: ModalDebtDetail.tsx:120 ~ useEffect ~ debt',
        debt
      );

      setNote(debt?.note || '');
      let arr: any = [];
      {
        debt?.images?.map((item, index) => {
          arr.push({
            url: item,
            uid: index,
          });
        });
      }
      setFileList(arr);
    }
  }, [debt]);

  useEffect(() => {
    if (debt) {
      getDebtItems();
    }
  }, [debt, reload]);

  const getDebtItems = async () => {
    setLoading(true);
    const { data } = await DebtApi.getDebtItems(debt?.id);
    console.log('🚀 ~ file: ModalAddDebt.tsx:141 ~ getDebtItems ~ data', data);
    if (data) {
      setDebtItems(data);
    }
    setLoading(false);
  };

  // const getUsers = async () => {
  //   const { data } = await DebtApi.getUsers();
  //   if(data){
  //     let arr:Array<IOption> = [];
  //     data?.map(item => {
  //       arr.push({
  //         label: item?.name,
  //         value: item?.id
  //       })
  //     })
  //     setUserList(arr);
  //   }
  // }

  useEffect(() => {
    if (fileTemp) {
      setFileList([...fileList, { url: fileTemp }]);
      let images: Array<string> = [];
      fileList?.map((item) => {
        images.push(item?.url);
      });
      setImages([...images, fileTemp]);
    }
  }, [fileTemp]);

  useEffect(() => {
    if (fileList && debt) {
      updateImages();
    }
  }, [images]);

  const updateImages = async () => {
    let images: Array<string> = [];
    fileList?.map((item) => {
      images.push(item?.url);
    });

    let params = {
      images,
      type: 'update_image',
    };
    const { data } = await DebtApi.updateDebt(debt?.id, params);
    if (data) {
      message.success('Cập nhật thành công');
      setReload(uuid());
      onReload?.(uuid());
    }
  };

  const handleUploadImage = async (options: any) => {
    console.log(
      '🚀 ~ file: ModalAddDebt.tsx:178 ~ handleUploadImage ~ options',
      options
    );
    const { onSuccess, onError, file, onProgress } = options;
    try {
      const data = await ImageApi.upload(file);
      if (data) {
        setFileTemp(data.url);
      }
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const handleChangeImage = async (e: any) => {
    console.log(
      '🚀 ~ file: ModalDebtDetail.tsx:212 ~ handleChangeImage ~ e',
      e
    );
    let filter = fileList.filter(
      (v: any) => !v.status || v.status !== 'removed'
    );
    setFileList(filter);
    if (e?.file?.status === 'removed') {
      let images: Array<string> = [];
      filter?.map((item) => {
        images.push(item?.url);
      });
      setImages(images);
    }
  };

  const handleUpdateNote = async () => {
    let params = {
      note,
    };
    const { data } = await DebtApi.updateDebt(debt?.id, params);
    console.log(
      '🚀 ~ file: ModalDebtDetail.tsx:192 ~ handleUpdateNote ~ data',
      data
    );
    if (data) {
      message.success('Cập nhật thành công');
      setReload(uuid());
      onReload?.(uuid());
    }
  };

  if (!debt) {
    return null;
  }

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={908}
      footer={false}
      className="modal-debt-detail"
    >
      <div>
        <div className="flex justify-between w-full mb-[12px]">
          <div
            className="w-[48%] bg-white rounded-lg"
            style={{ padding: '12px' }}
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-medium font-medium">Mã công nợ</div>
              <div className="text-medium font-medium">{debt?.code}</div>
            </div>
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-medium font-medium">Ngày tạo</div>
              <div className="text-medium font-medium">
                {format(new Date(debt?.created_at || ''), 'HH:mm - dd/MM/yyyy')}
              </div>
            </div>
            {/* <div className="flex flex-col  justify-left mb-[16px]">
              <div className="text-medium font-medium mb-[8px]">
                Nhân viên xử lý
              </div>
              <Select
                placeholder="Chọn nhân viên"
                style={{ width: 395 }}
                options={userList}
              />
            </div> */}
          </div>
          <div
            className="w-[48%] bg-white rounded-lg"
            style={{ padding: '12px' }}
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-medium font-medium">
                Họ và tên khách hàng
              </div>
              <div className="text-medium font-medium">
                {debt?.detail_customer?.name}
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-medium font-medium">Số điện thoại</div>
              <div className="text-medium font-medium">
                {debt?.detail_customer?.phone_number}
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-medium font-medium">
                Tiền công nợ hiện tại
              </div>
              <div
                className="text-medium font-medium"
                style={{ color: '#F97316' }}
              >
                {parseFloat(debtTotal || 0).toLocaleString()} đ
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-lg">
          <Table
            columns={columns}
            dataSource={[...debtItems]}
            pagination={false}
            loading={loading}
          />
        </div>
        <div className="w-full flex flex-col mt-[12px] p-[12px] bg-white rounded-lg">
          <div className="flex w-full">
            <div className="text-medium font-medium w-[60%] min-w-[60%] mr-[12px]">
              <div className="flex items-center justify-between">
                <div className="mb-[12px]">Ghi chú</div>

                <div
                  onClick={handleUpdateNote}
                  className="d-block mb-[12px]  text-[#384ADC] cursor-pointer font-medium"
                >
                  Lưu
                </div>
              </div>

              <TextArea
                className="bg-slate-100 !h-[104px]"
                placeholder="Công nợ theo đơn hoàn"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
        </div>
        <div className="w-full flex justify-end mt-[32px]">
          <Button
            variant="outlined"
            className="mr-[12px]"
            width={305}
            height={44}
            text="TRỞ LẠI"
            onClick={onClose}
          />
          <Button
            variant="blue-outlined"
            className="mr-[12px]"
            width={305}
            height={44}
            text="THÊM CÔNG NỢ"
            onClick={() => {
              onClose?.();
              onShowModalAdd?.(debt);
            }}
          />
          <Button
            variant="secondary"
            width={305}
            height={44}
            text="THANH TOÁN"
            onClick={onOpen}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalDebtDetail;
