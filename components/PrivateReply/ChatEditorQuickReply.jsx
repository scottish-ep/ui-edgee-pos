import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { quickReplyListState } from "../../states/ChatState";

let replyId = 0;

function AddReplyButton({ addReply }) {
  let [active, setActive] = useState(false);
  function onCreateReply(e) {
    e.preventDefault();

    let reply = e.target.reply.value;
    addReply({
      id: ++replyId,
      content: reply,
    });
    setActive(false);
  }
  return active ? (
    <form className="editor__quick-reply-form" onSubmit={onCreateReply}>
      <input type="text" name="reply" placeholder="Add text" autoFocus />
    </form>
  ) : (
    <button type="button" className="editor__quick-reply__add-btn" onClick={() => setActive(true)}>
      + Quick reply
    </button>
  );
}

function ChatEditorQuickReply() {
  let [replyList, setReplyList] = useRecoilState(quickReplyListState);
  function addReply(reply) {
    setReplyList((p) => p.concat(reply));
  }
  return (
    <div className="editor__quick-reply">
      {replyList.map(function (reply) {
        return (
          <button key={reply.id} type="button" className="editor__quick-reply-item">
            {reply.content}
          </button>
        );
      })}
      <AddReplyButton addReply={addReply} />
    </div>
  );
}

export default ChatEditorQuickReply;
