import { notification } from 'antd';
import Item from 'antd/lib/list/Item';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ItemSkuApi from '../../../services/item-skus';
import ItemApi from '../../../services/items';
import WarehouseApi from '../../../services/warehouses';
import { IUser } from '../../../types/users';
import { isArray, randomId } from '../../../utils/utils';

import ImportWareHouseForm from './ImportWareHouseForm/ImportWareHouseForm';

const ImportWareHouseCreate: React.FC = () => {
  let selectedUser = '';
  useRef(() => {
    selectedUser = window.loggedInUser;
  });

  return <ImportWareHouseForm selectedUser={selectedUser} />;
};

export default ImportWareHouseCreate;
