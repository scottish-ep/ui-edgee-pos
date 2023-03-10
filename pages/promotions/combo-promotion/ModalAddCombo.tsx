import { Radio, Switch, Tag } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DateRangePicker/DateRangePicker';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/Input';
import Modal from '../../../components/Modal/Modal/Modal';
import Select from '../../../components/Select/Select';
import { ICombo, IProductOfCombo } from '../promotion.type';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { searchTypeList } from '../../../const/constant';
import ProductTable from './ProductTable';
import { IOption } from '../../../types/permission';
import { Form, notification, Spin } from 'antd';
import PromotionComboApi from '../../../services/promotion-combos';
import type { SelectProps } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';

interface ModalAddComboProps {
  selectWarehouseOptions: IOption[];
  isVisible: boolean;
  onClose: () => void;
  title: string;
  rowSelected?: ICombo;
  onRemove: () => void;
  handleSuccess: () => void;
}

const ModalAddCombo: React.FC<ModalAddComboProps> = (props) => {
  const {
    isVisible,
    title,
    onClose,
    rowSelected,
    onRemove,
    handleSuccess,
    selectWarehouseOptions,
  } = props;
  const [productList, setProductList] = useState<IProductOfCombo[]>([]);
  const [searchType, setSearchType] = useState('product');
  const [loading, setLoading] = useState(false);
  const [updatedKey, setUpdatedKey] = useState(0);

  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();

  const onCloseForm = () => {
    form.resetFields();
    setProductList([]);
    resetSearchData();
    initFields();
    onClose();
  };

  const initFields = useCallback(() => {
    const allWh = selectWarehouseOptions.reduce(
      (init: any, item: any) => [...init, item.id],
      []
    );
    form.setFieldsValue({
      channel: 'offline',
      status: false,
      date: [moment(), moment().add(7, 'd')],
      warehouse_ids: allWh,
    });
  }, [form, selectWarehouseOptions]);

  useEffect(() => {
    setProductList(rowSelected?.productList || []);
    initFields();
    if (rowSelected) {
      form.setFieldsValue({
        ...rowSelected,
        channel: rowSelected?.channel,
        status: rowSelected?.status,
        date: [moment(rowSelected?.start_date), moment(rowSelected?.end_date)],
        warehouse_ids: rowSelected?.warehouseList,
      });
    }
  }, [rowSelected, selectWarehouseOptions, form, initFields]);

  const [data, setData] = useState<SelectProps['options']>([]);
  const [value, setValue] = useState<string>();
  const [fetching, setFetching] = useState(false);

  const handleSearch = async (newValue: string) => {
    if (newValue) {
      setFetching(true);
      debounceSearchString(newValue);
      setFetching(false);
    } else {
      setData([]);
    }
  };

  const debounceSearchString = debounce(async (nextValue) => {
    if (nextValue !== '') {
      await handleFindSku(nextValue, searchType);
    }
  }, 500);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleFindSku = async (searchString: string, searchType: string) => {
    let formValue = form.getFieldsValue();
    const dataParams = {
      channel: formValue.channel,
      type: searchType === 'product' ? 'item' : 'item_sku',
      name: searchString,
    };
    const { data } = await PromotionComboApi.findSku(dataParams);
    setData(data);
  };

  const handleSelect = async (value: any) => {
    if (searchType === 'product') {
      let formValue = form.getFieldsValue();
      const dataParams = {
        channel: formValue.channel,
        type: 'item_chosen',
        name: value,
      };
      const dataSkuItemChosen = await PromotionComboApi.findSku(dataParams);
      let newProductList = productList;
      dataSkuItemChosen.data.map((item: any) => {
        const isExisted: any = productList.filter(
          (productItem: IProductOfCombo) =>
            productItem.item_relation_id === item.item_relation_id
        );
        if (isExisted.length === 0) {
          newProductList.push(item);
        } else {
          notification.error({
            message: 'S???n ph???m n??y ???? c?? trong combo!',
          });
        }
      });
      setProductList(newProductList);
      let newKey = Math.floor(Math.random() * 100);
      setUpdatedKey(newKey);
    } else {
      handleSelectItemSku(value);
    }
    resetSearchData();
  };

  const resetSearchData = () => {
    setValue(undefined);
    setData(undefined);
  };

  const handleSelectItemSku = (value: any) => {
    const newComboItem: any = data?.filter(
      (item) => item.item_relation_id == value
    );
    if (newComboItem && newComboItem.length > 0) {
      const isExisted: any = productList.filter(
        (item: IProductOfCombo) =>
          item.item_relation_id === newComboItem[0].item_relation_id
      );
      if (isExisted.length === 0) {
        productList.push(newComboItem[0]);
        setProductList(productList);
      } else {
        notification.error({
          message: 'S???n ph???m n??y ???? c?? trong combo!',
        });
      }
    }
  };

  const handleChangeChannel = () => {
    setProductList([]);
    resetSearchData();
  };

  const handleSaveCombo = async () => {
    setLoading(true);
    if (productList.length === 0) {
      notification.error({
        message: 'Vui l??ng th??m ??t nh???t 1 s???n ph???m',
      });
      setLoading(false);
      return;
    }

    let formValue = form.getFieldsValue();
    // validation end_date and status is ON
    const endDate = moment(formValue.date[1]);
    const status = formValue.status;
    if (status === true && endDate < moment()) {
      notification.error({
        message:
          'Combo ???? h???t h???n ??p d???ng. Vui l??ng ch???nh s???a th???i gian tr?????c khi b???t ??p d???ng',
      });
      setLoading(false);
      return;
    }

    form
      .validateFields()
      .then(async () => {
        formValue = {
          ...formValue,
          start_date: moment(formValue.date[0]).format('YYYY-MM-DD'),
          end_date: endDate.format('YYYY-MM-DD'),
        };
        const dataSend = {
          ...formValue,
          item_sku_ids: productList,
        };

        if (rowSelected) {
          const { data, success, message } =
            await PromotionComboApi.updatePromotionCombo(
              rowSelected.id,
              dataSend
            );
          if (success) {
            notification.success({
              message: 'C???p nh???t combo th??nh c??ng!',
            });
            handleSuccess();
          } else {
            notification.error({
              message,
            });
          }
        } else {
          const { data, success, message } =
            await PromotionComboApi.addPromotionCombo(dataSend);
          if (success) {
            notification.success({
              message: 'T???o combo th??nh c??ng!',
            });
            handleSuccess();
          } else {
            notification.error({
              message,
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

  const Footer = () => (
    <div className="flex justify-between flex-wrap">
      <div>
        {rowSelected && (
          <Button
            variant="danger-outlined"
            width={166}
            icon={<Icon icon="trash" size={24} />}
            onClick={onRemove}
          >
            X??a combo
          </Button>
        )}
      </div>
      <div className="flex gap-x-2 flex-wrap">
        <Button variant="outlined" width={267} onClick={onCloseForm}>
          HU??? B???
        </Button>
        <Button
          variant="secondary"
          width={267}
          onClick={handleSaveCombo}
          loading={loading}
        >
          L??U COMBO
        </Button>
      </div>
    </div>
  );

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Modal
      isCenterModal
      title={title}
      isVisible={isVisible}
      onClose={onCloseForm}
      iconClose="????ng"
      footer={<Footer />}
      width={1098}
    >
      <Form form={form} className="flex flex-col gap-y-3">
        <div className="flex gap-x-6 items-center">
          <span className="w-[180px] text-medium font-medium text-[#2E2D3D]">
            T??n combo*
          </span>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'T??n combo l?? b???t bu???c!',
              },
            ]}
          >
            <Input placeholder="Nh???p t??n combo" width={397} />
          </Form.Item>
        </div>
        <div className="flex gap-x-6 items-center">
          <div className="flex gap-x-2 items-center w-[180px]">
            <Form.Item name="status" valuePropName="checked">
              <Switch className="button-switch" />
            </Form.Item>
            <span className="text-medium font-medium text-[#2E2D3D]">
              Th???i gian ??p d???ng
            </span>
          </div>
          <Form.Item
            name="date"
            rules={[
              {
                required: true,
                message: 'Th???i gian combo l?? b???t bu???c!',
              },
            ]}
          >
            <DatePicker
              width={397}
              placeholder={['Ng??y/th??ng/n??m - ', 'Ng??y th??ng/n??m']}
              format={dateFormat}
            />
          </Form.Item>
        </div>
        <div className="flex gap-x-6 items-center">
          <span className="w-[180px] text-medium font-medium text-[#2E2D3D]">
            Ch???n kho
          </span>
          <Form.Item name="warehouse_ids">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              width={397}
              options={selectWarehouseOptions}
            />
          </Form.Item>
        </div>
        <div className="flex gap-x-6 items-center h-[45px]">
          <span className="w-[180px] text-medium font-medium text-[#2E2D3D]">
            Ch???n k??nh ??p d???ng
          </span>
          <Form.Item name="channel">
            <Radio.Group onChange={handleChangeChannel}>
              <Radio value="offline">T???i qu???y</Radio>
              <Radio value="online">Online</Radio>
              <Radio value="both">C??? hai</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="flex gap-x-3">
          <Select
            placeholder="Ch???n s???n ph???m/m???u m??"
            width={163}
            containerClassName="w-auto"
            options={searchTypeList}
            defaultValue={searchType}
            onChange={(value) => setSearchType(value)}
          />
          <Select
            showSearch
            value={value}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onChange={handleChange}
            onSelect={handleSelect}
            options={(data || []).map((d) => ({
              value: d.item_relation_id,
              label: d.name,
            }))}
            placeholder="Nh???p m?? s???n ph???m / t??n s???n ph???m"
            prefix={<Icon icon="search" color="#FF970D" size={24} />}
          />
        </div>
        <ProductTable
          key={updatedKey}
          searchType={searchType}
          productList={productList}
          setProductList={setProductList}
        />
        <div className="flex gap-x-6 items-center">
          <span className="w-[180px] text-medium font-medium text-[#2E2D3D]">
            Gi?? combo*
          </span>
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: 'Gi?? combo l?? b???t bu???c!',
              },
            ]}
          >
            <Input
              type="number"
              value={rowSelected?.price}
              placeholder="Nh???p gi?? combo"
              suffix={<p className="text-medium text-[#2E2D3D]">??</p>}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddCombo;
