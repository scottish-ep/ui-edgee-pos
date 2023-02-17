/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import ReactDOM from "react-dom";
import TransportCompanyUserApi from "../../services/transport-company-user";
import type { ColumnsType } from "antd/es/table";
import { Table, Switch, Tag, Form, Upload, message, Tooltip } from "antd";
import TitlePage from "../../components/TitlePage/Titlepage";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import styles from "../../styles/DetailCustomer.module.css";
import TransportCompanyApi from "../../services/transport-company";

const CreateUserCompany = () => {
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];
  const [form] = Form.useForm();

  useEffect(() => {
    getDetailTransportCompany();
  }, []);

  const getDetailTransportCompany = async () => {
    const data = await TransportCompanyApi.getDetail(id);

    console.log("data detail", data);
  };

  const handleConfirmDelete = async () => {};

  const handleSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full">
      <div className="flex items-center justify-between mb-[12px] flex-wrap">
        <TitlePage title="Tạo tài khoản" href="/transport-company" />
        <div className="flex gap-[8px] flex-wrap">
          <Button
            variant="danger-outlined"
            width={153}
            icon={<Icon icon="trash" size={24} color="#EF4444" />}
            onClick={() => setIsShowModalConfirm(true)}
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            variant="secondary"
            width={187}
          >
            LƯU (F12)
          </Button>
        </div>
      </div>
      <div className={styles.table} style={{ marginBottom: 0, height: "100%" }}>
        <h1>222</h1>
      </div>
    </Form>
  );
};

ReactDOM.render(<CreateUserCompany />, document.getElementById("root"));
