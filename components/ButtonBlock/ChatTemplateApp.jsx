import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import ChatEditorLayout from "./ChatEditorLayout";
import ChatPreview from "./ChatPreview";
import ChatType from "./ChatType";

function ChatTemplateApp() {
  return (
    <RecoilRoot>
      <ChatEditorLayout />
      <ChatPreview />
      <ChatType />
    </RecoilRoot>
  );
}

ReactDOM.render(<ChatTemplateApp />, document.getElementById("root"));
