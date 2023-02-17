import React from "react";
import { useRecoilState } from "recoil";
import { itemWithId } from "../states/ChatState";

function ChatEditorItemAudio({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  return (
    <div className="editor-item">
      <label className={"editor-item__file-uploader " + (item.file ? "chosen" : "")}>
        <input
          type="file"
          style={{ position: "absolute", opacity: "0", zIndex: "-1" }}
          onChange={function (e) {
            let files = e.target.files;
            if (files.length === 0) {
              return;
            }
            setItem({
              file: files[0],
            });
          }}
        />
        <svg viewBox="0 0 16 16">
          <path
            fill="#000000"
            d="M15 0h1v11.5c0 1.381-1.567 2.5-3.5 2.5s-3.5-1.119-3.5-2.5c0-1.381 1.567-2.5 3.5-2.5 0.979 0 1.865 0.287 2.5 0.751v-5.751l-8 1.778v7.722c0 1.381-1.567 2.5-3.5 2.5s-3.5-1.119-3.5-2.5c0-1.381 1.567-2.5 3.5-2.5 0.979 0 1.865 0.287 2.5 0.751v-9.751l9-2z"
          />
        </svg>
        <span className="editor-item__file-name">{item.file ? item.file.name : "Audio"}</span>
      </label>
    </div>
  );
}

export default ChatEditorItemAudio;
