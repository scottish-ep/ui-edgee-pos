import React from "react";
import ReactDOM from "react-dom";
import BalanceWareHouseForm from "./BalanceWareHouseForm/BalanceWareHouseForm";

const BalanceWareHouseCreate: React.FC = () => {
  return <BalanceWareHouseForm />;
};

ReactDOM.render(<BalanceWareHouseCreate />, document.getElementById("root"));
