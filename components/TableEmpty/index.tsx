import React from "react";

const TableEmpty: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-6">
      <img
        src="https://bamboohealth.s3.ap-southeast-1.amazonaws.com/files/5ca255d90c21d10159792963f2c0e6de.png"
        width={220}
        height={130}
        className="object-cover"
      />
    </div>
  );
};

export default TableEmpty;
