import React from "react";
import ChatPreviewItemText from "./ChatPreviewItemText";
import ChatPreviewItemButton from "./ChatPreviewItemButton";
import ChatPreviewItemDelay from "./ChatPreviewItemDelay";
import ChatPreviewItemImage from "./ChatPreviewItemImage";
import ChatPreviewItemFile from "./ChatPreviewItemFile";
import ChatPreviewItemVideo from "./ChatPreviewItemVideo";
import ChatPreviewItemAudio from "./ChatPreviewItemAudio";
import ChatPreviewItemGallery from "./ChatPreviewItemGallery";

function ChatPreviewItem({ item }) {
  let Wrapper;
  switch (item.type) {
    case "text":
      Wrapper = ChatPreviewItemText;
      break;
    case "delay":
      Wrapper = ChatPreviewItemDelay;
      break;
    case "image":
      Wrapper = ChatPreviewItemImage;
      break;
    case "file":
      Wrapper = ChatPreviewItemFile;
      break;
    case "video":
      Wrapper = ChatPreviewItemVideo;
      break;
    case "audio":
      Wrapper = ChatPreviewItemAudio;
      break;
    case "card":
      Wrapper = ChatPreviewItemGallery;
      break;
    case "gallery":
      Wrapper = ChatPreviewItemGallery;
      break;
    case "button":
      Wrapper = ChatPreviewItemButton;
      break;
  }
  if (!Wrapper) {
    return null;
  }
  return (
    <div className={"preview-item " + (item.type == "card" ? "gallery" : item.type)}>
      <img src="/images/fb-profile.png" alt="" />
      <div className="preview-item__content--wrapper">
        <div className="preview-item__content">
          <Wrapper item={item} />
        </div>
      </div>
    </div>
  );
}

export default ChatPreviewItem;
