import React, { Fragment } from "react";

function Image({ src, alt, height, width }) {
  let isNewImage = typeof height === "undefined" || typeof width === "undefined";
  if (isNewImage) {
    return (
      <a href={src} target="_blank" rel="noreferrer" style={{ display: "block" }} aria-label="View this image in a new tab">
        <img src={src} alt={alt} style={{ maxHeight: "400px", maxWidth: "100%" }} />
      </a>
    )
  }
  let ratio = height / width;
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "block",
        height: 0,
        maxWidth: "100%",
        paddingBottom: `${ratio * 100}%`,
        position: "relative",
        width: `${Math.min(400, height) / ratio}px`,
      }}
      aria-label="View this image in a new tab"
    >
      <img
        src={src}
        alt={alt}
        style={{
          inset: 0,
          width: "100%",
        }}
      />
    </a>
  );
}

function Video({ src, height, width }) {
  let isNewVideo = typeof height === "undefined" || typeof width === "undefined";
  let ratio = !isNewVideo ? height / width : 0;
  return (
    <div
      style={{
        ...(!isNewVideo && {
          height: 0,
          paddingBottom: `${ratio * 100}% `,
        }),
        position: "relative",
      }}
    >
      <video
        controls
        style={
          isNewVideo
            ? {}
            : {
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
              }
        }
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

function PortalMessage({ showImage, message, user }) {
  let content = null;
  switch (message.type) {
    case "text": {
      content = message.content;
      break;
    }
    case "fallback": {
      content = message.content;
      break;
    }
    case "image": {
      content = (
        <Image src={message.content} alt="" height={message.height} width={message.width} />
      );
      break;
    }
    case "video": {
      content = <Video src={message.content} height={message.height} width={message.width} />;
      break;
    }
    case "file": {
      content = (
        <a href={message.url} target="_blank" rel="noreferrer">
          <svg style={{ minWidth: "16px" }} width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="#000000"
              d="M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"
            />
          </svg>
          {message.name}
        </a>
      );
      break;
    }
    case "template": {
      content = (
        <Fragment>
          <a target="_blank" rel="noreferrer" href={message.conversation_link}>--Xem nội dung này trên Facebook--</a>
          {message.elements && message.elements.length > 0 && (
            <div className="portal-message-template__wrapper">
              <img src={message.elements[0].image_url} alt="" />
              <div className="portal-message-template__content">
                <div className="portal-message-template__title">
                  <h3>{message.elements[0].title}</h3>
                  {message.elements[0].subtitle && <p>{message.elements[0].subtitle}</p>}
                </div>
                {message.elements[0].buttons &&
                  message.elements[0].buttons.map((button, idx) => {
                    return (
                      <button key={idx} className="portal-message__button">
                        <a href={button.type == "web_url" ? button.url : "#"}>{button.title}</a>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </Fragment>
      );
      break;
    }
    default: {
      content = (
        <Fragment>
          <svg style={{ minWidth: "16px" }} width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="#000000"
              d="M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"
            />
          </svg>
          <a href={message.url} target="_blank" rel="noreferrer">
            {message.name}
          </a>
        </Fragment>
      );
      break;
    }
  }
  return (
    <div id={`message-${message.id}`} className={"portal-message--wrapper " + message.sender}>
      {message.sender === "customer" && (
        <div className="wrap__customer__ava">
          {showImage && user && <img src={user.pfpURL} alt="" className="portal-message__pfp" />}
        </div>
      )}
      <div
        style={{
          flexGrow: "1",
          display: "flex",
          width: "100%",
          minWidth: 0,
          ...(message.sender === "me"
            ? {
                justifyContent: "flex-end",
              }
            : {}),
        }}
      >
        <div
          style={{
            [message.type === "video" ? "width" : "maxWidth"]: "70%",
            position: "relative",
          }}
        >
          <div className={"portal-message " + message.type}>{content}</div>
          <span className="time__show">{message.createdAt}</span>
        </div>
        {message && message.quickReplyList && message.quickReplyList.length > 0 && (
          <div>
            {message.quickReplyList.map(function (reply, idx) {
              return (
                <button key={idx} type="button" className="portal-message__quick-reply">
                  {reply}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PortalMessage;
