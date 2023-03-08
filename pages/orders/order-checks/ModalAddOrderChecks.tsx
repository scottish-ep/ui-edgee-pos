import { message, notification } from 'antd';
import { UploadFile } from 'antd/es/upload';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useEffect, useRef, useState } from 'react';
import { uuid } from 'uuidv4';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon/Icon';
import Modal from '../../../components/Modal/Modal/Modal';
import Select from '../../../components/Select/Select';
import Upload from '../../../components/Upload/Upload';
import { shippingUnitList } from '../../../const/constant';
import Api from '../../../services';
import OrderCheckCommandApi from '../../../services/order-check-command';
import { IOption } from '../../../types/permission';

interface ModalAddOrderChecksProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (uuid: string) => void;
}

const ModalAddOrderChecks: React.FC<ModalAddOrderChecksProps> = (props) => {
  const { isVisible, onClose, onSuccess } = props;
  const [file, setFile] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<IOption[]>([]);
  const [transportCompanies, setTransportCompanies] = useState<IOption[]>([]);
  const [transportCompanyIdSelected, setTransportCompanyIdSelected] =
    useState<string>('');
  const [warehouseIdSelected, setWarehouseIdSelected] = useState<string>('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  useEffect(() => {
    getAllWarehouse();
    getAllTransportCompanies();
  }, []);
  
  let selectedUser = '';
  useRef(() => {
    selectedUser = window.loggedInUser;
  });

  const getAllWarehouse = async () => {
    const url = `/api/v2/warehouses/list`;
    const { data } = await Api.get(url);

    let arr: Array<IOption> = [
      {
        value: '',
        label: '--chọn--',
      },
    ];

    data?.data?.map((item: any) => {
      arr.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setWarehouses(arr);
  };

  const getAllTransportCompanies = async () => {
    const url = `/api/v2/transport-company/get-all`;
    const { data } = await Api.get(url);

    let arr: Array<IOption> = [
      {
        value: '',
        label: '--chọn--',
      },
    ];

    data?.data?.map((item: any) => {
      if (item?.id === 9) {
        // ninjavan
        arr.push({
          label: item?.name,
          value: item?.id,
        });
      }
    });
    setTransportCompanies(arr);
  };

  const onSubmit = async () => {
    setLoadingSubmit(true);
    if (!file || !transportCompanyIdSelected) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('transportCompanyId', transportCompanyIdSelected);
    // formData.append("warehouseId", warehouseIdSelected);
    formData.append('selectedUser', selectedUser);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const { data } = await OrderCheckCommandApi.add(formData, config);

    if (data) {
      onSuccess?.(uuid());
      notification.success({
        message: 'Thêm thành công',
      });
      onClear();
    }
    setLoadingSubmit(false);
  };

  const onClear = () => {
    setTransportCompanyIdSelected('');
    setWarehouseIdSelected('');
    setFile(null);
    onClose();
  };

  const Footer = () => (
    <div className="flex justify-between flex-wrap gap-x-3">
      <Button className="flex-1" variant="outlined" onClick={onClose}>
        HUỶ BỎ
      </Button>
      <Button
        className="flex-1"
        variant="secondary"
        onClick={onSubmit}
        disabled={!file || !transportCompanyIdSelected || loadingSubmit}
        loading={loadingSubmit}
      >
        TẠO ĐỐI SOÁT
      </Button>
    </div>
  );

  return (
    <Modal
      isCenterModal
      title="Tạo phiên đối soát"
      isVisible={isVisible}
      onClose={onClear}
      iconClose="Đóng"
      footer={<Footer />}
      width={504}
    >
      <div className="flex flex-col gap-y-3 -m-3">
        <div className="flex flex-col gap-y-3 bg-white p-3 border border-[#DADADD] rounded">
          {/* <div className="flex items-center gap-x-6 ">
            <span className="text-[#2E2D3D] text-medium font-medium w-[180px]">
              Chọn kho đối soát
            </span>
            <Select
              containerClassName="flex-1"
              placeholder="Chọn"
              options={warehouses}
              onChange={(val) => setWarehouseIdSelected(val)}
              value={warehouseIdSelected}
            />
          </div> */}
          <div className="flex items-center gap-x-6">
            <span className="text-[#2E2D3D] text-medium font-medium w-[180px]">
              Chọn đơn vị vận chuyển
            </span>
            <Select
              containerClassName="flex-1"
              placeholder="Chọn"
              options={transportCompanies}
              onChange={(val) => setTransportCompanyIdSelected(val)}
              value={transportCompanyIdSelected}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-3 bg-white p-3 border border-[#DADADD] rounded">
          <h3 className="text-medium font-semibold text-[#1D1C2D]">
            Tải lên danh sách đối soát
          </h3>
          <p className="text-medium text-[#5F5E6B]">
            Tải lên file đối soát từ đơn vị vận chuyển có chứa mã vận đơn cần
            đối soát.
          </p>

          <div className="flex gap-x-3 items-center">
            <Upload
              onChange={(value: UploadChangeParam<UploadFile<any>>) =>
                setFile(value?.file?.originFileObj)
              }
              accept=".xlsx, .xls, .csv"
              iconUpload={<Icon size={24} icon="upload" />}
              textUpload="Tải lên"
              showUploadList={false}
              fileList={file ? [file] : []}
            />
            {file && (
              <div className="flex gap-x-1 py-1 px-2 bg-[#F0F0F1] rounded items-center">
                <span className="text-medium text-[#0EA5E9]">{file?.name}</span>
                <div
                  className="cursor-pointer"
                  onClick={() => setFile(undefined)}
                >
                  <Icon size={12} icon="cancel-mobile" />
                </div>
              </div>
            )}
            <a href="https://docs.google.com/spreadsheets/d/1STDhV14AK7VHBo4mSJaNYx3a9Os9-Qum/edit?usp=share_link&ouid=103939390843709947428&rtpof=true&sd=true">
              File mẫu
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddOrderChecks;
