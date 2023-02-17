import React from "react";
import { useRecoilState } from "recoil";
import { itemWithId } from "../states/ChatState";

function ChatEditorItemDelay({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  return (
    <div className="editor-item">
      <input
        className="delay__time"
        type="number"
        placeholder="Enter delay time"
        value={item.value}
        onChange={(e) => {
          let textarea = e.target;
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
          setItem({
            value: e.target.value,
          });
        }}
      />
      <svg style={{ margin: "0 0.5rem" }} width="16" height="16" viewBox="0 0 16 16">
        <path
          fill="#000000"
          d="M10.293 11.707l-3.293-3.293v-4.414h2v3.586l2.707 2.707zM8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"
        />
      </svg>
    </div>
  );
}

export default ChatEditorItemDelay;
