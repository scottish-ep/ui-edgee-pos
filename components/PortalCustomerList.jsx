import React, { useEffect, useRef } from "react";
import PortalBadge from "./PortalBadge";
import { EnumSettingOption } from "../hooks/useSettings";
import ModuleLoadDataComponents from "./waitting/load-data";
import { ListALT } from "./others/fontawesome.elements";
import { H4InLineHeader } from "./others/common-elements.elements";
import { element } from "prop-types";

function isBottom(el) {
  return Math.round(el.scrollHeight - el.scrollTop) === el.clientHeight;
}

function UserCard({ user, active, onSelect }) {
  return (
    <li
      id={user.facebook}
      className={`portal-customer-list__user ${user.isSeen ? "seen" : ""} ${
        active ? "active" : ""
      }`}
      role="button"
      onClick={onSelect}
    >
      <div className="portal-customer-list__user-header">
        <img src={user.pfpURL} alt="" />
        <div>
          <div className="portal-customer-list__user-name--wrapper">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <h3 className="portal-customer-list__user-name">{user.name}</h3>
              {user.badge && <PortalBadge badge={user.badge} badgeTooltip={user.badgeTooltip} />}
              <div className="wrap__icon">
                {(!!user.phone || !!user.phoneMessageId) && (
                  <i className="icon_message has__phone-icon fa fa-phone main_color"></i>
                )}
                {!!user.hasMessage && (
                  <i className="icon_message has__message-icon fa fa-inbox main_color"></i>
                )}
                {!!user.hasComment && (
                  <i className="icon_message has__comment-icon fas fa-comment main_color"></i>
                )}
              </div>
            </div>
          </div>
          <p className="portal-customer-list__user-phone">{user.phone}</p>
          {/* <time>{user.latestMessage.time}</time> */}
          <div className="portal-customer-list__user-latest-msg">
            {user.latestMessage && (
              <div className="wrap__message">
                <p className="lastMessage">{user.latestMessage.content}</p>
                <p className="lastMessageTime">{user.latestMessage.time}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {user.tagList.length > 0 && (
        <div className="portal-customer-list__tag-list">
          {user.tagList.map(function (tag, idx) {
            return (
              <span key={idx} style={{ backgroundColor: tag.colour }}>
                {tag.content}
              </span>
            );
          })}
        </div>
      )}
      <div className="portal-customer-list__short-detail">
        {user.customerShortDetail.substr(0, 20)}..
      </div>
      <div className="support__wrapper">
        {user.isChatWith?.map(function (userTaken, idx) {
          return (
            <span className="support__name" key={idx}>
              {userTaken}
            </span>
          );
        })}
      </div>
    </li>
  );
}

function PortalCustomerList({
  userList,
  currentUser,
  setCurrentUser,
  updateSetting,
  fetchMore,
  updateUserSeenState,
  updateUserSupporterList,
  setOpenSetting,
}) {
  // Flag to prevent multiple pages up while scrolling
  let isScrolling = useRef(true);
  useEffect(
    function () {
      // Reset flag after a fetch
      isScrolling.current = true;
    },
    [userList],
  );

  const supportUser = (user) => {
    // Mark this conversation as "read"
    updateUserSeenState(user.social_id, user.id, true);

    // Change to this user
    setCurrentUser(user);

    if (!user.isChatWith || user.isChatWith.length === 0) {
      updateUserSupporterList(user.social_id, user.id);
    }
  }

  const searchConversations = (e) => {
    e.preventDefault();
    let search = e.target.customerName.value;
    updateSetting(EnumSettingOption.SEARCH, search);
  }

  //Trigger button click to change value both tabs to default
  const triggerChangeTab = () => {
    const element = (document).querySelector("#trigger-reset");
    element.click();
  };

  return (
    <div
      className="portal-customer-list"
      onScroll={function (e) {
        if (isScrolling.current) {
          if (isBottom(e.target)) {
            isScrolling.current = false;
            fetchMore();
          }
        }
      }}
    >
      <div className="portal-customer-list__title">
        <div>
          <H4InLineHeader>Danh sách chat</H4InLineHeader>
        </div>
        <ListALT
          className="fas fa-sliders-h"
          style={{ cursor: "pointer" }}
          onClick={() => setOpenSetting(true)}
        />
      </div>
      <form className="portal-customer-list__search" onSubmit={searchConversations}>
        <button type="submit" style={{ border: "none" }}>
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.33622 0C2.84241 0 0 2.67704 0 5.96756C0 9.25809 2.84241 11.9351 6.33622 11.9351C9.83002 11.9351 12.6724 9.25809 12.6724 5.96756C12.6724 2.67704 9.82999 0 6.33622 0ZM6.33622 10.8912C3.45352 10.8912 1.10839 8.68254 1.10839 5.96756C1.10839 3.25259 3.45352 1.0439 6.33622 1.0439C9.21874 1.0439 11.564 3.25259 11.564 5.96756C11.564 8.68254 9.21891 10.8912 6.33622 10.8912Z"
              fill="#8D99AA"
            />
            <path
              d="M14.8379 13.2364L10.8108 9.44358C10.5943 9.23967 10.2436 9.23967 10.0271 9.44358C9.81062 9.64732 9.81062 9.97788 10.0271 10.1816L14.0542 13.9744C14.1625 14.0764 14.3042 14.1273 14.4461 14.1273C14.5879 14.1273 14.7296 14.0764 14.8379 13.9744C15.0543 13.7707 15.0543 13.4401 14.8379 13.2364Z"
              fill="#8D99AA"
            />
          </svg>
        </button>
        <input type="text" name="customerName" placeholder="Tìm theo tên/ sđt" />
      </form>
      <ul className="portal-customer-list__user-list">
        {userList.map(function (user) {
          return (
            <UserCard
              key={user.id}
              user={user}
              active={currentUser && user.id === currentUser.id}
              onSelect={function () {
                supportUser(user);
                triggerChangeTab();
              }}
            />
          );
        })}
      </ul>
      <ModuleLoadDataComponents id="load_customer_list_popup"></ModuleLoadDataComponents>
      {/* <li className="portal-customer-list__user loading__new" role="button">
        <div>See more</div>
      </li> */}
    </div>
  );
}

export default PortalCustomerList;
