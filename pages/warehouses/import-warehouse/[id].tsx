import { notification } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { wareHouseDetail } from '../../../const/constant';
import ItemSkuApi from '../../../services/item-skus';
import ItemApi from '../../../services/items';
import WarehousesImportApi from '../../../services/warehouses-import';
import { StatusEnum, StatusList } from '../../../types';
import { IUser } from '../../../types/users';
import { isArray } from '../../../utils/utils';
import ImportWareHouseForm from './ImportWareHouseForm/ImportWareHouseForm';

declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
    loggedInUser: string;
  }
}

const ImportWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState({});

  // const urlParams = new URLSearchParams(window.location.search);
  let pathNameArr = [''];
  useRef(() => {
    pathNameArr = window.location.pathname.split('/');
  });
  const id = pathNameArr[pathNameArr.length - 1];
  let selectedUser = '';
  useRef(() => {
    selectedUser = window.loggedInUser;
  });

  // useEffect(() => {
  //   const element = document.getElementById('loading__animation');
  //   if (element) {
  //     element.remove();
  //   }
  //   getDetails();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const getDetails = () => {
  //   const url = `/api/v2/warehouse-imports/detail/${id}`;
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const result = res.data;
  //       setDetail({
  //         ...result,
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // };
  const detailItem = {
    code: "BV102021",
    created_at: Date.now(),
    
  };

  const user = "Phuong Nam"

  return <ImportWareHouseForm detail={detailItem} selectedUser={user} />;
};

export default ImportWareHouseDetail;
