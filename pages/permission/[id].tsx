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

const PermissionDetail = () => {
  const [detail, setDetail] = useState<any>(null);
  let pathNameArr = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [loading, setLoading] = useState(false);

  const [checkAll, setCheckAll] = useState<boolean>(false);

  useEffect(() => {
    if (Number.isInteger(parseInt(id))) {
      getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetail = async () => {
    const data = await PermissionApi.detail(id);
    setDetail(data);
  };

  const handleNewCheckedList = (newCheckedList: any) => {
    setCheckedList(newCheckedList);
    setCheckAll(isCheckedChecboxCheckAll(newCheckedList));
  };
  const isCheckedChecboxCheckAll = (detailPermission: []) => {
    let optionsCount = 0;
    permissionCheckboxList.map((item: IPermissionDetail) => {
      item?.child?.map((itemChild) => {
        optionsCount += itemChild?.options?.length || 0;
      });
    });
    return optionsCount === detailPermission.length;
  };
  const handleCheckboxCheckAll = (e: CheckboxChangeEvent) => {
    let checked: CheckboxValueType[] = [];
    if (e.target.checked) {
      permissionCheckboxList.map((item: IPermissionDetail) => {
        item?.child?.map((itemChild) => {
          itemChild?.options?.map((op) => {
            checked.push(op.value);
          });
        });
      });
    }
    setCheckedList(checked);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (detail) {
      form.setFieldsValue(detail);
      setCheckedList(detail.permission);
      setCheckAll(isCheckedChecboxCheckAll(detail.permission));
    } else {
      form.setFieldsValue({});
      setCheckedList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const handleSavePermission = async () => {
    setLoading(true);
    const formValue = form.getFieldsValue();
    form
      .validateFields()
      .then(async () => {
        if (detail) {
          const { success, data } = await PermissionApi.update(detail.id, {
            ...formValue,
            permission: checkedList,
          });
          if (success) {
            notification.success({
              message: 'C???p nh???t ph??n quy???n th??nh c??ng!',
            });
          } else {
            notification.error({
              message: data.message,
            });
          }
        } else {
          const { success, data } = await PermissionApi.create({
            ...formValue,
            permission: checkedList,
          });
          if (success) {
            notification.success({
              message: 'T???o ph??n quy???n th??nh c??ng!',
            });
          } else {
            notification.error({
              message: data.message,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[26px] flex-wrap">
        <div className="flex gap-[16px]">
          <div className='cursor-pointer' onClick={() => (window.location.href = '/permission')}>
            <Icon icon="back1" size={36} />
          </div>
          <div>
            <TitlePage title="Chi ti???t ph??n quy???n" />
            <div className="text-[#1D1C2D] mt-[8px]">
              Qu???n l?? ng?????i d??ng / Ph??n quy???n / Chi ti???t
            </div>
          </div>
        </div>

        <div className="flex gap-[8px] flex-wrap">
          {/* <Button
                        variant="outlined"
                        icon={<Icon icon="trash" size={24} />}
                    >
                        <span className="text-[#EF4444] ">X??a</span>
                    </Button> */}

          <Button
            variant="secondary"
            width={151}
            color="white"
            loading={loading}
            onClick={handleSavePermission}
          >
            L??U (F12)
          </Button>
        </div>
      </div>

      <Form form={form}>
        <div className="card__custom mb-[12px]">
          <div className="flex gap-[16px]">
            <div className="group__ip w-[50%]">
              <div className="color-[#5F5E6B]">T??n ch???c v??? *</div>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'T??n ch???c v??? l?? b???t bu???c!',
                  },
                ]}
              >
                <Input placeholder="Nh???p t??n ch???c v???" required={true} />
              </Form.Item>
            </div>
            <div className="group__ip flex-1">
              <div className="color-[#5F5E6B]">Ghi ch??</div>
              <Form.Item name="note">
                <TextArea rows={4} placeholder="Nh???p ghi ch??" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="card__custom">
          <div className="flex items-center justify-between mb-[26px]">
            <div className="color-[#2E2D3D] font-semibold text-[16px]">
              Ph??n quy???n chi ti???t
            </div>
            <div className="text-[14px] font-medium color-[#5F5E6B] mt-[-5px]">
              <Checkbox
                onChange={(e: CheckboxChangeEvent) => handleCheckboxCheckAll(e)}
                checked={checkAll}
              >
                To??n quy???n h??? th???ng
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
  );
};

export default PermissionDetail;
