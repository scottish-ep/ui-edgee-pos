import React from "react";
import ReactDOM from "react-dom";

import ExportWareHouseForm from "./ExportWareHouseForm/ExportWareHouseForm";

const ExportWareHouseCreate: React.FC = () => {
  return <ExportWareHouseForm />;
};

ReactDOM.render(<ExportWareHouseCreate />, document.getElementById("root"));
