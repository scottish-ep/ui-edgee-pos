import React, { useState, useEffect } from "react";
import parseMedia from "../data/parseMedia";

function MediaModal({ sendMedia }) {
  let [mediaList, setMediaList] = useState([]);

  useEffect(function () {
    // TODO: fetch list media when load page
    fetch("/api/media")
      .then((res) => res.json())
      .then((res) => {
        if (res.message == "success") {
          let mediaList = res.result.map(parseMedia);
          setMediaList(mediaList);
        }
      });
  }, []);

  function selectThisMedia(media) {
    let mediaListNew = [];
    for (let i = 0; i < mediaList.length; i++) {
      if (mediaList[i].id == media.id) {
        mediaListNew.push({
          id: media.id,
          name: media.name,
          url: media.url,
          type: media.type,
          thumbnailSrc: media.thumbnailSrc,
          isSelected: !media.isSelected,
        });
      } else {
        mediaListNew.push(mediaList[i]);
      }
    }
    setMediaList(mediaListNew);
  }

  return (
    <div
      className="modal fade"
      id="mediaModal"
      data-backdrop="static"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="staticBackdrop"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Select Media
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <i aria-hidden="true" className="ki ki-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              {mediaList.map(function (media) {
                return (
                  <div onClick={() => selectThisMedia(media)} key={media.id} className="col-lg-3">
                    <div className={"media__element " + (media.isSelected ? "selected" : "")}>
                      <img src={media.thumbnailSrc} />
                      <p>{media.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="modal-footer">
            <button
              id="close__modal"
              type="button"
              className="btn btn-light-primary font-weight-bold"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => sendMedia(mediaList)}
              className="btn btn-primary font-weight-bold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
