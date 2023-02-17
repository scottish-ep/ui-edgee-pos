/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import PortalCustomerList from "./PortalCustomerList";
import PortalChatBox from "./PortalChatBox";
import PortalCustomerDetail from "./PortalCustomerDetail";

import parseCustomer from "../data/parseCustomer";
import { useUserList } from "../hooks/useUserList";
import { EnumSettingOption } from "../hooks/useSettings";

function PortalChat({ settings, updateSetting, setOpenSetting }) {
  let {
    userList,
    setUserList,
    fetchMore,
    updateUserSeenState,
    updateUserSupporterList,
  } = useUserList(settings);
  let [currentUser, setCurrentUser] = useState(null);
  let [userPageTokens, setUserPageTokens] = useState([]);

  useEffect(
    function () {
      let user = currentUser;
      if (!user) {
        return;
      }

      document.querySelectorAll("input[name=phone]").forEach((ele) => {
        ele.value = user.phone;
      });
      document.querySelectorAll("input[name=name]").forEach((ele) => {
        ele.value = user.name;
      });
      document.querySelectorAll("input[name=phone_2]").forEach((ele) => {
        ele.value = user.phone;
      });
      document.querySelectorAll("input[name=name_2]").forEach((ele) => {
        ele.value = user.name;
      });
      document.querySelector("input[name=customer_id]").value = user.customer_id;
      document.querySelector("input[name=facebook_user_id]").value = user.id;
      document.querySelector("input[name=page_id]").value = user.social_account.social_id;
      // if (document.getElementById("user__detail__ava")) {
      //   document.getElementById("user__detail__ava").style.display = "none";
      // }
      // setTimeout(function () {
      //   document.getElementById("user__detail__ava").style.display = "block";
      // }, 1000);
    },
    [currentUser],
  );

  useEffect(
    function () {
      function isBetween() {
        let filterDateTimeFrom = settings[EnumSettingOption.FILTER_DATETIME_FROM];
        let filterDateTimeTo = settings[EnumSettingOption.FILTER_DATETIME_TO];
        if (!filterDateTimeFrom || !filterDateTimeTo) {
          return true;
        }

        let now = new Date();
        let from = filterDateTimeFrom.split("/");
        let to = filterDateTimeTo.split("/");
        from = new Date(from[2], parseInt(from[1]) - 1, from[0]);
        to = new Date(to[2], parseInt(to[1]) - 1, to[0]);
        return now >= from && now <= to;
      }

      let filterNotRead = settings[EnumSettingOption.FILTER_NOT_READ];
      let filterDateTimeFrom = settings[EnumSettingOption.FILTER_DATETIME_FROM];
      let filterDateTimeTo = settings[EnumSettingOption.FILTER_DATETIME_TO];
      let filterFanpage = settings[EnumSettingOption.FILTER_FANPAGE];
      let filterPhoneNumber = settings[EnumSettingOption.FILTER_PHONE_NUMBER];
      let filterNotReply = settings[EnumSettingOption.FILTER_NOT_REPLY];
      let filterNew = settings[EnumSettingOption.FILTER_NEW];
      let filterConversation = settings[EnumSettingOption.FILTER_CONVERSATION];
      let filterStaff = settings[EnumSettingOption.FILTER_STAFF];
      let sortByTime = settings[EnumSettingOption.SORT_BY_TIME];
      let sortByNotSeenFirst = settings[EnumSettingOption.SORT_BY_NOT_SEEN_FIRST];

      // TODO: when new message came
      let searchPhrase = settings[EnumSettingOption.SEARCH];

      // if (
      //   !filterNotRead &&
      //   (sortByTime || sortByNotSeenFirst) &&
      //   isBetween() &&
      //   searchPhrase === ''
      // ) {
        let channelUser = window.__CHANNEL__USER__;
        channelUser.unbind();
        channelUser.bind("message-event", function (response) {
          console.log("message-event:", response);
          let not_allowed_cases = [
            searchPhrase && response.user.fullname.toLowerCase().indexOf(searchPhrase.toLowerCase())==-1 ? true : false,
            filterNotRead,
            filterDateTimeFrom && filterDateTimeTo ? true : false,
            filterFanpage && filterFanpage != response.page.social_id,
            filterPhoneNumber,
            !["all", "has_message"].includes(filterConversation),
            filterStaff,
          ];

          if (!not_allowed_cases.includes(true) && !not_allowed_cases.includes(1)) {
            let pageIds = window.__FACEBOOK__PAGE__IDS__;
            if (response.page && pageIds.indexOf(response.page.social_id) !== -1) {
              let newUser = parseCustomer(response.user);
              let oldUser = userList.find(({ id }) => id === newUser.id);
              if (oldUser) {
                // Persist some data
                newUser.phone = oldUser.phone || newUser.phone;
                newUser.isChatWith = [...new Set(oldUser.isChatWith.concat(newUser.isChatWith))];
              }
              let newUserList = [newUser].concat(userList);
              let data = [];
              let idSets = new Set([]);
              for (let i = 0; i < newUserList.length; i++) {
                if (!idSets.has(newUserList[i].id)) {
                  idSets.add(newUserList[i].id);
                  data.push(newUserList[i]);
                }
              }
              if (data.length > 30) {
                data.pop();
              }
              setUserList(data);

              if (currentUser && currentUser.id == response.user.user_id) {
                updateUserSeenState(response.user.social_id, response.user.user_id, 1);
              }
            }
          }
        });
      // }
    },
    [
      userList,
      setUserList,
      settings
    ],
  );

  let customDetail = useMemo(
    function () {
      return userList.find(({ id }) => id === currentUser?.id) || null;
    },
    [userList, currentUser?.id],
  );

  return (
    <Fragment>
      <PortalCustomerList
        userList={userList}
        setUserList={setUserList}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        updateSetting={updateSetting}
        fetchMore={fetchMore}
        updateUserSeenState={updateUserSeenState}
        updateUserSupporterList={updateUserSupporterList}
        setOpenSetting={setOpenSetting}
      />
      <PortalChatBox user={currentUser} settings={settings} />
      <PortalCustomerDetail user={customDetail} updateUserSupporterList={updateUserSupporterList} />
    </Fragment>
  );
}

export default PortalChat;
