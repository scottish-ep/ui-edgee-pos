import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { itemWithId } from "../states/ChatState";
import ChatEditorButtonList from "./ChatEditorItemButtonList";

function ChatEditorItemButton({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  let [active, setActive] = useState(false);
  let [showStatus, setShowStatus] = useState(1);
  let [buttonName, setButtonName] = useState("");
  let [buttonValue, setButtonValue] = useState("");
  let [buttonType, setButtonType] = useState("");
  let storageFlows = window.__FACEBOOK__STORAGE__FLOWS__;
  useEffect(
    function () {
      let type = item.value ? item.value.buttonType : "";
      if (item) {
        if (type == "quick_reply_message" || type == "web_url") {
          setShowStatus(2);
          setActive(true);
        } else if (type == "storage_flow") {
          setShowStatus(3);
          setActive(true);
        }
        setButtonType(type);
        setButtonName(item.value.buttonName);
        setButtonValue(item.value.buttonValue);
      }
    },
    [item],
  );

  function handleSelectButton(e) {
    let type = e.target.value;
    setItem({
      value: {
        buttonType: e.target.value,
        value: "",
        buttonValue: "",
        buttonName: buttonName,
      },
    });
    console.log(e);
    if (type == "quick_reply_message" || type == "web_url") {
      setShowStatus(2);
    } else if (type == "storage_flow") {
      setShowStatus(3);
    }
    setButtonType(type);
  }

  function handleOnchangeButtonName(e) {
    let currentSelect = "";
    let currentValue = "";
    if (item.value) {
      currentSelect = item.value.buttonType;
    }
    if (item.value) {
      currentValue = item.value.value;
    }
    setButtonName(e.target.value);
    setItem({
      value: {
        buttonType: currentSelect,
        value: currentValue,
        buttonValue: currentValue,
        buttonName: e.target.value,
      },
    });
  }

  function handleOnchange(e) {
    let currentSelect = "";
    if (item.value) {
      currentSelect = item.value.buttonType;
    }
    setItem({
      value: {
        buttonType: currentSelect,
        value: e.target.value,
        buttonValue: e.target.value,
        buttonName: buttonName,
      },
    });
  }

  return active ? (
    <form className="editor-item__button-form">
      <input
        value={buttonName}
        onChange={handleOnchangeButtonName}
        type="text"
        name="button"
        className="button__name editor-item__button-form__input"
        placeholder="Enter Button Name"
      />
      <select
        value={buttonType}
        onChange={handleSelectButton}
        className="editor-item__button-form__input"
        defaultValue=""
      >
        <option value="" disabled>
          Select option
        </option>
        <option value="web_url">Website Url</option>
        <option value="storage_flow">Storage Flow</option>
      </select>
      {showStatus == 2 && (
        <input
          value={buttonValue}
          onChange={handleOnchange}
          type="text"
          name="button"
          className="editor-item__button-form__input"
          placeholder="Enter Value"
          autoFocus
        />
      )}
      {showStatus == 3 && (
        <select
          value={buttonValue}
          onChange={handleOnchange}
          className="editor-item__button-form__input"
          defaultValue=""
        >
          <option value="" disabled>
            Select Other Flow
          </option>
          {storageFlows.map((storageFlow, i) => {
            return (
              <option key={storageFlow.id} value={storageFlow.id}>
                {storageFlow.name}
              </option>
            );
          })}
        </select>
      )}
    </form>
  ) : (
    <div>
      <button type="button" className="editor-item__add-button-btn" onClick={() => setActive(true)}>
        + add button
      </button>
    </div>
  );
}

export default ChatEditorItemButton;
