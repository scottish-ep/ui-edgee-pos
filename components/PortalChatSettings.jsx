import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { EnumSettingOption } from "../hooks/useSettings";
import { request } from "../utils/request";
import SquareRadio from "./others/inputs/square-radio/square-radio";
import { ULawesome } from "./others/fontawesome.elements";
import { H4InLineHeader } from "./others/common-elements.elements";

function Checkbox({ label, ...rest }) {
  return (
    <label>
      <input {...rest} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

function Radio({ label, ...rest }) {
  return (
    <label>
      <input {...rest} type="radio" />
      <span>{label}</span>
    </label>
  );
}

function PortalChatSettings({
  settings,
  updateSetting,
  updateMultipleSettings,
  openSetting,
  closeSetting,
}) {
  let [fanpages, setFanpages] = useState([]);
  let [staffs, setStaffs] = useState([]);

  let filterDateFrom = settings[EnumSettingOption.FILTER_DATETIME_FROM];
  let filterDateTo = settings[EnumSettingOption.FILTER_DATETIME_TO];
  let filterDate = filterDateFrom && filterDateTo ? filterDateFrom + " - " + filterDateTo : "";

  useEffect(function () {
    request("/portal/facebook/pages").then(function (fanpageList) {
      setFanpages(fanpageList);
    });
  }, []);

  useEffect(function () {
    request("/portal/facebook/staffs").then(function (staffList) {
      setStaffs(staffList);
    });
  }, []);

  function filterPhoneNumber() {
    updateSetting(EnumSettingOption.FILTER_PHONE_NUMBER, (p) => 1 - p);
    /*updateMultipleSettings(
      [
        EnumSettingOption.FILTER_PHONE_NUMBER,
        EnumSettingOption.FILTER_DATETIME_FROM,
        EnumSettingOption.FILTER_DATETIME_TO,
      ],
      [1-settings[EnumSettingOption.FILTER_PHONE_NUMBER,'','']]
    );*/
  }
  function filterNotRead() {
    updateSetting(EnumSettingOption.FILTER_NOT_READ, (p) => 1 - p);
    /*updateMultipleSettings(
      [
        EnumSettingOption.FILTER_NOT_READ,
        EnumSettingOption.FILTER_DATETIME_FROM,
        EnumSettingOption.FILTER_DATETIME_TO,
      ],
      [1-settings[EnumSettingOption.FILTER_NOT_READ,'','']]
    );*/
  }
  function filterNotReply() {
    updateSetting(EnumSettingOption.FILTER_NOT_REPLY, (p) => 1 - p);
    /*updateMultipleSettings(
      [
        EnumSettingOption.FILTER_NOT_REPLY,
        EnumSettingOption.FILTER_DATETIME_FROM,
        EnumSettingOption.FILTER_DATETIME_TO,
      ],
      [1-settings[EnumSettingOption.FILTER_NOT_REPLY,'','']]
    );*/
  }
  function filterNew() {
    updateSetting(EnumSettingOption.FILTER_NEW, (p) => 1 - p);
    /*updateMultipleSettings(
      [
        EnumSettingOption.FILTER_NEW,
        EnumSettingOption.FILTER_DATETIME_FROM,
        EnumSettingOption.FILTER_DATETIME_TO,
      ],
      [1-settings[EnumSettingOption.FILTER_NEW,'','']]
    );*/
  }
  function filterConversationType(e) {
    let value = e.target.value;
    updateSetting(EnumSettingOption.FILTER_CONVERSATION, value);
    /*updateMultipleSettings(
      [
        EnumSettingOption.FILTER_CONVERSATION,
        EnumSettingOption.FILTER_DATETIME_FROM,
        EnumSettingOption.FILTER_DATETIME_TO,
      ],
      [1-settings[EnumSettingOption.FILTER_CONVERSATION,'','']]
    );*/
  }
  function sortBy(e) {
    let sortType = e.target.value;

    // Turn off all 3 sort settings, then turn on the selected one
    updateMultipleSettings(
      [
        EnumSettingOption.SORT_BY_TIME,
        EnumSettingOption.SORT_BY_SEEN_FIRST,
        EnumSettingOption.SORT_BY_NOT_SEEN_FIRST,
        sortType,
      ],
      [0, 0, 0, 1],
    );
  }
  function filterDateTime(_, picker) {
    let startDate = picker.startDate.format("DD/MM/YYYY");
    let endDate = picker.endDate.format("DD/MM/YYYY");

    updateMultipleSettings(
      [EnumSettingOption.FILTER_DATETIME_FROM, EnumSettingOption.FILTER_DATETIME_TO],
      [startDate, endDate],
    );
  }

  function reSetDateFilter() {
    updateMultipleSettings(
      [EnumSettingOption.FILTER_DATETIME_FROM, EnumSettingOption.FILTER_DATETIME_TO],
      ["", ""],
    );
  }

  return (
    <div className={`portal-chat-settings ${openSetting ? "show" : "hide"}`}>
      <div className="portal-chat-settings__header">
        <div>
          <ULawesome
            id="show__page"
            type="button"
            className="fab fa-facebook-square"
            data-toggle="modal"
            data-target="#showPageModal"
          />
          <H4InLineHeader>Cài đặt chat</H4InLineHeader>
        </div>
        <i className="fas fa-chevron-left" style={{ cursor: "pointer" }} onClick={closeSetting}></i>
      </div>

      <section className="portal-chat-settings__section">
        <h3>Lọc hội thoại</h3>
        <div className="portal-chat-settings__section-content">
          <Checkbox label="SĐT" onChange={filterPhoneNumber} />
          <Checkbox label="Chưa đọc" onChange={filterNotRead} />
          <Checkbox label="Chưa trả lời" onChange={filterNotReply} />
          <Checkbox label="Mới" onChange={filterNew} />
        </div>
        <div className="portal-chat-settings__section-content">
          <h3>Ngày/tháng</h3>
          <div className="input-group" id="kt_daterangepicker_4">
            <input
              type="text"
              className="form-control no-margin-right"
              readOnly="readonly"
              value={filterDate}
              title={filterDate}
            />
            <div className="input-group-append">
              <DateRangePicker onApply={filterDateTime}>
                <span className="input-group-text select__daterange__icon">
                  <svg
                    fill="#000000"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="18px"
                    height="18px"
                  >
                    <path d="M 9 4 L 9 5 L 5 5 L 5 27 L 27 27 L 27 5 L 23 5 L 23 4 L 21 4 L 21 5 L 11 5 L 11 4 Z M 7 7 L 9 7 L 9 8 L 11 8 L 11 7 L 21 7 L 21 8 L 23 8 L 23 7 L 25 7 L 25 9 L 7 9 Z M 7 11 L 25 11 L 25 25 L 7 25 Z M 13 13 L 13 15 L 15 15 L 15 13 Z M 17 13 L 17 15 L 19 15 L 19 13 Z M 21 13 L 21 15 L 23 15 L 23 13 Z M 9 17 L 9 19 L 11 19 L 11 17 Z M 13 17 L 13 19 L 15 19 L 15 17 Z M 17 17 L 17 19 L 19 19 L 19 17 Z M 21 17 L 21 19 L 23 19 L 23 17 Z M 9 21 L 9 23 L 11 23 L 11 21 Z M 13 21 L 13 23 L 15 23 L 15 21 Z M 17 21 L 17 23 L 19 23 L 19 21 Z" />
                  </svg>
                </span>
              </DateRangePicker>
              <div onClick={reSetDateFilter} id="clear_setting_date_picker_wrapper">
                <i className="fas fa-eraser"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="portal-chat-settings__section-content">
          <h3>Loại conversation</h3>
          <Radio
            defaultChecked={settings[EnumSettingOption.FILTER_CONVERSATION] === "all"}
            label="Tất cả"
            name="conversation_type"
            value="all"
            onChange={filterConversationType}
          />
          <Radio
            label="Chỉ có comment"
            name="conversation_type"
            value="has_comment"
            onChange={filterConversationType}
          />
          <Radio
            label="Chỉ có message"
            onChange={filterConversationType}
            name="conversation_type"
            value="has_message"
          />
          <Radio
            label="Có cả hai"
            onChange={filterConversationType}
            name="conversation_type"
            value="has_comment_and_message"
          />
        </div>
        <div className="portal-chat-settings__section-content">
          <h3>Fanpage</h3>
          <select
            className="portal-chat-settings__section-select"
            id="customer__fanpage"
            onChange={(e) => updateSetting(EnumSettingOption.FILTER_FANPAGE, e.target.value)}
          >
            <option key="0" value="">
              Tất cả
            </option>
            {fanpages.map((fanpage) => {
              return (
                <option key={fanpage.id} value={fanpage.social_id}>
                  {fanpage.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="portal-chat-settings__section-content">
          <h3>NV chăm sóc</h3>
          <select
            className="portal-chat-settings__section-select"
            id="customer__staff"
            onChange={(e) => updateSetting(EnumSettingOption.FILTER_STAFF, e.target.value)}
          >
            <option key="0" value="">
              Tất cả
            </option>
            {staffs.map((staff) => {
              return (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="portal-chat-settings__section-content">
          <h3>Thứ tự đoạn hội thoại</h3>
          <Radio
            label="Thời gian"
            onChange={sortBy}
            name="sort_by"
            value={EnumSettingOption.SORT_BY_TIME} 
            defaultChecked
          />
          <Radio
            label="Đã đọc trước"
            onChange={sortBy}
            name="sort_by"
            value={EnumSettingOption.SORT_BY_SEEN_FIRST}
          />
          <Radio
            label="Chưa đọc trước"
            onChange={sortBy}
            name="sort_by"
            value={EnumSettingOption.SORT_BY_NOT_SEEN_FIRST}
          />
        </div>
      </section>
      <hr className="thicc-white-hr" />
    </div>
  );
}

export default PortalChatSettings;
