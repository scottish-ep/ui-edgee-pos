import { Form } from 'antd';
import DateRangePickerCustom from 'components/DateRangePicker/DateRangePickerCustom';
import Button from '../../../../components/Button/Button';
import { useState } from 'react';
import Icon from '../../../../components/Icon/Icon';
import Input from '../../../../components/Input/Input';
import { warehouses } from 'const/constant';
import Select from 'components/Select/Select';
import Upload from 'components/Upload/Upload';
import Image from 'next/image';
import TitlePage from '../../../../components/TitlePage/Titlepage';
import styles from 'styles/Promotion.module.css';
import classNames from 'classnames';
interface PromotionOnApp {
  detail?: any;
}

const PromotionOnAppForm = (props: PromotionOnApp) => {
  const { detail } = props;
  const [activeClass, setActiveClass] = useState(false);
  const [activeLang, setActiveLang] = useState(true);
  const [activeSecondLang, setActiveSecondLang] = useState(false)
  let data = {
    name: 'test',
    code: '123',
  };
  const PrefixInput = () => (
    <div className="flex justify-end">
      <span
        className={classNames(
          'text-xs font-medium',
          styles.lang_type,
          activeLang == true ? styles.active_lang : ''
        )}
        onClick={() => setActiveLang(!activeLang)}
      >
        Tiếng Việt
      </span>
      <span
        className={classNames(
          'text-xs font-medium',
          styles.lang_type,
          activeLang == false ? styles.active_lang : ''
        )}
        onClick={() => setActiveLang(!activeLang)}
      >
        English
      </span>
    </div>
  );


  const PrefixSecondInput = () => (
    <div className="flex justify-end">
      <span
        className={classNames(
          'text-xs font-medium',
          styles.lang_type,
          activeLang == true ? styles.active_lang : ''
        )}
        onClick={() => setActiveSecondLang(!activeSecondLang)}
      >
        Tiếng Việt
      </span>
      <span
        className={classNames(
          'text-xs font-medium',
          styles.lang_type,
          activeLang == false ? styles.active_lang : ''
        )}
        onClick={() => setActiveSecondLang(!activeSecondLang)}
      >
        English
      </span>
    </div>
  );
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

  
  const [form] = Form.useForm();
  console.log('form', form.getFieldsValue());
  return (
    <Form form={form}>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[12px]">
          <TitlePage
            title={detail ? 'Chi tiết mã khuyến mãi' : 'Tạo mã khuyến mãi'}
            href="/promotions/promotion-on-app"
          />
          <div className="flex justify-between items-center gap-[8px]">
            <Button
              width={134}
              variant="outlined"
              prefixIcon={<Icon icon="trash" size={24} />}
            >
              Xoá
            </Button>

            <Button
              variant="secondary"
              width={148}
              style={{ fontWeight: 'bold' }}
              // onClick={handleSavePromotion}
            >
              LƯU (F12)
            </Button>
          </div>
        </div>
        <div className="flex justify-between flex-wrap bg-[#fff] p-[12px]">
          <div className="col_left">
            <div className="flex flex-col mb-[16px]">
              <span className="text-sm font-medium text-[#1D1C2D]">
                TÊN KHUYẾN MÃI
              </span>
              <PrefixInput />
              {/* <div className="flex justify-end gap-[8px]">
                <span className="text-xs font-medium">Tiếng Việt</span>
                <span className="text-xs font-medium">English</span>
              </div> */}
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Input width={700} />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
                ẢNH HIỂN THỊ{' '}
                <span className="font-normal text-[#4B4B59]">
                  (120 x 120 px)
                </span>
              </span>
              <Form.Item name="img">
                <Upload>
                  {/* {detail.img ? (
                    <Image
                      src={detail.img}
                      alt="avatar"
                      style={{
                        width: 80,
                        height: 80,
                      }}
                    />
                  ) : (
                    <div className="overflow-hidden">
                      <Image
                        src={require('public/yellow-star.svg')}
                        width={80}
                        height={80}
                        alt=""
                      />
                    </div>
                  )} */}
                </Upload>
              </Form.Item>
            </div>
          </div>
          <div className="col_right">
            <div className="flex flex-col mb-[16px]">
              <span className="text-sm font-medium text-[#1D1C2D] mb-[15px]">
                MÃ KHUYẾN MÃI
              </span>
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <Input width={700} />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
                THỜI GIAN ÁP DỤNG
              </span>
              <Form.Item
                name="time"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống',
                  },
                ]}
              >
                <DateRangePickerCustom
                  width={250}
                  suffixIcon={<Icon icon="calendar1" size={24} />}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className={styles.item_wrapper}>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              ĐỐI TƯỢNG ÁP DỤNG
            </span>
            <Form.Item name="applicant_object">
              <Select showArrow width={418} options={warehouses} />
            </Form.Item>
          </div>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              PHƯƠNG THỨC THANH TOÁN
            </span>
            <Form.Item name="applicant_object">
              <Select showArrow width={418} options={warehouses} />
            </Form.Item>
          </div>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              PHÂN LOẠI KHUYẾN MÃI
            </span>
            <Form.Item name="applicant_object">
              <Select showArrow width={418} options={warehouses} />
            </Form.Item>
          </div>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              GIÁ TRỊ GIẢM
            </span>
            <Form.Item name="applicant_object">
              <Input
                width={418}
                suffix={<SuffixInput />}
                // suffix={"d"; <}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              GIÁ TRỊ ĐƠN HÀNG TỐI THIỂU
            </span>
            <Form.Item name="minimum_value">
              <Input width={418} suffix={'d'} />
            </Form.Item>
          </div>
          <div className="flex flex-col mb-[12px]">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              GIẢM TỐI ĐA
            </span>
            <Form.Item name="maximum_value">
              <Input width={418} suffix={'d'} />
            </Form.Item>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm font-medium text-[#1D1C2D] mb-[12px]">
              NỘI DUNG KHUYẾN MÃI
            </span>
            <PrefixSecondInput />
            {/* <div className=" gap-[8px] flex justify-end flex-1">
              <span className="text-xs font-medium">Tiếng Việt</span>
              <span className="text-xs font-medium">English</span>
            </div> */}
            <Form.Item
              name="note"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-col mb-[12px]"></div>
      </div>
    </Form>
  );
};

export default PromotionOnAppForm;
