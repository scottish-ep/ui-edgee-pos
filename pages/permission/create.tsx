import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import TitlePage from '../../components/TitlePage/Titlepage';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import {
  IPermissionDetail,
  permissionCheckboxList,
} from '../../types/permission';
import TogglePermission from './components/TogglePermission';
import Input from '../../components/Input/Input';
import TextArea from '../../components/TextArea';
import { Checkbox, Form } from 'antd';
import { notification } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import PermissionApi from '../../services/permission';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useForm } from 'antd/lib/form/Form';

const CreatePermission = () => {
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
    const handleNewCheckedList = (newCheckedList: any) => {
        setCheckedList(newCheckedList);
        // setCheckAll(isCheckedChecboxCheckAll(newCheckedList));
      };
      

    const [form] = Form.useForm()
    return (
        <div className="w-full">
          <div className="flex items-center justify-between mb-[26px] flex-wrap">
            <div className="flex gap-[16px]">
              <div className='cursor-pointer' onClick={() => (window.location.href = '/permission')}>
                <Icon icon="back1" size={36} />
              </div>
              <div>
                <TitlePage title="Chi tiết phân quyền" />
                <div className="text-[#1D1C2D] mt-[8px]">
                  Quản lý người dùng / Phân quyền / Chi tiết
                </div>
              </div>
            </div>
    
            <div className="flex gap-[8px] flex-wrap">
              {/* <Button
                            variant="outlined"
                            icon={<Icon icon="trash" size={24} />}
                        >
                            <span className="text-[#EF4444] ">Xóa</span>
                        </Button> */}
    
              <Button
                variant="secondary"
                width={151}
                color="white"
                // loading={loading}
                // onClick={handleSavePermission}
              >
                LƯU (F12)
              </Button>
            </div>
          </div>
    
          <Form form={form}>
            <div className="card__custom mb-[12px]">
              <div className="flex gap-[16px]">
                <div className="group__ip w-[50%]">
                  <div className="color-[#5F5E6B]">Tên chức vụ *</div>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Tên chức vụ là bắt buộc!',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên chức vụ" required={true} />
                  </Form.Item>
                </div>
                <div className="group__ip flex-1">
                  <div className="color-[#5F5E6B]">Ghi chú</div>
                  <Form.Item name="note">
                    <TextArea rows={4} placeholder="Nhập ghi chú" />
                  </Form.Item>
                </div>
              </div>
            </div>
    
            <div className="card__custom">
              <div className="flex items-center justify-between mb-[26px]">
                <div className="color-[#2E2D3D] font-semibold text-[16px]">
                  Phân quyền chi tiết
                </div>
                <div className="text-[14px] font-medium color-[#5F5E6B] mt-[-5px]">
                  <Checkbox
                    // onChange={(e: CheckboxChangeEvent) => handleCheckboxCheckAll(e)}
                    // checked={checkAll}
                  >
                    Toàn quyền hệ thống
                  </Checkbox>
                </div>
              </div>
              {permissionCheckboxList?.map((item) => {
                return (
                  <TogglePermission
                    key={item?.parent?.value}
                    item={item}
                    isCheckAll={checkAll}
                    onHandleNewCheckedList={handleNewCheckedList}
                    defaultCheckedList={checkedList}
                  />
                );
              })}
            </div>
          </Form>
        </div>
    )
}

export default CreatePermission;