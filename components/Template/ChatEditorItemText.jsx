import React, { useState, useEffect } from "react";
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

function ChatEditorItemText({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  let [tagList, setTagList] = useState([]);

  useEffect(function () {
    var url = "/portal/facebook/system-tags";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.message == "success") {
          console.log(res.result);
          setTagList(res.result);
        }
      });
  }, []);

  return (
    <div className="editor-item">
      <textarea
        id="editor__text__input"
        placeholder="Enter your text"
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
      {/*Render tagList here*/}
      <div className="editor__tag">
        {tagList.map((tag, idx) => {
          return (
            <span
              key={idx}
              className="label label-inline label-info"
              onClick={(e) => {
                let value = e.target.innerText;
                let editor_item = e.target.closest(".editor-item");
                let textarea = editor_item.querySelector("textarea");
                textarea.value += "[[" + value + "]]";
                setItem({
                  value: textarea.value,
                });
              }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default ChatEditorItemText;
