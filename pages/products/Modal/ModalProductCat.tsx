import Checkbox from 'antd/lib/checkbox/Checkbox';
import SelectInput from 'components/SelectInput/SelectInput';
import { ReactNode, useState } from 'react';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal/Modal';
import Select from '../../../components/Select/Select';
import TabsVerticle from '../../../components/TabsVerticle/Index';
import { isArray } from '../../../utils/utils';
import { Form } from 'antd';

interface ModalProductCatProps {
  isVisible: boolean;
  title?: string;
  iconClose?: ReactNode;
  onClose?: (event?: any) => void;
  onOpen?: (event?: any) => void;
  content?: string | ReactNode;
  method?: string;
  id?: string;
  data?: any;
  tabStatus?: { name: string; count: number }[];
  tabData?: { name?: string; list?: { label?: string; value?: string }[] }[];
}
const ModalProductCat = (props: ModalProductCatProps) => {
  const {
    isVisible,
    title,
    iconClose = 'Đóng',
    onClose,
    onOpen,
    content,
    method,
    id,
    data,
    tabData,
    tabStatus,
  } = props;

  const [form] = Form.useForm();

  const [statusCheckList, setStatusCheckList] = useState<
    Array<string | number>
  >([]);
  const [amountCheckList, setAmountCheckList] = useState<
    Array<string | number>
  >([]);
  const [priceCheckList, setPriceCheckList] = useState<Array<string | number>>(
    []
  );
  const [productCheckList, setProductCheckList] = useState<
    Array<string | number>
  >([]);
  const [activeTabValue, setActiveTabValue] = useState<string>('1');

  const statusSettings: {
    label: string;
    value: string;
  }[] = [
    { label: 'Có thể bán', value: 'able_to_buy' },
    { label: 'Sắp hết hàng', value: 'out_of_stock_soon' },
    { label: 'Sắp hết hạn', value: 'out_of_date_soon' },
    { label: 'Hết hạn', value: 'out_of_date' },
    { label: 'Ẩn', value: 'hide' },
  ];
  const compareList: {
    label: string;
    value: string;
  }[] = [
    { label: 'Nhỏ hơn', value: 'smaller' },
    { label: 'Lớn hơn', value: 'bigger' },
    { label: 'Bằng nhau', value: 'equal' },
  ];
  const amountSettings: {
    label: string;
    value: string;
  }[] = [
    { label: 'Số lượng có thể bán', value: 'amount_able_to_buy' },
    { label: 'Tổng số lượng nhập', value: 'total_inport' },
  ];
  const priceSettings: {
    label: string;
    value: string;
  }[] = [{ label: 'Gia bán', value: 'price' }];
  const productSettings: {
    label: string;
    value: string;
    type: 'select' | 'select-input';
  }[] = [
    { label: 'Chọn kênh bán', value: 'choose_channel', type: 'select' },
    { label: 'Số mẫu mã', value: 'product_code', type: 'select-input' },
  ];
  const channelSettings: {
    label: string;
    value: string;
  }[] = [
    { label: 'Tại quầy', value: 'at_store' },
    { label: 'Online', value: 'online' },
    { label: 'App', value: 'app' },
  ];

  const handleSubmit = (value: any) => {
    onOpen && onOpen(value);
    form.resetFields();
  };

  const RenderComponent = () => {
    let list: Array<any> = [];
    if (activeTabValue === '1') {
      list = statusCheckList;
    } else if (activeTabValue === '2') {
      list = amountCheckList;
    } else if (activeTabValue === '3') {
      list = priceCheckList;
    } else {
      list = productCheckList;
    }

    return (
      <Form onFinish={handleSubmit} form={form} initialValues={data}>
        <div className="mb-[12px]">
          <div>
            {list === statusCheckList && (
              <div className="flex flex-col justify-start  ml-[14px]">
                {isArray(statusSettings) &&
                  statusSettings.map((item) => (
                    <Form.Item key={item.value} name="status_setting">
                      <Checkbox
                        className="w-[200px] m-0 no-mg-inline mb-[20px]"
                        value={item.value}
                      >
                        {item.label}
                      </Checkbox>
                    </Form.Item>
                  ))}
              </div>
            )}
            {list === amountCheckList && (
              <div className="">
                {isArray(amountSettings) &&
                  amountSettings.map((item) => (
                    <div
                      key={item.value}
                      className="flex justify-between items-center mb-[20px] ml-[14px]"
                    >
                      <Form.Item name="amount_setting_check">
                        <Checkbox
                          className="w-[200px] m-0 no-mg-inline "
                          value={item.value}
                        >
                          {item.label}
                        </Checkbox>
                      </Form.Item>
                      <Form.Item name="amount_setting_select">
                        <SelectInput
                          placeholder="Nhập số lượng"
                          selectWidth={111}
                          inputWidth={309}
                          compareList={compareList}
                          defaultValue={compareList[0].label}
                        />
                      </Form.Item>
                    </div>
                  ))}
              </div>
            )}
            {list === priceCheckList && (
              <div>
                {isArray(priceSettings) &&
                  priceSettings.map((item) => (
                    <div
                      key={item.value}
                      className="flex justify-between items-center mb-[20px] ml-[14px]"
                    >
                      <Form.Item name="price_setting_check">
                        <Checkbox
                          className="w-[200px] m-0 no-mg-inline "
                          value={item.value}
                        >
                          {item.label}
                        </Checkbox>
                      </Form.Item>
                      <Form.Item name="price_setting_select">
                        <SelectInput
                          placeholder="Nhập số lượng"
                          selectWidth={111}
                          inputWidth={309}
                          compareList={compareList}
                          defaultValue={compareList[0].label}
                        />
                      </Form.Item>
                    </div>
                  ))}
              </div>
            )}
            {list === productCheckList && (
              <div>
                {isArray(productSettings) &&
                  productSettings.map((item) => (
                    <div
                      key={item.value}
                      className="flex justify-between items-center ml-[14px]"
                    >
                      <Form.Item name="product_setting_check">
                        <Checkbox
                          className="w-[200px] m-0 no-mg-inline "
                          value={item.value}
                        >
                          {item.label}
                        </Checkbox>
                      </Form.Item>
                      <div>
                        <Form.Item name="select">
                        {item.type === 'select' ? (
                          <Select
                            width={420}
                            placeholder="Chọn"
                            options={channelSettings}
                            defaultValue={channelSettings[0]}
                          />
                        ) : (
                          <SelectInput
                            placeholder="Nhập số lượng"
                            selectWidth={111}
                            inputWidth={309}
                            compareList={compareList}
                            defaultValue={compareList[0].label}
                          />
                        )}
                        </Form.Item>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Form>
    );
  };

  const Footer = () => (
    <div className="flex justify-between w-full items-center">
      <div className="text-[#EF4444] cursor-pointer">Xoá bộ lọc (2)</div>
      <div className="flex justify-between w-[50%]">
        <Button
          variant="outlined"
          text="HUỶ BỎ"
          width="48%"
          onClick={onClose}
        />
        <Button
          variant="secondary"
          text="ÁP DỤNG"
          width="48%"
          onClick={() => {
            form.submit();
          }}
        />
      </div>
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
      width={945}
      className="p-[16px]"
      footer={<Footer />}
    >
      <div className="w-full flex flex-col">
        <div className="w-full flex gap-12px">
          <div className="w-[%] border__right">
            <TabsVerticle
              list={[
                {
                  value: '1',
                  label: 'Trạng thái',
                },
                {
                  value: '2',
                  label: 'Số lượng',
                },
                { value: '3', label: 'Giá bán' },
                {
                  value: '4',
                  label: 'Sản phẩm',
                },
              ]}
              defaultActiveValue="1"
              onTabChange={(value) => setActiveTabValue(value)}
            />
          </div>
          <div className="min-h-[448px]">
            <RenderComponent />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProductCat;
