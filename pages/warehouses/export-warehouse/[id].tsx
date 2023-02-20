import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IProduct } from 'pages/products/product.type';
import { wareHouseDetail } from '../../../const/constant';
import ExportWareHouseForm from './ExportWareHouseForm/ExportWareHouseForm';

const ExportWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState({ ...wareHouseDetail });

  const detailList = {
    id: 'EP01',
    export_code: 'BHV0021',
    user: 'Nguyễn Văn A',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    note: 'Xuất đơn hàng #NJV098HJG',
    export_name: 'Kho tổng Linh Dương',
    export_warehouse: 'Kho tổng Linh Dương',
    phone_number: '0987987456',
    export_address:
      'Số nhà 40, đường Phạm Quang Lịch, tổ 21, phường Tiền Phong, thành phố Thái Bình, Thái Bình',
    address: '',
    shipping_id: 'Ninjavan',
    product_list: Array(5)
      .fill({
        name: '555501 | Áo thun basic cotton - Trắng - S',
        category_id: 'Áo',
        export_price: 150000,
        import_price: 150000,
        export_quantity: 1,
        import_quantity: 1,
        export_weight: 0,
        import_weight: 0,
        money: 150000,
        number_package: 10,
        unit_package: 30000,
        total_money: 0,
        quantity_transfer: 0,
        weight_transfer: 0,
        quantity_can_transfer: 549,
        weight_can_transfer: 0,
      })
      .map((item, index) => ({ ...item, id: index + 1 })),
  };
  return <ExportWareHouseForm detail={detailList} />;
};

export default ExportWareHouseDetail;
