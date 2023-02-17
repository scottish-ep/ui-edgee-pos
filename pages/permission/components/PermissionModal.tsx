import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';

import Modal from '../../../components/Modal/Modal/Modal';
import Button from '../../../components/Button/Button';
import Select from '../../../components/Select/Select';
import Input from '../../../components/Input/Input';
import { Radio, RadioChangeEvent, Switch } from 'antd';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Image from 'next/image';
import { IUser } from '../../../types/users';
import moment, { Moment } from 'moment';
import { usersList } from '../../../dummy-data/dummyData';
import { IOption } from '../../../types/permission';
import NoData from '../../../assets/no-data.svg';
import Icon from '../../../components/Icon/Icon';
import TabsVerticle from '../../../components/TabsVerticle/Index';

interface ModalProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
}

const PermissionModal = (props: ModalProps) => {
  const {
    isVisible,
    title = 'Phân quyền đặc biệt',
    iconClose = 'Đóng',
    onClose,
  } = props;

  const [userIDsPricePermissionSelected, setUserIDsPricePermissionSelected] =
    useState<Array<string | number>>([]);
  const [userIDsReportPermissionSelected, setUserIDsReportPermissionSelected] =
    useState<Array<string | number>>([]);
  const [users, setUsers] = useState<Array<IUser>>(usersList);
  const [options, setOptions] = useState<Array<IOption>>([]);
  const [activeTabValue, setActiveTabValue] = useState<string>('1');

  useEffect(() => {
    let array: Array<IOption> = [];
    users?.map((item) => {
      array.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setOptions(array);
  }, [users]);

  const Footer = () => (
    <div className="flex items-center justify-between">
      <div className="flex justify-end w-[100%]">
        <Button
          variant="outlined"
          text="HUỶ BỎ"
          width="225px"
          onClick={onClose}
        />
        <Button variant="secondary" text="LƯU" width="225px" />
      </div>
    </div>
  );

  const handleChange = (value: string[]) => {
    activeTabValue === '1'
      ? setUserIDsPricePermissionSelected(value)
      : setUserIDsReportPermissionSelected(value);
  };

  const handleRemoveItem = (value: string | number) => {
    let array =
      activeTabValue === '1'
        ? [...userIDsPricePermissionSelected]
        : [...userIDsReportPermissionSelected];
    var index = array.indexOf(String(value));
    if (index !== -1) {
      array.splice(index, 1);
      activeTabValue === '1'
        ? setUserIDsPricePermissionSelected(array)
        : setUserIDsReportPermissionSelected(array);
    }
  };

  const RenderComponent = () => {
    const list =
      activeTabValue === '1'
        ? userIDsPricePermissionSelected
        : userIDsReportPermissionSelected;
    return (
      <>
        <div className="mb-[12px]">
          <div className="font-semibold text-[#1D1C2D] font-[16px] mb-[16px]">
            Người dùng được truy cập
          </div>
          <Select
            containerClassName="flex-1"
            width="100%"
            mode="multiple"
            showArrow={true}
            placeholder="Chọn nhân viên"
            onChange={handleChange}
            value={list}
            options={options}
          />

          <div className="custom__select__add__tag mt-[16px]">
            {list?.length > 0 ? (
              <div className="user__tags flex-wrap flex items-center gap-[10px]">
                {users?.map((item) => {
                  return list?.indexOf(item?.id) > -1 ? (
                    <div
                      key={item?.id}
                      className="flex user__tag__custom items-center gap-[8px]"
                    >
                      {/* <Image className="user__tag__img" src={item?.avatar} alt=""/> */}
                      <div className="text-[#4B4B59] font-semibold text-[14px]">
                        {item?.name}
                      </div>
                      <div
                        className="remove__item pointer"
                        onClick={() => handleRemoveItem(item?.id)}
                      >
                        <Icon icon="cancel" size={16} color="#909098" />
                      </div>
                    </div>
                  ) : (
                    ''
                  );
                })}
              </div>
            ) : (
              <div className="no__data py-[20px] flex items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      iconClose={iconClose}
      footer={<Footer />}
      width={945}
    >
      <div className="w-[100%]">
        <div className="flex gap-12px">
          <div className="w-[50%] border__right">
            <TabsVerticle
              list={[
                {
                  value: '1',
                  label: 'Cho phép xem và chỉnh sửa giá nhập',
                },
                {
                  value: '2',
                  label: 'Cho phép báo xấu/bỏ báo xấu khách hàng',
                },
              ]}
              defaultActiveValue="1"
              onTabChange={(value) => setActiveTabValue(value)}
            />
          </div>
          <div className="flex-1 min-h-[400px]">
            <RenderComponent />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionModal;
