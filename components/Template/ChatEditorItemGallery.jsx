import React, { Fragment, useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../../states/ChatState";
import Slider from "react-slick";
import ChatEditorButtonList from "./ChatEditorItemButtonList";

function ButtonList({ itemId, sliderIndex, metadata }) {
  let [buttonList, setButtonList] = useRecoilState(buttonListOfItemWithId(itemId, metadata));
  function addButton(item) {
    setButtonList((p) => {
      let q = [...p];
      q[sliderIndex] = q[sliderIndex].concat(item);
      return q;
    });
  }
}

function ChatEditorItemGalleryItem({ index, sliderItem, setItem, itemId, metadata }) {
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
    <div className="edit-item__slider-item">
      <div className="edit-item__slider-item__content">
        <label
          className={"editor-item__file-uploader image " + (sliderItem.imageURL ? "chosen" : "")}
        >
          {!sliderItem.imageURL ? (
            <Fragment>
              <input
                type="file"
                style={{ position: "absolute", opacity: "0", zIndex: "-1" }}
                onChange={function (e) {
                  let files = e.target.files;
                  if (files.length === 0) {
                    return;
                  }
                  setItem((p) => {
                    let q = [...p];
                    q[index] = {
                      ...q[index],
                      imageURL: URL.createObjectURL(files[0]),
                      imageFile: files[0],
                    };
                    return q;
                  });
                }}
              />
              <svg viewBox="0 0 16 16">
                <path
                  fill="#000000"
                  d="M14.998 2c0.001 0.001 0.001 0.001 0.002 0.002v11.996c-0.001 0.001-0.001 0.001-0.002 0.002h-13.996c-0.001-0.001-0.001-0.001-0.002-0.002v-11.996c0.001-0.001 0.001-0.001 0.002-0.002h13.996zM15 1h-14c-0.55 0-1 0.45-1 1v12c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-12c0-0.55-0.45-1-1-1v0z"
                />
                <path
                  fill="#000000"
                  d="M13 4.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5z"
                />
                <path fill="#000000" d="M14 13h-12v-2l3.5-6 4 5h1l3.5-3z" />
              </svg>
              <span className="editor-item__file-name">Upload image</span>
            </Fragment>
          ) : (
            <img src={sliderItem.imageURL} alt="" />
          )}
        </label>
        <input
          type="text"
          placeholder="Enter title..."
          value={sliderItem.title}
          onChange={(e) =>
            setItem((p) => {
              let q = [...p];
              q[index] = {
                ...q[index],
                title: e.target.value,
              };
              return q;
            })
          }
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
                  let editor_item = e.target.closest(".edit-item__slider-item__content");
                  let input = editor_item.querySelector("input");
                  input.value += "[[" + value + "]]";
                  setItem((p) => {
                    let q = [...p];
                    q[index] = {
                      ...q[index],
                      title: input.value,
                    };
                    return q;
                  });
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <textarea
          placeholder="Enter your subtitle..."
          value={sliderItem.subtitle}
          onChange={(e) => {
            let textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
            setItem((p) => {
              let q = [...p];
              q[index] = {
                ...q[index],
                subtitle: e.target.value,
              };
              return q;
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
                  let editor_item = e.target.closest(".edit-item__slider-item__content");
                  let textarea = editor_item.querySelector("textarea");
                  textarea.value += "[[" + value + "]]";
                  setItem((p) => {
                    let q = [...p];
                    q[index] = {
                      ...q[index],
                      subtitle: textarea.value,
                    };
                    return q;
                  });
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChatEditorItemGallery({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  let slider = useRef(null);
  return (
    <div className="editor-item gallery">
      <div className="editor-item__slider">
        {item.length > 1 && (
          <Fragment>
            <button
              type="button"
              className="slick-prev slick-arrow"
              onClick={() => slider.current.slickPrev()}
              aria-label="View previous slide"
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path fill="#000000" d="M0.5 8l7.5 7.5v-4.5h8v-6h-8v-4.5z"></path>
              </svg>
            </button>
            <button
              type="button"
              className="slick-next slick-arrow"
              onClick={() => slider.current.slickNext()}
              aria-label="View next slide"
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path fill="#000000" d="M15.5 8l-7.5-7.5v4.5h-8v6h8v4.5z"></path>
              </svg>
            </button>
          </Fragment>
        )}
        <Slider arrows={false} ref={slider}>
          {item.map(function (sliderItem, idx) {
            if (typeof sliderItem == "object") {
              return (
                <ChatEditorItemGalleryItem
                  key={idx}
                  index={idx}
                  sliderItem={sliderItem}
                  setItem={setItem}
                  itemId={metadata.id}
                  metadata={metadata}
                />
              );
            }
          })}
        </Slider>
      </div>
    </div>
  );
}

export default ChatEditorItemGallery;
