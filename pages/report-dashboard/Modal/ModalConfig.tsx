import React, { ReactNode, useState } from 'react';
import Modal from 'components/Modal/Modal/Modal';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import { orderStatus } from 'const/constant';
interface ModalConfigProps {
  detail?: boolean;
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  method?: string;
  id?: string;
  data?: any;
}

const ModalConfig = (props: ModalConfigProps) => {
  const {
    detail,
    isVisible,
    title,
    iconClose,
    onClose,
    onOpen,
    content,
    method,
    id,
    data,
  } = props;

  const statusCountOrderList = [
    {
      label: 'Tạo mới',
      value: 1,
    },
    {
      label: 'Update',
      value: 2,
    },
  ];

  const roleApplyRevenueList = [
    {
      label: 'Nhân viên tạo đơn',
      value: 1,
    },
    {
      label: 'Test',
      value: 2,
    },
  ];

  const statusCountRevenueList = [
    {
      label: 'Đang gửi hàng',
      value: 1,
    },
    {
      label: 'đã nhận hàng',
      value: 2,
    },
    {
      label: 'Đã trả hàng',
      value: 3,
    },
  ];

  const [statusCountOrder, setStatusCountOrder] = useState(
    statusCountOrderList[0].value
  );
  const [roleApplyRevenue, setRoleApplyRevenue] = useState(
    roleApplyRevenueList[0].value
  );
  const [statusCountRevenue, setStatusCountRevenue] = useState([
    statusCountRevenueList[0].value,
  ]);
  const [statusLockRevenue, setStatusLockRevenue] = useState(
    orderStatus[0].value
  );

  const saveData = {
    status_count_order: statusCountOrder,
    role_apply_revenue: roleApplyRevenue,
    status_count_revenue: statusCountRevenue,
    status_lock_revenue: statusLockRevenue,
  };

  const handleChangeValue = (label: string, value: string) => {
    setStatusCountRevenue({ ...statusCountRevenue, [label]: value });
  };

  const Footer = () => (
    <div className="flex justify-between">
      <Button variant="outlined" text="HUỶ BỎ" width="48%" onClick={onClose} />
      <Button
        variant="secondary"
        text="LƯU (F12)"
        width="48%"
        onClick={() => console.log('saveData', saveData)}
      />
    </div>
  );

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onClose}
      onOpen={onOpen}
      iconClose={iconClose}
      width={658}
      footer={<Footer />}
      className="px-[16px] py-[12px]"
    >
      <div className="mb-[24px] flex justify-start flex-col">
        <div className="flex flex-col w-[100%]">
          <div className="flex justify-between items-center mb-[24px] w-[100%]">
            <div className=" items-center flex justify-between w-max gap-[10px]">
              <span className="rounded-[50%] bg-[#384ADC] w-[8px] h-[8px]"></span>
              <div className="text-[#2E2D3D] font-medium text-sm">
                Thời điểm tính đơn chốt:{' '}
              </div>
            </div>
            <Select
              width={248}
              showArrow
              // disabled={true}
              defaultValue={statusCountOrderList[0]}
              options={statusCountOrderList}
              onChange={(e: any) => setStatusCountOrder(e)}
            />
          </div>
          <div className="flex justify-between items-center mb-[24px] w-[100%]">
            <div className=" items-center flex justify-between w-max gap-[10px]">
              <span className="rounded-[50%] bg-[#384ADC] w-[8px] h-[8px]"></span>
              <div className="text-[#2E2D3D] font-medium text-sm">
                Doanh thu + doanh số được chốt cho:{' '}
              </div>
            </div>
            <Select
              width={248}
              showArrow
              disabled={true}
              defaultValue={roleApplyRevenueList[0]}
              options={roleApplyRevenueList}
              onChange={(e: any) => setRoleApplyRevenue(e)}
            />
          </div>
          <div className="flex justify-between items-center mb-[24px] w-[100%]">
            <div className=" items-center flex justify-between w-max gap-[10px]">
              <span className="rounded-[50%] bg-[#384ADC] w-[8px] h-[8px]"></span>
              <div className="text-[#2E2D3D] font-medium text-sm">
                Thời điểm tính doanh thu + doanh số :{' '}
              </div>
            </div>
            <Select
              width={248}
              showArrow
              // disabled={true}
              mode="multiple"
              maxTagCount="responsive"
              defaultValue={statusCountRevenueList[0]}
              options={statusCountRevenueList}
              onChange={(e) => handleChangeValue('status_count_revenue', e)}
            />
          </div>
          <div className="flex justify-between items-center mb-[24px] w-[100%]">
            <div className=" items-center flex justify-between w-max gap-[10px]">
              <span className="rounded-[50%] bg-[#384ADC] w-[8px] h-[8px]"></span>
              <div className="text-[#2E2D3D] font-medium text-sm">
                Thời điểm chốt doanh thu + doanh số :{' '}
              </div>
            </div>
            <Select
              width={248}
              showArrow
              // disabled={true}
              defaultValue={orderStatus[0]}
              options={orderStatus}
              onChange={(e: any) => setStatusLockRevenue(e)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfig;
