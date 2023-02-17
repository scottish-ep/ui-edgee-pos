import React from "react";
import ReactDOM from "react-dom";
import LivestreamAppForm from "./LivestreamAppForm/LivestreamAppForm";

const LivestreamAppCreate: React.FC = () => {
  return <LivestreamAppForm />;
};

ReactDOM.render(<LivestreamAppCreate />, document.getElementById("root"));
