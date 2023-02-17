import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import classNames from 'classnames';
import React, { useEffect, useState, useRef } from "react";
import Icon from "../../../components/Icon/Icon";
import { IOption, IPermissionDetail } from "../../../types/permission";

interface TogglePermissionProps {
  className?: string;
  item: IPermissionDetail;
  defaultCheckedList: CheckboxValueType[];
  isCheckAll?: boolean;
  onHandleNewCheckedList: React.Dispatch<
    React.SetStateAction<CheckboxValueType[]>
  >;
}

const TogglePermission = (props: TogglePermissionProps) => {
  const {
    className,
    item,
    defaultCheckedList,
    isCheckAll = false,
    onHandleNewCheckedList,
  } = props;

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [openContent, setOpenContent] = useState<boolean>(true);

  const optionsList = () => {
    let optionArr: CheckboxValueType[] = [];
    item?.child?.map((item) => {
      item?.options?.map((child) => {
        optionArr.push(child?.value);
      });
    });
    return optionArr;
  };

  useEffect(() => {
    setCheckedList(defaultCheckedList);
  }, [defaultCheckedList]);

  useEffect(() => {
    setCheckAll(isCheckAll);
  }, [isCheckAll]);

  const isGroupCheckAll = (item: IPermissionDetail) => {
    let result = true;
    item?.child?.map((itemChild) => {
      itemChild?.options?.map((option) => {
        let checkExist = checkedList.indexOf(option?.value);
        if (checkExist === -1) {
          result = false;
          return result;
        }
      });
    });
    return result;
  };

  const onChangeItemGroup = (e: CheckboxChangeEvent, val: IOption) => {
    let checked = [...checkedList];
    let checkExist = checked.indexOf(val?.value);
    if (checkExist === -1) {
      checked.push(val?.value);
    } else {
      checked.splice(checkExist, 1);
    }
    setCheckedList(checked);
    onHandleNewCheckedList(checked);
    setIndeterminate(
      !!checked.length && checked.length < optionsList()?.length
    );
    setCheckAll(checked.length === optionsList()?.length);
  };

  const onCheckAllChange = (
    e: CheckboxChangeEvent,
    item: IPermissionDetail
  ) => {
    let checked = [...checkedList];
    item?.child?.map((itemChild) => {
      itemChild?.options?.map((op) => {
        let checkExist = checked.indexOf(op.value);
        if (checkExist === -1) {
          checked.push(op.value);
        } else {
          if (!e.target.checked) {
            checked.splice(checkExist, 1);
          }
        }
      });
    });
    setCheckedList(checked);
    onHandleNewCheckedList(checked);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="toggle__permission__component">
      <div className="toggle__header flex items-center justify-between">
        <div className="p-[14px]">
          <Checkbox
            indeterminate={indeterminate}
            onChange={(e) => onCheckAllChange(e, item)}
            checked={isGroupCheckAll(item)}
          >
            <span className="text-[16px] font-semibold color-[#2E2D3D]">
              {item?.parent?.label}
            </span>
          </Checkbox>
        </div>
        <div
          className="flex-1 flex items-center justify-end p-[14px] pointer"
          onClick={() => setOpenContent(!openContent)}
        >
          <Icon
            icon="arrow-down-1"
            size={24}
            className={classNames({ "rotate-180": openContent })}
          />
        </div>
      </div>

      {openContent && (
        <div className="toggle__content">
          <div className="check__box__childs">
            {item?.child?.map((itemChild, index) => {
              return (
                <div
                  key={itemChild?.groupOption?.value}
                  className="check__box__childs"
                >
                  <div className="text-[14px] mb-[18px] font-semibold color-[#2E2D3D]">
                    {itemChild?.groupOption?.label}
                  </div>
                  <div className="grid__columns__permission">
                    {itemChild?.options?.map((op) => {
                      return (
                        <Checkbox
                          key={op?.value}
                          onChange={(e) => onChangeItemGroup(e, op)}
                          checked={checkedList.includes(op?.value)}
                        >
                          {op?.label}
                        </Checkbox>
                      );
                    })}
                  </div>
                  {index < item?.child?.length - 1 && (
                    <hr className="mt-[20px] mb-[18px]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TogglePermission;
