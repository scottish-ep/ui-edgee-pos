import React from "react";
import { useRecoilValue } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../states/ChatState";

function ChatPreviewItemButton({ item: metadata }) {
  let item = useRecoilValue(itemWithId(metadata.id, metadata));
  let buttonList = useRecoilValue(buttonListOfItemWithId(metadata.id, metadata));
  return (
    <div style={buttonList.length > 0 ? { margin: "0 -10px -6px" } : {}}>
      <p style={buttonList.length > 0 ? { padding: "0 10px 6px", margin: 0 } : { margin: 0 }}>
        {item.value}
      </p>
      <div>
        {buttonList.map(function (button) {
          return (
            <button key={button.id} type="button" className="preview-item__button">
              {button.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChatPreviewItemButton;
