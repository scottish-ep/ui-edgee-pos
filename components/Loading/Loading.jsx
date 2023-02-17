import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export const LoadingComponent = ({color, loading, size}) => {
  return ( 
    <div className="loading__container">
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default LoadingComponent;
