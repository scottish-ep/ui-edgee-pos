import React from "react";
import ReactDOM from "react-dom";
import PromotionsForm from "./PromotionsForm/PromotionsForm";

const PromotionsCreate: React.FC = () => {
  return <PromotionsForm />;
};

ReactDOM.render(<PromotionsCreate />, document.getElementById("root"));
