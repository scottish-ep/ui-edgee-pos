import React, { useRef, Fragment } from "react";
import Slider from "react-slick";
import { useRecoilValue } from "recoil";
import { itemWithId, buttonListOfItemWithId } from "../../states/ChatState";

function ChatPreviewItemGalleryItem({ sliderItem, itemId, metadata, sliderIndex }) {
  let buttonList = useRecoilValue(buttonListOfItemWithId(itemId, metadata))[sliderIndex];
  return (
    <div>
      <img src={sliderItem.imageURL} alt="" />
      <div style={{ padding: "0.6rem 1rem" }}>
        <p>{sliderItem.title}</p>
        <p>{sliderItem.subtitle}</p>
      </div>
      <div>
        {buttonList.map(function (button) {
          return (
            <button key={button.id} type="button" className="preview-item__button">
              {button.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatPreviewItemGallery({ item: metadata }) {
  let item = useRecoilValue(itemWithId(metadata.id, metadata));
  let slider = useRef(null);
  return (
    <div style={{ position: "relative" }}>
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
          return (
            <ChatPreviewItemGalleryItem
              key={idx}
              sliderItem={sliderItem}
              itemId={metadata.id}
              metadata={metadata}
              sliderIndex={idx}
            />
          );
        })}
      </Slider>
    </div>
  );
}

export default ChatPreviewItemGallery;
