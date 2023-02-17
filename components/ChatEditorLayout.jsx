import React from "react";
import { useSetRecoilState } from "recoil";
import { itemListState } from "../states/ChatState";
import ChatEditor from "./ChatEditor";
import IconChatText from "../icons/IconChatText";
import IconChatImage from "../icons/IconChatImage";
import IconChatCard from "../icons/IconChatCard";
import IconChatGallery from "../icons/IconChatGallery";
import IconChatAudio from "../icons/IconChatAudio";
import IconChatFile from "../icons/IconChatFile";
import IconChatDelay from "../icons/IconChatDelay";
import IconChatVideo from "../icons/IconChatVideo";
import IconChatButton from "../icons/IconChatButton";

let itemId = 0;

let buttonList = [
  {
    type: "text",
    name: "Text",
    icon: IconChatText,
  },
  {
    type: "image",
    name: "Image",
    icon: IconChatImage,
  },
  {
    type: "gallery",
    name: "Card",
    icon: IconChatCard,
    settings: {
      length: 1,
    },
  },
  {
    type: "gallery",
    name: "Gallery",
    icon: IconChatGallery,
    settings: {
      length: 10,
    },
  },
  {
    type: "audio",
    name: "Audio",
    icon: IconChatAudio,
  },
  {
    type: "file",
    name: "File",
    icon: IconChatFile,
  },
  {
    type: "delay",
    name: "Delay",
    icon: IconChatDelay,
  },
  {
    type: "video",
    name: "Video",
    icon: IconChatVideo,
  },
  {
    type: "button",
    name: "Button",
    icon: IconChatButton,
  },
];

function ChatEditorLayout(settingMessage) {
  let setItemIdList = useSetRecoilState(itemListState);
  function addItem(item) {
    console.log(item);
    setItemIdList((p) =>
      p.concat({
        id: ++itemId,
        settings: {},
        ...item,
      }),
    );
  }

  return (
    <div id="editor-wrapper">
      <main id="editor">
        <div className="editor-header">post</div>
        <div className="editor">
          <ChatEditor />
          <div className="editor-action-list">
            {buttonList.map(function (button, idx) {
              let Icon = button.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={"Add new " + button.name.toLowerCase()}
                  onClick={function () {
                    addItem({
                      type: button.type,
                      ...(button.settings && {
                        settings: button.settings,
                      }),
                    });
                  }}
                >
                  <div>
                    <Icon />
                  </div>
                  + {button.name}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatEditorLayout;
