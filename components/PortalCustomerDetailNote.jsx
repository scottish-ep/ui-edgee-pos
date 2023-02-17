import React, { Fragment, useEffect, useState } from "react";
import { request } from "../utils/request";

export function PortalCustomerDetailNote({ user }) {
  let [noteList, setNoteList] = useState([]);

  useEffect(
    function () {
      if (!user) {
        return;
      }
      request("/portal/facebook/user-notes/" + user.id).then(setNoteList);
    },
    [user],
  );

  function handleAddNote(e) {
    e.preventDefault();
    let form = e.target;
    let note = form.note.value;
    console.log(note);
    request("/portal/facebook/user-notes/add", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note, user: user.id }),
    }).then(function (noteList) {
      setNoteList(noteList);
      form.note.value = "";
    });
  }

  function removeNote(e) {
    e.preventDefault();
    let note = e.target.note.value;
    request("/portal/facebook/user-notes/remove", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note, user: user.id }),
    }).then(setNoteList);
  }

  return (
    <Fragment>
      <div className="portal-customer-list__tag-list">
        {noteList.map((note, index) => (
          <form key={index} className="customer__note-wrap" onSubmit={removeNote}>
            <input
              type="text"
              name="note"
              className="portal-customer-detail__note"
              value={note}
              readOnly
              disabled
            />
            <button
              type="submit"
              aria-label="Remove this note"
              style={{
                alignItems: "center",
                display: "inline-flex",
                justifyContent: "center",
              }}
            >
              <i className="fa fa-times"></i>
            </button>
          </form>
        ))}
      </div>
      <form id="form_customer_note" onSubmit={handleAddNote}>
        <input
          type="text"
          name="note"
          className="portal-customer-detail__note"
          required
          rows={3}
          placeholder="Nhập ghi chú khách hàng"
        />
      </form>
    </Fragment>
  );
}
