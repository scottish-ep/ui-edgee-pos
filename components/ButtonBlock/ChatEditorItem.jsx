import React, { memo } from "react";
import ChatEditorItemText from "./ChatEditorItemText";
import ChatEditorItemImage from "./ChatEditorItemImage";
import ChatEditorItemFile from "./ChatEditorItemFile";
import ChatEditorItemAudio from "./ChatEditorItemAudio";
import ChatEditorItemVideo from "./ChatEditorItemVideo";
import ChatEditorItemDelay from "./ChatEditorItemDelay";
import ChatEditorItemGallery from "./ChatEditorItemGallery";
import ChatEditorItemButton from "./ChatEditorItemButton";
import { useSetRecoilState } from "recoil";
import { itemListState } from "../../states/ChatState";

let ChatEditorItem = memo(function ChatEditorItem({ item }) {
  let Wrapper = null;
  if (item) {
    switch (item.type) {
      case "text":
        Wrapper = ChatEditorItemText;
        break;
      case "image":
        Wrapper = ChatEditorItemImage;
        break;
      case "file":
        Wrapper = ChatEditorItemFile;
        break;
      case "audio":
        Wrapper = ChatEditorItemAudio;
        break;
      case "delay":
        Wrapper = ChatEditorItemDelay;
        break;
      case "video":
        Wrapper = ChatEditorItemVideo;
        break;
      case "card":
        Wrapper = ChatEditorItemGallery;
        break;
      case "gallery":
        Wrapper = ChatEditorItemGallery;
        break;
      case "button":
        Wrapper = ChatEditorItemButton;
        break;
    }
  }

  let setItemIdList = useSetRecoilState(itemListState);
  return (
    <div className="editor-item--wrapper">
      {Wrapper && <Wrapper item={item} />}
      <div className="editor-item__sidemenu">
        <button
          type="button"
          aria-label="Delete this item"
          onClick={function () {
            setItemIdList((p) => p.filter(({ id }) => id !== item.id));
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
});

export default ChatEditorItem;
