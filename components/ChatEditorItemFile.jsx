import React from "react";
import { useRecoilState } from "recoil";
import { itemWithId } from "../states/ChatState";

function ChatEditorItemFile({ item: metadata }) {
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
            d="M10.404 5.11l-1.015-1.014-5.075 5.074c-0.841 0.841-0.841 2.204 0 3.044s2.204 0.841 3.045 0l6.090-6.089c1.402-1.401 1.402-3.673 0-5.074s-3.674-1.402-5.075 0l-6.394 6.393c-0.005 0.005-0.010 0.009-0.014 0.013-1.955 1.955-1.955 5.123 0 7.077s5.123 1.954 7.078 0c0.004-0.004 0.008-0.009 0.013-0.014l0.001 0.001 4.365-4.364-1.015-1.014-4.365 4.363c-0.005 0.004-0.009 0.009-0.013 0.013-1.392 1.392-3.656 1.392-5.048 0s-1.392-3.655 0-5.047c0.005-0.005 0.009-0.009 0.014-0.013l-0.001-0.001 6.395-6.393c0.839-0.84 2.205-0.84 3.045 0s0.839 2.205 0 3.044l-6.090 6.089c-0.28 0.28-0.735 0.28-1.015 0s-0.28-0.735 0-1.014l5.075-5.075z"
          />
        </svg>
        <span className="editor-item__file-name">{item.file ? item.file.name : "File"}</span>
      </label>
    </div>
  );
}

export default ChatEditorItemFile;
