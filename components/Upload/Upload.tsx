import React, { useState, useEffect } from "react";
import { ReactNode } from "react";
import styles from "./TitlePage.module.css";
import Icon from "../Icon/Icon";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile, UploadProps as UploadAntdProps } from "antd/es/upload";
import { Upload as UploadAntd } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface UploadProps extends UploadAntdProps {
  className?: string;
  children?: ReactNode;
  images?: any[];
  onChange?: (value?: any) => void;
  textUpload?: string;
  iconUpload?: ReactNode;
  fileList?: any[];
}

const Upload = (props: UploadProps) => {
  const {
    className,
    children,
    onChange,
    iconUpload,
    textUpload = "Upload",
    fileList,
    ...res
  } = props;

  const uploadButton = (
    <div className="flex gap-x-2 items-center px-3 py-2 border border-[#DADADD] rounded">
      {iconUpload ? iconUpload : <PlusOutlined />}
      <div className="text-medium font-medium text-[#5F5E6B]">{textUpload}</div>
    </div>
  );

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    onChange && onChange;
  };

  return (
    <UploadAntd
      className={className}
      onChange={handleChange}
      fileList={fileList}
      {...props}
    >
      {children ? children : uploadButton}
    </UploadAntd>
  );
};

export default Upload;
