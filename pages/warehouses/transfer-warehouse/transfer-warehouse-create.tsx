import React from "react";
import ReactDOM from "react-dom";

import TransferWareHouseForm from "./TransferWareHouseForm/TransferWareHouseForm";

const TransferWareHouseCreate: React.FC = () => {
  return <TransferWareHouseForm />;
};

ReactDOM.render(<TransferWareHouseCreate />, document.getElementById("root"));
