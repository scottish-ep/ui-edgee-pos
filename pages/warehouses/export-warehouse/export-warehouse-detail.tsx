import React, { useState } from "react";
import ReactDOM from "react-dom";

import { wareHouseDetail } from "../../../const/constant";
import ExportWareHouseForm from "./ExportWareHouseForm/ExportWareHouseForm";

const ExportWareHouseDetail: React.FC = () => {
  const [detail, setDetail] = useState({ ...wareHouseDetail });

  return <ExportWareHouseForm detail={detail} />;
};

ReactDOM.render(<ExportWareHouseDetail />, document.getElementById("root"));
