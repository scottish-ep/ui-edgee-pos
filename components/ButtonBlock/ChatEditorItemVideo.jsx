import React, { Fragment } from "react";
import { useRecoilState } from "recoil";
import { itemWithId } from "../../states/ChatState";

function ChatEditorItemVideo({ item: metadata }) {
  let [item, setItem] = useRecoilState(itemWithId(metadata.id, metadata));
  return (
    <div className="editor-item">
      <label className={"editor-item__file-uploader " + (item.file ? "chosen" : "")}>
        <input
          type="file"
          style={{ position: "absolute", opacity: "0", zIndex: "-1" }}
          accept="video/*"
          onChange={function (e) {
            let files = e.target.files;
            if (files.length === 0) {
              return;
            }
            let url = URL.createObjectURL(files[0]);
            setItem({
              url: url,
              file: files[0],
            });
            // (e.target).closest('.editor-item').querySelector('.video__upload source').setAttribute('src', url);
            // (e.target).closest('.editor-item').querySelector('.video__upload').load()
          }}
        />
        <Fragment>
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.08108 1C0.48216 1 0 1.48216 0 2.08108V4.24324H2.1875L4.98311 1H1.08108ZM6.40203 1L3.60642 4.24324H7.59291L10.3885 1H6.40203ZM11.8074 1L9.01183 4.24324H12.9983L15.7939 1H11.8074ZM17.2128 1L14.4172 4.24324H18.9189V2.08108C18.9189 1.48216 18.4368 1 17.8378 1H17.2128ZM0 5.32432V17.2162C0 17.8151 0.48216 18.2973 1.08108 18.2973H13.6571C13.5674 17.9504 13.5135 17.5912 13.5135 17.2162C13.5135 14.8279 15.4496 12.8919 17.8378 12.8919C18.2128 12.8919 18.572 12.9458 18.9189 13.0355V5.32432H0V5.32432ZM8.10811 9.10811L12.4324 11.8108L8.10811 14.5135V9.10811ZM17.8378 13.4324C15.7481 13.4324 14.0541 15.1265 14.0541 17.2162C14.0541 19.3059 15.7481 21 17.8378 21C19.9276 21 21.6216 19.3059 21.6216 17.2162C21.6216 15.1265 19.9276 13.4324 17.8378 13.4324V13.4324ZM17.8378 14.7838C17.9938 14.7838 18.1277 14.8555 18.2264 14.9611C18.6763 15.3621 19.12 15.8629 19.5693 16.2956C19.7867 16.513 19.7804 16.8447 19.5693 17.0557C19.3581 17.2669 19.0202 17.2669 18.8091 17.0557L18.3784 16.625V19.1081C18.3784 19.4066 18.1364 19.6486 17.8378 19.6486C17.5393 19.6486 17.2973 19.4066 17.2973 19.1081V16.625L16.8666 17.0557C16.6554 17.2669 16.3175 17.2669 16.1064 17.0557C15.8953 16.8447 15.8911 16.513 16.1064 16.2956C16.5461 15.8532 17.0073 15.3703 17.4493 14.9611C17.548 14.8555 17.6819 14.7838 17.8378 14.7838Z"
              fill="#707683"
            ></path>
          </svg>
          <span className="editor-item__file-name">{item.file ? item.file.name : "Video"}</span>
        </Fragment>
        {/*{!item.url ? (
          <Fragment>
              <svg viewBox="0 0 16 16">
                  <path
                  fill="#000000"
                  d="M10.404 5.11l-1.015-1.014-5.075 5.074c-0.841 0.841-0.841 2.204 0 3.044s2.204 0.841 3.045 0l6.090-6.089c1.402-1.401 1.402-3.673 0-5.074s-3.674-1.402-5.075 0l-6.394 6.393c-0.005 0.005-0.010 0.009-0.014 0.013-1.955 1.955-1.955 5.123 0 7.077s5.123 1.954 7.078 0c0.004-0.004 0.008-0.009 0.013-0.014l0.001 0.001 4.365-4.364-1.015-1.014-4.365 4.363c-0.005 0.004-0.009 0.009-0.013 0.013-1.392 1.392-3.656 1.392-5.048 0s-1.392-3.655 0-5.047c0.005-0.005 0.009-0.009 0.014-0.013l-0.001-0.001 6.395-6.393c0.839-0.84 2.205-0.84 3.045 0s0.839 2.205 0 3.044l-6.090 6.089c-0.28 0.28-0.735 0.28-1.015 0s-0.28-0.735 0-1.014l5.075-5.075z"
                  />
              </svg>
              <span className="editor-item__file-name">{item.file ? item.file.name : "Video"}</span>
          </Fragment>
        ) : (
            <video class="video__upload" width="100%" height="100%" controls>
                <source src={item.url ? item.url : ''} type="video/mp4" />
            </video>
        )}*/}
      </label>
    </div>
  );
}

export default ChatEditorItemVideo;
