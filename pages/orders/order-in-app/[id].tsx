import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import Icon from 'components/Icon/Icon';
import Tabs from 'components/Tabs';
import { ColumnsType } from 'antd/es/table';
import { warehouses } from 'const/constant';
import { Table, Divider, Space, InputRef } from 'antd';
import { useState, useRef } from 'react';
import Input from 'components/Input/Input';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import TitlePage from 'components/TitlePage/Titlepage';
import styles from 'styles/DetailOrder.module.css';
import classNames from 'classnames';
import { LevelCustomer } from 'enums/enums';
import TextArea from 'components/TextArea';

interface OrderInAppDetailProps {
  detail?: any;
}

const OrderInAppDetail = (props: OrderInAppDetailProps) => {
  const { detail } = props;

  let index = 0;
  const [activeClass, setActiveClass] = useState(false);
  const [noteActive, setNoteActive] = useState(false);
  const [items, setItems] = useState(['Kho 1', 'Kho 2']);
  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState('');
  const addItem = (e: any) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const handleChangeTab = (e: any) => {
    // if (e) {
    //   const tabSelect: any = orderStatus.find((item) => item.label === e);
    //   setFilter({
    //     ...filter,
    //     order_status_id: tabSelect.value,
    //   });
    // } else {
    //   setFilter({
    //     ...filter,
    //     order_status_id: '',
    //   });
    // }
  };
  const onNameChange = (e: any) => {};
  const [tabStatus, setTabStatus] = useState([
    { name: 'Đơn mới #1266' },
    { name: 'Đơn mới #1266' },
    { name: 'Đơn mới #1266' },
  ]);

  const logisticBrand = [
    {
      label: 'Ninajvan',
      value: 'ninajvan',
    },
    {
      label: 'ViettelPost',
      value: 'viettelpost',
    },
  ];

  const productDiscount = [
    {
      label: 'CK 100%: 0',
      value: '100%',
    },
    {
      label: 'CK 100%: 0',
      value: '100%',
    },
  ];

  const renderLevel = (level?: string) => {
    switch (level) {
      case LevelCustomer.NEW_CLIENT:
        return <div className="font-semibold text-[#0EA5E9]">KH mới</div>;
      case LevelCustomer.GOLD:
        return <div className="font-semibold text-[#EAB308]">Vàng</div>;
      case LevelCustomer.SILVER:
        return <div className="font-semibold text-[#5F5E6B[">Bạc</div>;
      case LevelCustomer.BRONZE:
        return <div className="font-semibold text-[#F97316]">Đồng</div>;
      default:
        return <div></div>;
    }
  };

  const info = {
    name: 'Ly Tran',
    address: '2/222 Le Van Hung, Phuong 9, Quan 12, TP Ho Chi Minh',
    phone: '01220101',
    sex: 'female',
    total_receive: 10000,
    level: LevelCustomer.GOLD,
    last_buy: '11/29/2022, 20:28',
    order_print: 5,
    order_receive: 0,
    order_refund: 0,
    order_refund_partial: 1,
  };

  const statusList = [
    {
      label: 'Da in',
      value: 'printed',
    },
    {
      label: 'Da in',
      value: 'printed',
    },
    {
      label: 'Da in',
      value: 'printed',
    },
  ];

  const SuffixInput = () => (
    <div className="flex gap-[5px]">
      <div
        className={classNames(
          styles.input_type,
          activeClass == true ? styles.active : ''
        )}
        onClick={() => setActiveClass(!activeClass)}
      >
        %
      </div>
      <div
        className={classNames(
          styles.input_type,
          activeClass == false ? styles.active : ''
        )}
        onClick={() => setActiveClass(!activeClass)}
      >
        đ
      </div>
    </div>
  );

  const data = Array(5)
    .fill({
      name: 'Gel dưỡng da Bania Soothing | SWLD BANIA SOOTHING GEL | Gel Tomato',
      price: 10000,
      amount: 1,
      total_price: 10000,
      sale_price: 550,
    })
    .map((item, index) => ({ ...item, id: index++ }));

  const columns: ColumnsType<any> = [
    {
      title: 'Mã sản phẩm',
      width: 194,
      key: 'id',
      align: 'left',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.id}</div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      width: 350,
      key: 'name',
      align: 'left',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">{record.name}</div>
      ),
    },
    {
      title: 'Giá',
      width: 100,
      key: 'price',
      align: 'left',
      render: (_, record) => {
        return (
          <div className="text-[#4b4b59] text-sm font-medium">
            {record.sale_price ? (
              <div>
                <span className="line-through">{record.price} đ</span>
                <br></br>
                <span>{record.sale_price} đ</span>
              </div>
            ) : (
              <span>{record.price} đ</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'SL',
      width: 152,
      key: 'amount',
      align: 'left',
      render: (_, record) => (
        <Input width={87} value={record.amount ? record.amount : null} />
      ),
    },
    {
      title: 'Thành tiền',
      width: 126,
      key: 'total_price',
      align: 'center',
      render: (_, record) => (
        <div className="text-[#4b4b59] text-sm font-medium">
          {record.total_price.toLocaleString()} đ
        </div>
      ),
    },
    {
      title: ' ',
      width: 40,
      key: 'delete',
      align: 'center',
      render: (_, record) => <Icon size={20} icon="delete1" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[24px]">
        <TitlePage title="Tạo đơn hàng" />
        <div className="flex justify-between items-center gap-[20px]">
          <div className="flex justify-start gap-[10px] items-center">
            Chọn kho
            <Select
              placeholder="--chọn kho--"
              showSearch
              options={warehouses}
              width={300}
            />
          </div>
          <Button
            variant="no-outlined"
            width={62}
            color="white"
            icon={<Icon icon="question" size={16} />}
          >
            <a
              href="https://docs.google.com/document/d/1wXPHowLeFIU6q-iXi-ryM56m7GuLahu4FFxsNPzJXYw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hỗ trợ
            </a>
          </Button>
        </div>
      </div>

      <Tabs
        showTabAll={false}
        tabs={tabStatus}
        onClick={(e) => handleChangeTab(e)}
      />
      {/* <div className={styles.tab_cell}>
        <Icon icon="add" size={46} />
      </div> */}
      <div className={styles.table_wrapper}>
        <div
          className={classNames(
            'flex flex-col max-w-[903px] col-left',
            styles.divide
          )}
        >
          <div className="flex flex-row items-center gap-[15px] mb-[8px]">
            <div className="text-[#384adc] text-sm font-semibold">Giỏ hàng</div>
            <Input
              width={700}
              placeholder="Nhập tên sản phẩm/ mã sản phẩm/ code..."
            />
            <Checkbox>Còn hàng</Checkbox>
          </div>
          <div className={styles.table_type_1}>
            <Table columns={columns} dataSource={data} />
            <div className="bg-[#cfe1ff] p-[8px] text-left flex flex-row mb-[24px]">
              <div className="w-[254px]">
                <span className="text-[#333333] text-sm font-semibold">
                  Số sản phẩm SP:
                </span>
                <span className="text-[#384adc] text-sm font-semibold"> 1</span>
              </div>
              <div className="w-[254px]">
                <span className="text-[#333333] text-sm font-semibold">
                  Tổng số:
                </span>
                <span className="text-[#384adc] text-sm font-semibold"> 1</span>
              </div>
              <div className="w-[254px]">
                <span className="text-[#333333] text-sm font-semibold">
                  Trọng lượng SP:
                </span>
                <span className="text-[#384adc] text-sm font-semibold"> 1</span>
                <span className="text-[#333333] text-sm font-semibold">
                  {' '}
                  kg
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-[10px]">
            <div className="flex flex-col w-[48%]">
              <div className="flex justify-between items-center">
                <span className="text-[#333333] text-sm font-medium gap-[5px]">
                  Đơn vị vận chuyển
                </span>
                <Select
                  width={287}
                  showArrow
                  showSearch
                  options={logisticBrand}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333] text-sm font-medium gap-[5px]">
                  Phí vận chuyển
                </span>
                <Select
                  width={287}
                  showArrow
                  showSearch
                  options={logisticBrand}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333] text-sm font-medium gap-[5px]">
                  Chiết khấu sản phẩm
                </span>
                <Input
                  width={287}
                  suffix={<SuffixInput />}
                  // suffix={"d"; <}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333] text-sm font-medium gap-[5px]">
                  Tiền chuyển khoản
                </span>
                <Input
                  width={287}
                  suffix="đ"
                  defaultValue="0"
                  placeholder="Nhập"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333] text-sm font-medium gap-[5px]">
                  Tiền thu khác <br></br>
                  <span className="text-[#f97316] text-sm- font-medium">
                    260,000 đ
                  </span>
                </span>
                <Input
                  width={287}
                  suffix="đ"
                  defaultValue="0"
                  placeholder="Nhập"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[25px] mt-[10px] w-[48%]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">
                  TỔNG SỐ TIỀN + PHÍ SHIP
                </span>
                <span className="text-sm font-medium text-[#384adc]">
                  180,000 đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">CHIẾT KHẤU</span>
                <span className="text-sm font-medium ">0 đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">SAU CHIẾT KHẤU</span>
                <span className="text-sm font-medium ">180,000 đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">CẦN THANH TOÁN</span>
                <span className="text-sm font-medium ">180,000 đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">ĐÃ THANH TOÁN</span>
                <span className="text-sm font-medium ">180,000 đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-base">
                  THANH TOÁN KHI NHẬN HÀNG
                </span>
                <span className="text-sm font-medium text-[#f97316]">
                  180,000 đ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col col-right overflow-hidden pl-[12px] w-[35%]">
          <div className="overflow-auto">
            <div className="flex justify-between flex-wrap gap-[10px]">
              <div className="w-[48%]">
                <span className="text-[#5F5E6B] text-sm font-semibold">
                  Tạo lúc:
                </span>
                <span className="text-[#5F5E6B] text-sm font-medium">
                  {' '}
                  20/02/2023 - 22:57
                </span>
              </div>
              <div className="w-[48%]">
                <span className="text-[#5F5E6B] text-sm font-semibold">
                  Mã ĐH:
                </span>
                <span className="text-[#384adc] text-sm font-medium">
                  {' '}
                  ORD6908678
                </span>
              </div>
              <div className="w-[48%]">
                <span className="text-[#5F5E6B] text-sm font-semibold">
                  NVBH:
                </span>
                <span className="text-[#5F5E6B] text-sm font-medium">
                  {' '}
                  Bach Hoa Viet
                </span>
              </div>
              <div className="w-[48%] flex">
                <Icon size={20} icon="calendar1" />
                <span className="ml-[5px] text-[#384adc] text-sm font-medium">
                  {' '}
                  Lịch sử cập nhật đơn hàng
                </span>
              </div>
            </div>
            <Input
              label="Mã vận đơn"
              style={{ width: '100%' }}
              className="mt-[5px]"
              value="123123"
            />
            <div className="flex justify-start items-center gap-[10px] mb-[16px]">
              <Icon size={24} icon="redflag" />
              <span className="text-sm font-medium text-[#EF4444]">
                Báo lỗi NV
              </span>
            </div>
            <div className="">
              Trạng thái
              <Select
                showArrow
                showSearch
                options={statusList}
                width={300}
                defaultValue={statusList[0]}
              />
            </div>
            <div className={styles.line}></div>
            <div className="mt-[16px]">
              <span className="text-[#384adc] font-medium mb-[16px]">
                Khách hàng
              </span>
              <div className="flex justify-between my-[12px]">
                <Input
                  prefix={<Icon size={20} icon="user-solid" />}
                  value={info.name}
                  width={234}
                />
                <Input
                  prefix={<Icon size={20} icon="call" />}
                  value={info.phone}
                  width={234}
                />
              </div>
              <div
                className={classNames(
                  'flex flex-col mb-[12px]',
                  styles.info_wrapper
                )}
              >
                {/* <Image src={info.sex === "male" ? require("/public/male.png") : ""}> */}
                <div className="flex flex-wrap flex-row justify-between">
                  <span className="font-medium text-base">{info.name}</span>
                  <span className="font-medium text-base">{info.phone}</span>
                  <Icon size={20} icon="delete1" />
                </div>
                <div>
                  <span className="font-normal text-sm">
                    Tổng tiền đơn đã nhận:
                  </span>
                  <span className="font-semibold text-sm">
                    {' '}
                    {info.total_receive} d
                  </span>
                </div>
                <div className="flex justify-start items-center ">
                  <span className="font-normal text-sm mr-[5px]">Cấp độ:</span>
                  {renderLevel('Vàng')}
                </div>
                <div>
                  <span className="font-normal text-sm">
                    Lần mua gần nhất:{' '}
                  </span>
                  <span className="font-medium text-sm">{info.last_buy}</span>
                </div>
                <div className="flex justify-start items-center gap-[10px]">
                  Số đơn đã
                  <span className="text-sm font-normal text-[#384adc]">
                    In:{' '}
                  </span>
                  <span className="text-sm font-medium text-[#384adc]">
                    {info.order_print}
                  </span>
                  <span className="text-sm font-normal text-[#10b981]">
                    Nhận:{' '}
                  </span>
                  <span className="text-sm font-medium text-[#10b981]">
                    {info.order_receive}
                  </span>
                  <span className="text-sm font-normal text-[#f97316]">
                    Hoàn:
                  </span>
                  <span className="text-sm font-medium text-[#f97316]">
                    {info.order_refund}
                  </span>
                  <span className="text-sm font-normal text-[#8b5cf6]">
                    Hoàn 1 phần:{' '}
                  </span>
                  <span className="text-sm font-medium text-[#8b5cf6]">
                    {info.order_refund_partial}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-[16px]">
                <span className="text-base font-medium">Thẻ</span>
                <Select
                  style={{ width: 231 }}
                  placeholder="Gắn thẻ"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Button
                          type="text"
                          icon={<Icon icon="add" size={24} />}
                          // onClick={addItem}
                        />
                        <Input
                          placeholder="Nhập tên thẻ và nhấn enter"
                          ref={inputRef}
                          // value={name}
                          onChange={onNameChange}
                        />
                      </Space>
                    </>
                  )}
                  options={items.map((item) => ({ label: item, value: item }))}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center  mb-[16px]">
                  <span className="font-medium text-base">
                    Địa chỉ nhận hàng
                  </span>
                  <span className="font medium text-base text-[#384adc]">
                    Thay đổi
                  </span>
                </div>
                <div className={styles.address_wrapper}>
                  <Icon size={24} icon="truct" />
                  <div className="flex flex-col justify-start">
                    <div>
                      <span className="font-medium text-sm">{info.name}</span>
                      <span className={styles.line_vertical}></span>
                      <span className="font-medium text-sm">{info.phone}</span>
                    </div>
                    <div className="font-normal text-sm">{info.address}</div>
                  </div>
                </div>
                <div className="flex justify-between mt-[16px]">
                  <div className="flex justify-start gap-[10px] mb-[12px]">
                    <Icon size={20} icon="calendar1" />
                    <span className="font-medium text-base ">Ghi chú</span>
                  </div>
                  <div className="flex justify-end gap-[20px] mb-[16px]">
                    <span
                      className={classNames(
                        styles.note_item,
                        noteActive === false ? styles.note_active : ''
                      )}
                      onClick={() => setNoteActive(!noteActive)}
                    >
                      Để in
                    </span>
                    <span
                      className={classNames(
                        styles.note_item,
                        noteActive === true ? styles.note_active : ''
                      )}
                      onClick={() => setNoteActive(!noteActive)}
                    >
                      Nội bộ
                    </span>
                  </div>
                </div>
                <TextArea
                  placeholder="Nhập ghi chú để in"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-[15px] mt-[16px]">
            <Button
              variant="secondary"
              width={120}
              style={{ height: '54px' }}
              className="text-[20px]"
            >
              {' '}
              LƯU (F2)
            </Button>
            <Button
              variant="secondary"
              width={120}
              style={{ height: '54px' }}
              className="text-[20px]"
            >
              {' '}
              IN (F12)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInAppDetail;
