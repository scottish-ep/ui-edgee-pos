import React from "react";
import { useRecoilValue } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../../states/ChatState";

function ChatPreviewItemText({ item: metadata }) {
  let item = useRecoilValue(itemWithId(metadata.id, metadata));
  let buttonList = useRecoilValue(buttonListOfItemWithId(metadata.id, metadata));
  return (
    <div
      className="preview__button"
      style={buttonList.length > 0 ? { margin: "0 -10px -6px" } : {}}
    >
      <p style={buttonList.length > 0 ? { padding: "0 10px 6px", margin: 0 } : { margin: 0 }}>
        Button
      </p>
    </div>
  );
}

export default ChatPreviewItemText;
