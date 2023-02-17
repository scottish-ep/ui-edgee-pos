import React from "react";
import { useRecoilValue } from "recoil";
import { itemListState, quickReplyListState } from "../states/ChatState";
import ChatPreviewItem from "./ChatPreviewItem";

function ChatPreviewBunnyIcons() {
  return (
    // prettier-ignore
    <svg width="56" height="12" viewBox="0 0 56 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M49.5 2H36.75C35.7145 2 34.875 2.83947 34.875 3.875V8.75C34.875 9.78553 35.7145 10.625 36.75 10.625H49.5C50.5355 10.625 51.375 9.78553 51.375 8.75V3.875C51.375 2.83947 50.5355 2 49.5 2ZM35.625 3.875C35.625 3.25368 36.1287 2.75 36.75 2.75H49.5C50.1213 2.75 50.625 3.25368 50.625 3.875V8.75C50.625 9.37132 50.1213 9.875 49.5 9.875H36.75C36.1287 9.875 35.625 9.37132 35.625 8.75V3.875Z" fill="black" />
            <path d="M53.0625 6.12501C53.0625 5.431 52.6854 4.82505 52.125 4.50085V7.74917C52.6854 7.42497 53.0625 6.81903 53.0625 6.12501Z" fill="black" />
            <path fillRule="evenodd" clipRule="evenodd" d="M37.125 3.5H49.125C49.5392 3.5 49.875 3.83579 49.875 4.25V8.375C49.875 8.78921 49.5392 9.125 49.125 9.125H37.125C36.7108 9.125 36.375 8.78921 36.375 8.375V4.25C36.375 3.83579 36.7108 3.5 37.125 3.5Z" fill="black" />
            <path d="M31.0293 4.39912L31.0243 4.22299C29.4797 2.84089 27.4956 2.07874 25.4106 2.07874C23.3196 2.07874 21.3303 2.84523 19.7841 4.23439L19.7793 4.41036L20.6937 5.32636L20.8592 5.3317C22.1174 4.22394 23.7238 3.61433 25.4106 3.61433C27.0916 3.61433 28.6929 4.2198 29.9495 5.32078L30.1148 5.31525L31.0293 4.39912Z" fill="black" />
            <path d="M29.02 6.22577L29.0276 6.40421L28.1104 7.32303L27.9493 7.33207C27.2288 6.75614 26.3398 6.44306 25.4105 6.44306C24.4756 6.44306 23.5815 6.75998 22.8589 7.34235L22.6974 7.33361L21.7805 6.41511L21.7878 6.2369C22.7997 5.37793 24.0743 4.90747 25.4105 4.90747C26.7407 4.90747 28.0101 5.37374 29.02 6.22577Z" fill="black" />
            <path d="M25.4842 9.95363H25.3131L23.7916 8.42947C23.7385 8.37631 23.746 8.28808 23.8073 8.24471C24.2755 7.91362 24.8319 7.73608 25.4105 7.73608C25.9831 7.73608 26.5339 7.90988 26.9991 8.23447C27.061 8.27762 27.0688 8.36628 27.0156 8.41967L25.4842 9.95363Z" fill="black" />
            <path d="M14.4375 2.1875C14.0233 2.1875 13.6875 2.52329 13.6875 2.9375V9.3125C13.6875 9.72671 14.0233 10.0625 14.4375 10.0625H15.1875C15.6017 10.0625 15.9375 9.72671 15.9375 9.3125V2.9375C15.9375 2.52329 15.6017 2.1875 15.1875 2.1875H14.4375Z" fill="black" />
            <path d="M10.125 4.625C10.125 4.21079 10.4608 3.875 10.875 3.875H11.625C12.0392 3.875 12.375 4.21079 12.375 4.625V9.3125C12.375 9.72671 12.0392 10.0625 11.625 10.0625H10.875C10.4608 10.0625 10.125 9.72671 10.125 9.3125V4.625Z" fill="black" />
            <path d="M7.3125 5.75C6.89829 5.75 6.5625 6.08579 6.5625 6.5V9.3125C6.5625 9.72671 6.89829 10.0625 7.3125 10.0625H8.0625C8.47671 10.0625 8.8125 9.72671 8.8125 9.3125V6.5C8.8125 6.08579 8.47671 5.75 8.0625 5.75H7.3125Z" fill="black" />
            <path d="M3.75 7.25C3.33579 7.25 3 7.58579 3 8V9.3125C3 9.72671 3.33579 10.0625 3.75 10.0625H4.5C4.91421 10.0625 5.25 9.72671 5.25 9.3125V8C5.25 7.58579 4.91421 7.25 4.5 7.25H3.75Z" fill="black" />
        </svg>
  );
}

function ChatPreview() {
  let itemList = useRecoilValue(itemListState);
  let quickReplyList = useRecoilValue(quickReplyListState);
  return (
    <div id="preview-wrapper--out">
      <div id="preview-wrapper-in">
        <div className="preview__bunny_ear"></div>
        <div id="preview">
          <div className="preview-header">
            <time>2:55 PM</time>
            <div>
              <ChatPreviewBunnyIcons />
            </div>
          </div>
          <div className="preview-user">
            <img src="/images/placeholder-pfp.png" alt="" />
            <div className="preview-user__info">
              <p>Test</p>
              <p>Typically replies instantly</p>
            </div>
          </div>
          <div className="preview-content">
            {itemList.map(function (item) {
              return <ChatPreviewItem key={item.id} item={item} />;
            })}
            {quickReplyList.map(function (reply) {
              return (
                <button key={reply.id} type="button" className="editor__quick-reply-item">
                  {reply.content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPreview;
