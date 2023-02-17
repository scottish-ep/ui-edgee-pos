import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getEnvironmentData } from "worker_threads";
import Break from "../components/Break/Break";
import styles from "../styles/DetailCustomer.module.css";

const GeneralPage: React.FC = () => {
  useEffect(() => {
    getData();
  }, []);

  const [statusOrders, setStatusOrders] = useState<any>({
    totalOrderNotPaymented: 0,
    totalOrderNotReceived: 0,
    totalOrderReceiving: 0,
    totalOrderCanceled: 0,
  });

  const getData = () => {
    setStatusOrders([]);
  };

  return (
    <div className="flex items-start gap-[25px] justitfy-between w-full">
      <div className="flex flex-col w-full">
        <div className={styles.table}>
          <div className={styles.title}>Kết quả kinh doanh hôm nay</div>
          <Break />
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="text-uppercase mb-0 mt-[24px]">
                DOANH THU THUẦN
              </div>
              <div className="w-100">
                <p className="mb-0 font-bold text-uppercase">0</p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="text-uppercase mb-0 mt-[24px]">TỔNG ĐƠN HÀNG</div>
              <div className="w-100">
                <p className="mb-0 font-bold text-uppercase">0</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <a
              className={styles.direct_link}
              href="/report-dashboard/report-revenue"
              target="_blank"
            >
              Xem báo cáo
              <span className="omni-svg-create svg-next-icon ml-2 mb-1 svg-next-icon-size-14">
                <svg width="14" height="14">
                  <svg viewBox="0 0 12 12">
                    <path d="M6.00008 0.666992L5.06008 1.60699L8.78008 5.33366H0.666748V6.66699H8.78008L5.06008 10.3937L6.00008 11.3337L11.3334 6.00033L6.00008 0.666992Z"></path>
                  </svg>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.title}>Trạng thái đơn hàng</div>
          <Break />
          <div className="flex justify-start gap-[24px] my-[15px]">
            <svg width="24" height="24">
              <svg viewBox="0 0 14 12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.3333 0.666656H1.66668C0.926677 0.666656 0.34001 1.25999 0.34001 1.99999L0.333344 9.99999C0.333344 10.74 0.926677 11.3333 1.66668 11.3333H12.3333C13.0733 11.3333 13.6667 10.74 13.6667 9.99999V1.99999C13.6667 1.25999 13.0733 0.666656 12.3333 0.666656ZM12.3333 9.99999H1.66668V5.99999H12.3333V9.99999ZM1.66668 3.33332H12.3333V1.99999H1.66668V3.33332Z"
                ></path>
              </svg>
            </svg>
            <p>
              {statusOrders.totalOrderNotPaymented} đơn hàng{" "}
              <span className="font-bold">chưa thanh toán</span>
            </p>
          </div>
          <div className="flex justify-start gap-[24px] my-[15px]">
            <svg width="24" height="24">
              <svg viewBox="0 0 14 12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.3333 0.666656H1.66668C0.926677 0.666656 0.34001 1.25999 0.34001 1.99999L0.333344 9.99999C0.333344 10.74 0.926677 11.3333 1.66668 11.3333H12.3333C13.0733 11.3333 13.6667 10.74 13.6667 9.99999V1.99999C13.6667 1.25999 13.0733 0.666656 12.3333 0.666656ZM12.3333 9.99999H1.66668V5.99999H12.3333V9.99999ZM1.66668 3.33332H12.3333V1.99999H1.66668V3.33332Z"
                ></path>
              </svg>
            </svg>
            <p>
              {statusOrders.totalOrderNotPaymented} đơn hàng{" "}
              <span className="font-bold">chưa thanh toán</span>
            </p>
          </div>
          <div className="flex justify-start gap-[24px] my-[15px]">
            <svg width="24" height="24">
              <svg viewBox="0 0 14 12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.3333 0.666656H1.66668C0.926677 0.666656 0.34001 1.25999 0.34001 1.99999L0.333344 9.99999C0.333344 10.74 0.926677 11.3333 1.66668 11.3333H12.3333C13.0733 11.3333 13.6667 10.74 13.6667 9.99999V1.99999C13.6667 1.25999 13.0733 0.666656 12.3333 0.666656ZM12.3333 9.99999H1.66668V5.99999H12.3333V9.99999ZM1.66668 3.33332H12.3333V1.99999H1.66668V3.33332Z"
                ></path>
              </svg>
            </svg>
            <p>
              {statusOrders.totalOrderNotPaymented} đơn hàng{" "}
              <span className="font-bold">chưa thanh toán</span>
            </p>
          </div>
          <div className="flex justify-start gap-[24px] my-[15px]">
            <svg width="24" height="24">
              <svg viewBox="0 0 14 12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.3333 0.666656H1.66668C0.926677 0.666656 0.34001 1.25999 0.34001 1.99999L0.333344 9.99999C0.333344 10.74 0.926677 11.3333 1.66668 11.3333H12.3333C13.0733 11.3333 13.6667 10.74 13.6667 9.99999V1.99999C13.6667 1.25999 13.0733 0.666656 12.3333 0.666656ZM12.3333 9.99999H1.66668V5.99999H12.3333V9.99999ZM1.66668 3.33332H12.3333V1.99999H1.66668V3.33332Z"
                ></path>
              </svg>
            </svg>
            <p>
              {statusOrders.totalOrderNotPaymented} đơn hàng{" "}
              <span className="font-bold">chưa thanh toán</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<GeneralPage />, document.getElementById("root"));
