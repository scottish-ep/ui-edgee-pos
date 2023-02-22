import React, { useState } from "react";
import ReactDOM from "react-dom";

import { wareHouseDetail } from "../../../const/constant";
import ReturnWareHouseForm from "./ReturnWareHouseForm/ReturnWareHouseForm";

const ReturnWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState({ ...wareHouseDetail });

  return <ReturnWareHouseForm detail={detail} />;
};

export default ReturnWareHouseDetail;
