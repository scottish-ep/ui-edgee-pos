import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { getEnvironmentData } from 'worker_threads';
import TableEmpty from '../../../components/TableEmpty';
import TitlePage from '../../../components/TitlePage/Titlepage';
import styles from '../../styles/DetailCustomer.module.css';
import { notification, Popover, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Input from '../../../components/Input/Input';
import { get } from 'lodash';
import TransportFeeApi from '../../../services/transport-fee';
import Button from '../../../components/Button/Button';
import { isArray } from '../../../utils/utils';
import Icon from 'components/Icon/Icon';
import ModalFeeCreate from '../ModalTransports/ModalFeeCreate';
import ModalConfirm from 'components/Modal/ModalConfirm/ModalConfirm';

const SettingFeeTransport = () => {
  const [settingFees, setSettingFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowModalFeeCreate, setIsShowModalFeeCreate] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const data = await TransportFeeApi.list();
    console.log('data', data);
    if (data) {
      let rawSettingFees: any[] = [];
      rawSettingFees.push({
        fee_exterritorial: data.fee_exterritorial,
        fee_suburban: data.fee_suburban,
        fee_urban: data.fee_urban,
      });
      setSettingFees(rawSettingFees);
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    setIsShowModalFeeCreate(false);
  };

  const handleChangeValue = (id: string, key: string, value: string) => {
    setSettingFees((settingFees) =>
      settingFees.map((fee) => {
        if (fee.id === id) {
          return {
            ...fee,
            [key]: Number(value),
          };
        }
        return fee;
      })
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: '#',
      width: 240,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'T??n C???u H??nh',
      width: 240,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (_, record) => (
        <div className="font-medium font-semibold">Ph?? v???n chuy???n</div>
      ),
    },
    {
      title: 'N???i th??nh',
      width: 240,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (_, record) => (
        <div>
          <Input
            type="number"
            value={parseFloat(get(record, 'fee_urban')) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">??</p>}
            onChange={(e) =>
              handleChangeValue(record.id, 'fee_urban', e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: 'Ngo???i th??nh',
      width: 240,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (_, record) => (
        <div className="flex justify-center">
          <Input
            type="number"
            value={parseFloat(get(record, 'fee_suburban')) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">??</p>}
            onChange={(e) =>
              handleChangeValue(record.id, 'fee_suburban', e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: 'Ngo???i t???nh',
      width: 240,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (_, record) => (
        <div>
          <Input
            type="number"
            value={parseFloat(get(record, 'fee_exterritorial')) || 0}
            suffix={<p className="text-medium text-[#2E2D3D]">??</p>}
            onChange={(e) =>
              handleChangeValue(record.id, 'fee_exterritorial', e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: 'Thao t??c',
      width: 100,
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div
          className="flex justify-center"
          onClick={() => setIsShowModalConfirm(true)}
        >
          <Icon icon="trash" size={24} />
        </div>
      ),
    },
  ];

  const saveChange = async () => {
    if (isArray(settingFees) && settingFees[0]) {
      const dataChange = settingFees[0];
      const data = await TransportFeeApi.update({
        fee_exterritorial: dataChange.fee_exterritorial,
        fee_suburban: dataChange.fee_suburban,
        fee_urban: dataChange.fee_urban,
      });
      if (data) {
        notification.success({
          message: 'C???p nh???t th??nh c??ng!',
        });
      } else {
        notification.error({
          message: 'C???p nh???t kh??ng th??nh c??ng!',
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-[32px]">
        <TitlePage title="Ph?? v???n chuy???n" description="C???u h??nh" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            onClick={() => setIsShowModalFeeCreate(true)}
            variant="secondary"
            width={187}
          >
            T???O M???I
          </Button>
          <Button onClick={() => saveChange()} variant="secondary" width={187}>
            L??U
          </Button>
        </div>
      </div>
      <div className="relative mt-[25px]">
        <Table
          loading={loading}
          columns={columns}
          dataSource={[...settingFees]}
          pagination={false}
          locale={
            !loading
              ? {
                  emptyText: <TableEmpty />,
                }
              : { emptyText: <></> }
          }
        />
      </div>
      <ModalFeeCreate
        title="Th??ng b??o"
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalFeeCreate(false)}
        isVisible={isShowModalFeeCreate}
      />
      <ModalConfirm
        titleBody="X??a th??ng tin danh m???c?"
        content={
          <div className="text-center">
            M???i d??? li???u c???a danh m???c n??y <br />
            s??? b??? xo?? kh???i h??? th???ng
          </div>
        }
        onOpen={handleConfirmDelete}
        onClose={() => setIsShowModalConfirm(false)}
        isVisible={isShowModalConfirm}
      />
    </div>
  );
};

export default SettingFeeTransport;
