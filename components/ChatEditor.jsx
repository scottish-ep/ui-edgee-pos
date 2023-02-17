import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { itemListState } from "../states/ChatState";
import ChatEditorItem from "./ChatEditorItem";
import ChatEditorQuickReply from "./ChatEditorQuickReply";

function ChatEditor() {
  let itemIdList = useRecoilValue(itemListState);
  let settingMessage = window.__FACEBOOK__MESSAGE__;
  return (
    <div className="editor-content">
      <label className="editor-content__header">
        <div className="editor-content__header-label">
          <h2>Content Type</h2>
          <a href="#">
            About{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 14C4.68323 14 2 11.3043 2 8C2 4.69565 4.68323 2 8 2C11.3168 2 14 4.69565 14 8C14 11.3043 11.3043 14 8 14ZM8 2.73292C5.09317 2.73292 2.74534 5.09317 2.74534 8C2.74534 10.8944 5.10559 13.2547 8 13.2547C10.8944 13.2547 13.2547 10.8944 13.2547 8C13.2547 5.09317 10.8944 2.73292 8 2.73292Z"
                fill="#109CF1"
                stroke="#109CF1"
                strokeWidth="0.3"
              />
              <path
                d="M8.06214 11.4286C8.32284 11.4286 8.53419 11.2173 8.53419 10.9565C8.53419 10.6958 8.32284 10.4845 8.06214 10.4845C7.80143 10.4845 7.59009 10.6958 7.59009 10.9565C7.59009 11.2173 7.80143 11.4286 8.06214 11.4286Z"
                fill="#109CF1"
                stroke="#109CF1"
                strokeWidth="0.3"
              />
              <path
                d="M8.06211 4.80737C6.93168 4.80737 6 5.72663 6 6.86949C6 7.05582 6.14907 7.20489 6.3354 7.20489C6.52174 7.20489 6.67081 7.05582 6.67081 6.86949C6.67081 6.0993 7.29193 5.47818 8.06211 5.47818C8.8323 5.47818 9.45342 6.0993 9.45342 6.86949C9.45342 7.63967 8.8323 8.26079 8.06211 8.26079C7.87578 8.26079 7.72671 8.40986 7.72671 8.59619V9.6024C7.72671 9.78874 7.87578 9.93781 8.06211 9.93781C8.24845 9.93781 8.39752 9.78874 8.39752 9.6024V8.89433C9.37888 8.73284 10.1242 7.88812 10.1242 6.85706C10.1242 5.72663 9.20497 4.80737 8.06211 4.80737Z"
                fill="#109CF1"
                stroke="#109CF1"
                strokeWidth="0.3"
              />
            </svg>
          </a>
        </div>
        <select id="facebook__message-tag" defaultValue="" value={settingMessage.message_fb_tag}>
          <option value="" disabled>
            Select a type
          </option>
          <option value="">None</option>
          <option value="POST_PURCHASE_UPDATE">Post-Purchase Update</option>
          <option value="CONFIRMED_EVENT_UPDATE">Confirmed Event Update</option>
          <option value="ACCOUNT_UPDATE">Account Update</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      {itemIdList.map(function (itemMetadata) {
        return <ChatEditorItem key={itemMetadata.id} item={itemMetadata} />;
      })}
      <ChatEditorQuickReply />
    </div>
  );
}

export default ChatEditor;
