import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import ChatEditorLayout from "./ChatEditorLayout";
import ChatPreview from "./ChatPreview";
import ChatType from "./ChatType";

function ChatPrivateReplyApp() {
  return (
    <RecoilRoot>
      <ChatEditorLayout />
      <ChatPreview />
      <ChatType />
    </RecoilRoot>
  );
}

ReactDOM.render(<ChatPrivateReplyApp />, document.getElementById("root"));
