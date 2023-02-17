import { message } from "antd";
import { add, get } from "lodash";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal/Modal";
import Select from "../../../components/Select/Select";
import AddressApi from "../../../services/address";
import { IOption } from "../../../types/permission";
import { IWareHouseManagementDetail } from "../warehouse.type";

interface ModalAddEditWareHouseManagementProps {
  isVisible: boolean;
  onClose: () => void;
  detail?: IWareHouseManagementDetail;
  onReload?: (uuid: string) => void;
}

const ModalAddEditWareHouseManagement: React.FC<
  ModalAddEditWareHouseManagementProps
> = (props) => {
  const { detail = null, isVisible, onClose, onReload } = props;
  const defaultValue = {
    name: "",
    phone_number: "",
    address: "",
    description: "",
    ...detail,
  };
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [districtList, setDistrictList] = useState<IOption[]>([]);
  const [wardList, setWardList] = useState<IOption[]>([]);
  const [provinceList, setProvinceList] = useState<IOption[]>([]);

  const [districtIdSelected, setDistrictIdSelected] = useState<string>("");
  const [wardIdSelected, setWardIdSelected] = useState<string>("");
  const [provinceIdSelected, setProvinceIdSelected] = useState<string>("");

    
  useEffect(() => {
    if(detail){
      setName(detail?.name || "");
      setPhoneNumber(detail?.phone_number || "");
      setAddress(detail?.address || "");
      setDescription(detail?.description || "");
      setDistrictIdSelected(detail?.district_id || "");
      setWardIdSelected(detail?.ward_id || "");
      setProvinceIdSelected(detail?.province_id || "");
    }
  }, [detail])
    

  useEffect(() => {
    getProvinces();
  }, []);
  
  useEffect(() => {
    if(provinceIdSelected){
      getDistricts();
    }
  }, [provinceIdSelected]);

  // useEffect(() => {
  //   console.log("🚀 ~ file: ModalAddEditWareHouseManagement.tsx:64 ~ useEffect ~ provinceIdSelected", provinceIdSelected)
  // });

  useEffect(() => {
    if(districtIdSelected){
      getWards();
    }
  }, [districtIdSelected]);

  const resetSelect = () => {
    setWardIdSelected("");
    setProvinceIdSelected("");
  }

  const getProvinces = async () => {
    const { data } = await AddressApi.provinceList();
    console.log("🚀 ~ file: ModalAddEditWareHouseManagement.tsx:55 ~ getProvince ~ data", data)
    let array = [
      {
        label: "Chọn tỉnh thành",
        value: ""
      }
    ]
    data?.map(item => {
      array.push({
        label: item?.name,
        value: item?.id
      })
    })
    setProvinceList(array)
  }

  const getDistricts = async () => {
    const { data } = await AddressApi.districtList({
      province_id: provinceIdSelected
    });

    let districts = [
      {
        label: "Chọn quận huyện",
        value: ""
      }
    ]
    data?.map(item => {
      districts.push({
        label: item?.name,
        value: item?.id
      })
    })
    setDistrictList(districts)
  }

  const getWards = async () => {
    const { data } = await AddressApi.wardList({
      district_id: districtIdSelected
    });

    let wards = [
      {
        label: "Chọn phường xã",
        value: ""
      }
    ]

    data?.map(item => {
      wards.push({
        label: item?.name,
        value: item?.id
      })
    })

    setWardList(wards)
  }
  

  const handleAdd = () => {
    if(!name){
      message.error("Vui lòng nhập tên");
      return null;
    }

    if(!provinceIdSelected){
      message.error("Vui lòng chọn tỉnh thành");
      return null;
    }

    if(!districtIdSelected){
      message.error("Vui lòng chọn quận huyện");
      return null;
    }

    if(!wardIdSelected){
      message.error("Vui lòng chọn phường xã");
      return null;
    }

    if(!address){
      message.error("Vui nhập địa chỉ");
      return null;
    }

    const body = {
      name,
      description,
      phone_number: phoneNumber,
      district_id: districtIdSelected,
      province_id: provinceIdSelected,
      ward_id: wardIdSelected,
      address: address,
    };

    const options = {
      method: detail ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    fetch(detail ? `/api/v2/warehouses/update/${detail?.id}` : "/api/v2/warehouses/create", options)
      .then((res) => res.json())
      .then((data) => {
        if(data?.success === true){
          onReload?.(uuid())
          onClose?.();
          resetForm();
          message.success(detail ? "Sửa thành công" : "Thêm thành công");
        }else{
          message.error(data?.message || "Có lỗi xảy xa!");
        }
      });
  }

  const resetForm = ()  => {
    setName("");
    setPhoneNumber("");
    setProvinceIdSelected("");
    setDistrictIdSelected("");
    setWardIdSelected("")
    setAddress("");
    setDescription("");
  }

  const Footer = () => (
    <div className="flex gap-x-3 justify-end">
      <Button
        variant="outlined"
        width={236}
        onClick={() => {
          onClose();
        }}
      >
        HUỶ BỎ
      </Button>
      <Button
        variant="secondary"
        width={236}
        onClick={handleAdd}
      >
        LƯU
      </Button>
    </div>
  );

  return (
    <Modal
      isCenterModal
      title="Thông tin kho hàng"
      isVisible={isVisible}
      onClose={onClose}
      iconClose="Đóng"
      footer={<Footer />}
      width={794}
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex gap-x-3">
          <Input
            className="flex-1"
            label="Tên kho hàng (*)"
            placeholder="Nhập tên kho hàng"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="flex-1"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex gap-x-3">
          <Select
            containerClassName="flex-1"
            label="Tỉnh/Thành"
            placeholder="Chọn tỉnh/thành"
            options={provinceList}
            value={provinceIdSelected}
            onChange={(e) => {
              setProvinceIdSelected(e);
              setDistrictIdSelected("");
              setWardIdSelected("");
            }}
          />
          <Select
            containerClassName="flex-1"
            label="Quận/Huyện"
            placeholder="Chọn quận/huyện"
            options={districtList}
            value={districtIdSelected}
            onChange={(e) => {
              setDistrictIdSelected(e);
              setWardIdSelected("");
            }}
          />
        </div>
        <div className="flex gap-x-3">
          <Select
            containerClassName="flex-1"
            label="Xã/Phường"
            placeholder="Nhập xã/phường"
            options={wardList}
            value={wardIdSelected}
            onChange={(e) => {
              setWardIdSelected(e);
            }}
          />
          <Input
            className="flex-1"
            label="Tên đường, số nhà"
            placeholder="Nhập tên đường, số nhà"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <Input
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default ModalAddEditWareHouseManagement;
