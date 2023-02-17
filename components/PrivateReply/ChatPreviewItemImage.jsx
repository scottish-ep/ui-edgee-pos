import React, { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../../states/ChatState";

function ChatPreviewItemImage({ item: metadata }) {
  let item = useRecoilValue(itemWithId(metadata.id, metadata));
  let buttonList = useRecoilValue(buttonListOfItemWithId(metadata.id, metadata));
  return (
    <Fragment>
      <img src={item.url} alt="" />
      <div>
        {buttonList.map(function (button) {
          return (
            <button key={button.id} type="button" className="preview-item__button">
              {button.content}
            </button>
          );
        })}
      </div>
    </Fragment>
  );
}

export default ChatPreviewItemImage;
