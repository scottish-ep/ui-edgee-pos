import React, { Fragment } from "react";
import { useRecoilState } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../../states/ChatState";
import ChatEditorButtonList from "./ChatEditorItemButtonList";

function ButtonList({ itemId, metadata }) {
  let [buttonList, setButtonList] = useRecoilState(buttonListOfItemWithId(itemId, metadata));
  function addButton(item) {
    setButtonList((p) => p.concat(item));
  }
  return <ChatEditorButtonList buttonList={buttonList} addButton={addButton} />;
}

function ChatEditorItemImage({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  return (
    <div className="editor-item">
      <label className={"editor-item__file-uploader image " + (item.url ? "chosen" : "")}>
        <input
          type="file"
          accept="image/*"
          style={{ position: "absolute", opacity: "0", zIndex: "-1" }}
          onChange={function (e) {
            let files = e.target.files;
            if (files.length === 0) {
              return;
            }
            setItem({
              url: URL.createObjectURL(files[0]),
              file: files[0],
            });
          }}
        />
        {!item.url ? (
          <Fragment>
            <svg viewBox="0 0 16 16">
              <path
                fill="#000000"
                d="M14.998 2c0.001 0.001 0.001 0.001 0.002 0.002v11.996c-0.001 0.001-0.001 0.001-0.002 0.002h-13.996c-0.001-0.001-0.001-0.001-0.002-0.002v-11.996c0.001-0.001 0.001-0.001 0.002-0.002h13.996zM15 1h-14c-0.55 0-1 0.45-1 1v12c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-12c0-0.55-0.45-1-1-1v0z"
              ></path>
              <path
                fill="#000000"
                d="M13 4.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5z"
              ></path>
              <path fill="#000000" d="M14 13h-12v-2l3.5-6 4 5h1l3.5-3z"></path>
            </svg>
            <span className="editor-item__file-name">Upload image</span>
          </Fragment>
        ) : (
          <img src={item.url} alt="" />
        )}
      </label>
    </div>
  );
}

export default ChatEditorItemImage;
