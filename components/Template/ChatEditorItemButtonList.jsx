import React, { memo, Fragment, useState, useEffect } from "react";

function AddButton({ addButton }) {
  let [active, setActive] = useState(false);
  let [showStatus, setShowStatus] = useState(1);

  function handleSelectButton(e) {
    let type = e.target.value;
    console.log(e);
    if (type == "quick_reply_message" || type == "web_url") {
      setShowStatus(2);
    } else {
      setShowStatus(3);
    }
  }

  return active ? (
    <form className="editor-item__button-form">
      <select
        onChange={handleSelectButton}
        className="editor-item__button-form__input"
        defaultValue=""
      >
        <option value="" disabled>
          Select option
        </option>
        <option value="quick_reply_message">Quick Reply Text Message</option>
        <option value="web_url">Website Url</option>
        <option value="storage_flow">Storage Flow</option>
      </select>
      {showStatus == 2 && (
        <input
          type="text"
          name="button"
          className="editor-item__button-form__input"
          placeholder="Enter Value"
          autoFocus
        />
      )}
      {showStatus == 3 && (
        <select className="editor-item__button-form__input" defaultValue="">
          <option value="" disabled>
            Select Other Flow
          </option>
          <option>Flow 1</option>
          <option>Flow 2</option>
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

let ChatEditorButtonList = memo(function ChatEditorButtonList({ buttonList, addButton }) {
  return (
    <Fragment>
      {buttonList.map(function (button) {
        return (
          <button key={button.id} type="button" className="editor-item__button">
            {button.content}
          </button>
        );
      })}
      <AddButton addButton={addButton} />
    </Fragment>
  );
});

export default ChatEditorButtonList;
