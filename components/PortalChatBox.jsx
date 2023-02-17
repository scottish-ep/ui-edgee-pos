import React, { useState, useEffect } from 'react';
import PortalMessage from './PortalMessage';
import MediaModal from './MediaModal';
import PortalComment from './PortalComment';
import { parseMessage } from '../data/parseMessage';
import { requestFull } from '../utils/request';
import { useMessageList } from '../hooks/useMessageList';
import LoadingComponent from './Loading/Loading';
import { func } from 'prop-types';
import Image from "next/image"

let messageId = 1;
let chunkSize = 600000;

let avaiable_message_tags = [
  'CONFIRMED_EVENT_UPDATE',
  'POST_PURCHASE_UPDATE',
  'ACCOUNT_UPDATE',
  'HUMAN_AGENT',
];

function appendMessageTagFlag(payload) {
  let tag = document.getElementById('portal-chat-box-select-message-tag').value;
  if (tag) {
    payload = {
      ...payload,
      messaging_type: 'MESSAGE_TAG',
      tag: tag,
    };
  }
  return payload;
}

function scrollToBottomChatView() {
  let objDiv = document.getElementById('portal-chat__content');
  objDiv.scrollTop = objDiv.scrollHeight;
}

function isTop(el) {
  return el.scrollTop === 0;
}

function isBottom(el) {
  // const element = document.getElementById("portal-comment__content");
  // return element.scrollTop + 600 >= element.scrollHeight;
  return Math.round(el.scrollHeight - el.scrollTop) === el.clientHeight;
}

function getCurrentUserPageAccessToken(page_id) {
  let pages_ = [];
  let return_token = null;
  if (localStorage.getItem('facebook-portal-choosed-pages-from-user')) {
    pages_ = JSON.parse(
      localStorage.getItem('facebook-portal-choosed-pages-from-user')
    );
  }
  pages_.forEach(function (page, index) {
    if (page['page_id'] == page_id) {
      return_token = page['page_token'];
      return;
    }
  });
  return return_token;
}

function PortalChatBox({ user, settings }) {
  const defaultPagination = {
    page: 0,
    lastPage: 0,
  };

  let [needUpdateComment, setNeedUpdateComment] = useState(false);
  let [isSetReply, setIsReply] = useState(false);
  let [listImageUrls, setListImageUrls] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangeUser, setIsChangeUser] = useState(false);

  let [tab, setTab] = useState('chat'); // chat | comment

  useEffect(
    function () {
      document.querySelectorAll('.image-selector').forEach(function (input) {
        input.value = '';
      });
    },
    [listImageUrls]
  );

  let {
    messageList,
    setMessageListWithOptions,
    lastCustomerIndexMessage,
    fetchMore,
    addNewMessages,
    updateMessage,
  } = useMessageList({ user, settings });

  useEffect(
    function () {
      let channel = window.__CHANNEL__;
      channel.unbind();
      channel.bind('message-event', function (response) {
        if (!user) {
          return;
        }
        let currentChatUserId = user.id;
        if (
          response.message &&
          response.user.user_id === currentChatUserId &&
          response.isMessage
        ) {
          addNewMessages([parseMessage(response.message, { isNew: true })]);
          scrollToBottomChatView();
        }
        if (!response.isMessage) {
          setNeedUpdateComment(!needUpdateComment);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, addNewMessages]
  );

  function setReplyForThisUser() {
    if (!isSetReply) {
      let url = '/portal/facebook/user/set-reply/' + user.id;
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setIsReply(true);
        });
    }
  }

  useEffect(() => {
    window.setSendMessageStatus('');
    document.getElementById('portal-chat-box-select-message-tag').value = '';
  }, [user?.id]);

  function sendMessageToFacebook(message) {
    if (!user?.id) {
      window.alertDanger('Please choose a conversation before send message');
      return;
    }

    window.setSendMessageStatus('Sending...');

    let originalMessage = message;
    message = message.replace(/(\r\n|\n|\r)/gm, '\\n');
    let body = {
      recipient: {
        id: user.id,
      },
      message: {
        text: message,
      },
    };
    body = appendMessageTagFlag(body);
    let url =
      'https://graph.facebook.com/v13.0/me/messages?access_token=' +
      getCurrentUserPageAccessToken(user.social_id);
    fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error && res.error.message) {
          window.setSendMessageStatus('Failed to send, please try again.');
          window.alertDanger(res.error.message);
        } else {
          window.setSendMessageStatus('Message is sent.');
          setReplyForThisUser();
          addNewMessages([
            {
              id: ++messageId,
              sender: 'me',
              type: 'text',
              content: originalMessage,
              quickReplyList: [],
            },
          ]);
          scrollToBottomChatView();
        }
      });
  }

  function sendMessage(e) {
    e.preventDefault();
    let form = e.target;
    let message = form.content.value;
    form.content.value = '';
    sendMessageToFacebook(message);
  }

  function sendReplyComment(e) {
    e.preventDefault();
    let form = e.target;
    let message = form.content.value;
    let data = new FormData();
    data.append('message', message);
    let actionType = document.querySelector('.fa__private-reply.active')
      ? 'private_reply'
      : 'comment';
    if (actionType == 'private_reply') {
      sendMessageToFacebook(message);
      form.content.value = '';
    } else {
      var element = document.querySelector('.fa__reply.active');
      if (element) {
        let commentId = element.getAttribute('data-id');
        CallSendReplyComment(commentId, data);
      }
    }
    form.content.value = '';
  }

  async function sendFileToFacebook(
    type,
    file,
    currentId,
    video = null,
    isMedia = false,
    thumbnailSrc = ''
  ) {
    window.setSendMessageStatus('Uploading...');
    let body = {
      recipient: {
        id: user.id,
      },
      message: {
        attachment: {
          type,
          payload: {
            url: file,
            is_reusable: true,
          },
        },
      },
    };
    body = appendMessageTagFlag(body);
    let url =
      'https://graph.facebook.com/v13.0/me/messages?access_token=' +
      getCurrentUserPageAccessToken(user.social_id);
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    if (res.error && res.error.message) {
      window.setSendMessageStatus('Something went wrong');
      window.alertDanger(res.error.message);
      updateMessage(currentId, {
        id: messageId,
        sender: 'me',
        type: 'text',
        content: 'Error: Failed to send file',
        quickReplyList: [],
      });
      scrollToBottomChatView();
      return;
    }
    window.setSendMessageStatus('Message is sent');
    setReplyForThisUser();

    if (isMedia) {
      updateMessage(currentId, {
        id: messageId,
        sender: 'me',
        type: type,
        content: file,
        quickReplyList: [],
      });
    } else if (type === 'video') {
      updateMessage(currentId, {
        id: messageId,
        sender: 'me',
        type: 'video',
        content: file,
        name: video.name,
        quickReplyList: [],
      });
    } else {
      updateMessage(currentId, {
        id: messageId,
        sender: 'me',
        type,
        content: file,
        quickReplyList: [],
      });
    }
    scrollToBottomChatView();
  }

  function OnClickSendImage() {
    useEffect(function () {
      let actionType = document.querySelector('.fa__private-reply.active')
        ? 'private_reply'
        : 'comment';
      if (tab == 'chat' || actionType == 'private_reply') {
        document.getElementById('btn__upload-media').style.display = 'none';
        document.getElementById('btn__upload-media-private').style.display =
          'none';
        listImageUrls.forEach((imageUrl) => {
          // send image after uploading
          let [currentId] = addNewMessages([
            {
              sender: 'me',
              type: 'image',
              content: '/images/loading.gif',
              quickReplyList: [],
            },
          ]);
          sendFileToFacebook('image', imageUrl, currentId);
        });
      } else if (tab == 'comment') {
        document.getElementById('btn__upload-media-comment').style.display =
          'none';
        let data = new FormData();
        data.append(
          'image',
          document
            .getElementById('btn__upload-media-comment')
            .getAttribute('data-src')
        );
        var element = document.querySelector('.fa__reply.active');
        if (element) {
          let commentId = element.getAttribute('data-id');
          CallSendReplyComment(commentId, data);
        }
      }
      setListImageUrls([]);
    }, []);
  }

  function AddImage(e) {
    useEffect(
      function () {
        let actionType = document.querySelector('.fa__private-reply.active')
          ? 'private_reply'
          : 'comment';
        if (tab == 'chat' || actionType == 'private_reply') {
          document.getElementById('btn__upload-media').style.display = 'block';
          document.getElementById('btn__upload-media').disabled = true;
          document.getElementById('btn__upload-media').innerHTML =
            'Uploading...';
          document.getElementById('btn__upload-media-private').style.display =
            'block';
          document.getElementById('btn__upload-media-private').disabled = true;
          document.getElementById('btn__upload-media-private').innerHTML =
            'Uploading...';
        } else if (tab == 'comment') {
          document.getElementById('btn__upload-media-comment').style.display =
            'block';
          document.getElementById('btn__upload-media-comment').disabled = true;
          document.getElementById('btn__upload-media-comment').innerHTML =
            'Uploading...';
        }
        if (user) {
          // TODO: upload image
          let files = e.target.files;
          let filesLength = files.length;
          if (files.length === 0) {
            return;
          }
          let countUploaded = 0;
          setListImageUrls([]);
          for (let i = 0; i < filesLength; i++) {
            let file = files[i];
            let token = document.querySelector(
              'meta[name="csrf-token"]'
            ).content;
            let data = new FormData();
            data.append('image', file);
            fetch('/file/normal-upload', {
              method: 'POST',
              headers: {
                'X-CSRF-TOKEN': token,
              },
              body: data,
            })
              .then((res) => res.json())
              .then((res) => {
                setListImageUrls((listImageUrls) => {
                  let newListImageUrls = listImageUrls.concat(res.result);
                  return newListImageUrls;
                });
                countUploaded++;
                if (countUploaded == filesLength) {
                  if (tab == 'chat' || actionType == 'private_reply') {
                    document.getElementById(
                      'btn__upload-media'
                    ).disabled = false;
                    document.getElementById('btn__upload-media').innerHTML =
                      'Send';
                    document
                      .getElementById('btn__upload-media')
                      .setAttribute('data-src', res.result);
                    document.getElementById(
                      'btn__upload-media-private'
                    ).disabled = false;
                    document.getElementById(
                      'btn__upload-media-private'
                    ).innerHTML = 'Send';
                    document
                      .getElementById('btn__upload-media-private')
                      .setAttribute('data-src', res.result);
                  } else if (tab == 'comment') {
                    document.getElementById(
                      'btn__upload-media-comment'
                    ).disabled = false;
                    document.getElementById(
                      'btn__upload-media-comment'
                    ).innerHTML = 'Send';
                    document
                      .getElementById('btn__upload-media-comment')
                      .setAttribute('data-src', res.result);
                  }
                }
              });
          }
        }
      },
      [e]
    );
  }

  function addFile(e) {
    if (user) {
      let files = e.target.files;
      if (files.length === 0) {
        return;
      }
      let file = files[0];
      e.target.value = null;

      let [currentId] = addNewMessages([
        {
          sender: 'me',
          type: 'image',
          content: '/images/loading.gif',
          quickReplyList: [],
        },
      ]);

      let data = new FormData();
      data.append('file', file);
      requestFull('/portal/facebook/send-message/' + user.id, {
        method: 'POST',
        body: data,
      })
        .then(function () {
          let url = URL.createObjectURL(file);
          updateMessage(currentId, {
            id: messageId,
            sender: 'me',
            type: 'file',
            content: url,
            name: file.name,
            quickReplyList: [],
          });
          scrollToBottomChatView();
        })
        .catch(function (res) {
          window.alertDanger(res.result);
        });
    }
  }

  function sendVideoMessage(file, url, currentId) {
    if (user) {
      sendFileToFacebook('video', url, currentId, file);
    }
  }

  function EndVideo({
    offset,
    size,
    myVideo,
    data,
    uniqueId,
    extension,
    currentId,
  }) {
    useEffect(
      function () {
        let dataForm = new FormData();
        dataForm.append('file', data);
        dataForm.append('length', offset + chunkSize);
        dataForm.append('size', size);
        dataForm.append('uniqueId', uniqueId);
        dataForm.append('extension', extension);
        let token = document.querySelector('meta[name="csrf-token"]').content;
        fetch('/file/upload', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          body: dataForm,
        })
          .then((res) => {
            let x = (offset + chunkSize) / size;
            let percent = x * 100;
            let percent_floor = Math.floor(percent);
            return res.json();
          })
          .then((res) => {
            if (res.messsage == 'failed') {
              alert('upload video failed');
            }
            if (offset + chunkSize < size) {
              readVideo({
                offset: offset + chunkSize,
                myVideo,
                size,
                uniqueId,
                extension,
                currentId,
              });
            } else {
              sendVideoMessage(myVideo, res.video, currentId);
            }
          });
      },
      [offset, size, myVideo, data, uniqueId, extension, currentId]
    );
  }

  function readVideo({
    offset,
    myVideo,
    size,
    uniqueId,
    extension,
    currentId,
  }) {
    if (size <= offset) {
      return;
    }
    let blob = myVideo.slice(offset, offset + chunkSize);
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
      EndVideo({
        offset,
        size,
        myVideo,
        data: e.target.result,
        uniqueId,
        extension,
        currentId,
      });
    });
    reader.readAsDataURL(blob);
  }

  function addVideo(e) {
    let files = e.target.files;
    if (files.length === 0) {
      return;
    }
    let file = files[0];
    let size = file.size;
    let d = new Date();
    let n = d.getTime();
    let extension = file.type.split('/').pop();
    let [currentId] = addNewMessages([
      {
        id: currentId,
        sender: 'me',
        type: 'image',
        content: '/images/loading.gif',
        quickReplyList: [],
      },
    ]);
    readVideo({
      offset: 0,
      myVideo: file,
      size,
      uniqueId: n,
      extension,
      currentId,
    });
  }

  function SelectMedia() {
    useEffect(function () {
      if (tab == 'comment') {
        if (!document.getElementById('submit__comment').disabled) {
          document.getElementById('show__media-modal').click();
        }
      } else {
        document.getElementById('show__media-modal').click();
      }
    }, []);
  }

  function SendMedia(mediaList) {
    useEffect(function () {
      for (let i = 0; i < mediaList.length; i++) {
        let media = mediaList[i];
        if (user && media.isSelected) {
          let actionType = document.querySelector('.fa__private-reply.active')
            ? 'private_reply'
            : 'comment';
          if (tab == 'chat' || actionType == 'private_reply') {
            let [currentId] = addNewMessages([
              {
                id: currentId,
                sender: 'me',
                type: 'image',
                content: '/images/loading.gif',
                quickReplyList: [],
              },
            ]);
            sendFileToFacebook(
              media.type,
              window.location.hostname + media.url,
              currentId,
              null,
              true,
              media.type == 'image'
                ? media.url
                : media.url.substring(media.url.lastIndexOf('/') + 1)
            );
            scrollToBottomChatView();
          } else if (tab == 'comment') {
            let data = new FormData();
            if (media.type == 'image') {
              data.append('image', media.url);
            } else {
              window.alertDanger('Media không phải là hình ảnh');
            }
            document.getElementById('close__modal').click();
            var element = document.querySelector('.fa__reply.active');
            if (element) {
              let commentId = element.getAttribute('data-id');
              CallSendReplyComment(commentId, data);
            }
          }
        }
      }
      document.getElementById('close__modal').click();
    }, [mediaList]);
  }

  function CallSendReplyComment({commentId, data}) {
    useEffect(function() {
      let token = document.querySelector('meta[name="csrf-token"]').content;
    fetch('/portal/facebook/send-reply-comment/' + commentId, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message == 'success') {
          let changeFlag = !needUpdateComment;
          setNeedUpdateComment(changeFlag);
        }
      });
    }, [commentId, data])
  }

  function onInputClick(e) {}

  function RemoveUploadedImages() {
    useEffect(function() {
      setListImageUrls([]);
      document.getElementById('btn__upload-media').style.display = 'none';
      document.getElementById('btn__upload-media-private').style.display = 'none';
      document.getElementById('btn__upload-media-comment').style.display = 'none';
    }, [])
  }

  function getUserMessage() {
    let recipient_id = user.id;
    let url =
      'https://graph.facebook.com/v13.0/' +
      user.conversation_info +
      '?access_token=' +
      getCurrentUserPageAccessToken(user.social_id) +
      '&fields=messages{from,id,message,to,created_time,shares{link,name,description},attachments}';
    fetch(url, {
      method: 'get',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {});
  }

  function setTabAndResetSendingStatus(chat_or_comment) {
    window.setSendMessageStatus('');
    setTab(chat_or_comment);
  }

  return (
    <div className="portal-chat">
      <MediaModal sendMedia={SendMedia} />
      <div className="portal-chat__content-container">
        <div className="portal-chat__header">
          <div
            id="trigger-reset"
            className="d-none"
            onClick={() => {
              console.log('checked');
              setIsLoading(true);
              setIsChangeUser(!isChangeUser);
              setPagination({
                ...pagination,
                page: 0,
                lastPage: 0,
              });
            }}
          />
          <div className="portal_chat_header_options">
            <button
              id="button-chat"
              type="button"
              onClick={() => {
                tab === 'comment' && setTabAndResetSendingStatus('chat');
                tab === 'comment' &&
                  setPagination({
                    ...pagination,
                    page: 0,
                  });
              }}
              className={tab === 'chat' ? 'active' : ''}
            >
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </button>
          </div>

          <div className="portal_chat_header_options">
            <button
              id="button-comment"
              type="button"
              onClick={() => {
                tab === 'chat' && setTabAndResetSendingStatus('comment');
                tab === 'chat' &&
                  setPagination({
                    ...pagination,
                    page: 0,
                  });
              }}
              className={tab === 'comment' ? 'active' : ''}
            >
              <i className="fas fa-comment-alt"></i>
              <span>Comment</span>
            </button>
          </div>
        </div>
        <div
          id="portal-chat__content"
          className={
            'portal-chat__tab portal-chat__chat portal-chat__content ' +
            (tab === 'chat' ? 'active' : '')
          }
          onScroll={function (e) {
            if (isTop(e.target)) {
              fetchMore();
            }
          }}
        >
          <div className="portal__all_message-wrap">
            {messageList.map(function (message, idx) {
              let showImage = true;
              if (message.sender == 'me') {
                showImage = false;
              } else {
                if (idx != lastCustomerIndexMessage) {
                  if (
                    idx + 1 < messageList.length &&
                    messageList[idx + 1].sender == 'customer'
                  ) {
                    showImage = false;
                  }
                } else {
                  showImage = true;
                }
              }
              return (
                <PortalMessage
                  showImage={showImage}
                  key={message.id}
                  message={message}
                  user={user}
                />
              );
            })}
          </div>
        </div>
        <div
          id="portal-comment__content relative"
          className={
            'portal-chat__tab portal-chat__comment ' +
            (tab === 'comment' ? 'active' : '')
          }
          onScroll={function (e) {
            if (isBottom(e.target) && pagination.page < pagination.lastPage) {
              setPagination({
                ...pagination,
                page: pagination.page + 1,
              });
              setIsLoading(true);
            }
          }}
        >
          <div className="card-body">
            {user && tab === 'comment' && (
              <PortalComment
                key={user}
                isChangeUser={isChangeUser}
                onUpdate={(isLoading, lastPage) => {
                  setIsLoading(isLoading);
                  setPagination({
                    ...pagination,
                    lastPage: lastPage,
                  });
                }}
                user={user}
                page={pagination.page}
              />
            )}
            {isLoading && user && (
              <div className="relative">
                <LoadingComponent size={24} color="#865fe9" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={
          'portal-chat__tab portal-chat__chat portal-chat__composer ' +
          (tab === 'chat' ? 'active' : '')
        }
      >
        {!!listImageUrls.length && (
          <div className="upload__image-wrapper">
            <button className="btn btn-danger" onClick={RemoveUploadedImages}>
              X
            </button>
            {!!listImageUrls.length &&
              listImageUrls.map(function (imageUrl, idx) {
                return (
                  <Image
                    src={imageUrl}
                    key={idx}
                    className="upload__portal-image"
                    alt=""
                  ></Image>
                );
              })}
          </div>
        )}
        <div className="portal-chat__composer__action">
          <label>
            <input
              className="image-selector"
              multiple
              type="file"
              style={{ opacity: 0, zIndex: -1 }}
              onChange={AddImage}
              onClick={onInputClick}
            />
            {/* prettier-ignore */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41661 7.33339C6.41661 8.34584 5.59584 9.16661 4.58339 9.16661C3.57077 9.16661 2.75 8.34584 2.75 7.33339C2.75 6.32077 3.57077 5.5 4.58339 5.5C5.59584 5.5 6.41661 6.32077 6.41661 7.33339Z" fill="#707683"></path><path d="M19.25 2.75H2.75C1.23384 2.75 0 3.98384 0 5.5V16.5C0 16.5514 0.0127563 16.5999 0.0156097 16.6512C0.00268555 16.7612 0.00822448 16.8721 0.0485077 16.9767C0.274933 18.2656 1.39699 19.25 2.75 19.25H19.25C20.7662 19.25 22 18.0162 22 16.5V5.5C22 3.98384 20.7662 2.75 19.25 2.75ZM2.75 4.58339H19.25C19.7551 4.58339 20.1666 4.99495 20.1666 5.5V12.7775L15.345 7.95576C14.718 7.32869 13.6978 7.32869 13.0717 7.95576L8.70839 12.3191L7.55327 11.1642C6.92636 10.5371 5.90602 10.5371 5.27995 11.1642L1.83339 14.6107V5.5C1.83339 4.99495 2.24495 4.58339 2.75 4.58339Z" fill="#707683"></path></svg>
          </label>
          <label>
            <input
              type="file"
              style={{ opacity: 0, zIndex: -1 }}
              onChange={addFile}
              onClick={onInputClick}
            />
            {/* prettier-ignore */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7298 4.89638C16.6747 3.53737 16.0937 2.27881 15.0931 1.35507C14.6204 0.919794 14.0827 0.581026 13.4938 0.348616C12.9049 0.118175 12.2825 0 11.6424 0C11.5735 0 11.5026 0.00196958 11.4337 0.00393916C10.0746 0.0590874 8.81805 0.640114 7.89235 1.64263L2.16284 7.82514C1.97967 8.02409 1.98951 8.33332 2.18647 8.51844L2.58433 8.89266C2.78326 9.07977 3.09642 9.06992 3.28353 8.86902L9.01698 2.68257C9.67088 1.97352 10.6301 1.56582 11.6464 1.56582C12.5603 1.56582 13.417 1.8908 14.0552 2.48167C14.7544 3.12769 15.1621 4.00613 15.1995 4.9594C15.2369 5.91071 14.906 6.81672 14.264 7.51198L6.47624 15.8256C6.08626 16.2471 5.51705 16.4893 4.91239 16.4893C4.36879 16.4893 3.85867 16.2963 3.47854 15.9438C3.06296 15.5597 2.82267 15.0378 2.79706 14.4705C2.77343 13.9052 2.97039 13.3656 3.35051 12.9539C3.35051 12.9539 10.5986 5.21939 10.6104 5.20954C11.2446 4.5517 12.2392 5.50892 11.605 6.16676C10.5277 7.28351 7.76043 10.2714 6.40535 11.7387C6.22216 11.9376 6.23201 12.2469 6.42897 12.432L6.82683 12.8062C7.02577 12.9933 7.33892 12.9835 7.52603 12.7826L12.7434 7.15746C13.5687 6.26327 13.5136 4.8629 12.6174 4.03567C12.2097 3.65948 11.6759 3.45071 11.1185 3.45071C10.8172 3.45071 10.5257 3.50979 10.2499 3.62797C9.96634 3.74811 9.71423 3.92537 9.50544 4.15385L2.23177 11.9101C0.866853 13.3892 0.961393 15.7035 2.44055 17.0704C3.09051 17.6711 3.96697 18 4.90843 18C5.95428 18 6.93316 17.5884 7.59494 16.8714L15.3827 8.55781C16.3044 7.55728 16.783 6.25736 16.7298 4.89638Z" fill="#707683"></path></svg>
          </label>
          <label>
            <input
              type="file"
              style={{ opacity: 0, zIndex: -1 }}
              onChange={addVideo}
              onClick={onInputClick}
            />
            {/* prettier-ignore */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.08108 1C0.48216 1 0 1.48216 0 2.08108V4.24324H2.1875L4.98311 1H1.08108ZM6.40203 1L3.60642 4.24324H7.59291L10.3885 1H6.40203ZM11.8074 1L9.01183 4.24324H12.9983L15.7939 1H11.8074ZM17.2128 1L14.4172 4.24324H18.9189V2.08108C18.9189 1.48216 18.4368 1 17.8378 1H17.2128ZM0 5.32432V17.2162C0 17.8151 0.48216 18.2973 1.08108 18.2973H13.6571C13.5674 17.9504 13.5135 17.5912 13.5135 17.2162C13.5135 14.8279 15.4496 12.8919 17.8378 12.8919C18.2128 12.8919 18.572 12.9458 18.9189 13.0355V5.32432H0V5.32432ZM8.10811 9.10811L12.4324 11.8108L8.10811 14.5135V9.10811ZM17.8378 13.4324C15.7481 13.4324 14.0541 15.1265 14.0541 17.2162C14.0541 19.3059 15.7481 21 17.8378 21C19.9276 21 21.6216 19.3059 21.6216 17.2162C21.6216 15.1265 19.9276 13.4324 17.8378 13.4324V13.4324ZM17.8378 14.7838C17.9938 14.7838 18.1277 14.8555 18.2264 14.9611C18.6763 15.3621 19.12 15.8629 19.5693 16.2956C19.7867 16.513 19.7804 16.8447 19.5693 17.0557C19.3581 17.2669 19.0202 17.2669 18.8091 17.0557L18.3784 16.625V19.1081C18.3784 19.4066 18.1364 19.6486 17.8378 19.6486C17.5393 19.6486 17.2973 19.4066 17.2973 19.1081V16.625L16.8666 17.0557C16.6554 17.2669 16.3175 17.2669 16.1064 17.0557C15.8953 16.8447 15.8911 16.513 16.1064 16.2956C16.5461 15.8532 17.0073 15.3703 17.4493 14.9611C17.548 14.8555 17.6819 14.7838 17.8378 14.7838Z" fill="#707683"></path></svg>
          </label>
          <label>
            {/* prettier-ignore */}
            <svg onClick={SelectMedia} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path d="M9.06641 19.4219H12.9336C13.2898 19.4219 13.5781 19.1336 13.5781 18.7773C13.5781 18.4211 13.2898 18.1328 12.9336 18.1328H9.06641C8.71015 18.1328 8.42188 18.4211 8.42188 18.7773C8.42188 19.1336 8.71015 19.4219 9.06641 19.4219Z" fill="#707683"></path><path d="M9.06641 22H12.9336C13.2898 22 13.5781 21.7117 13.5781 21.3555C13.5781 20.9992 13.2898 20.7109 12.9336 20.7109H9.06641C8.71015 20.7109 8.42188 20.9992 8.42188 21.3555C8.42188 21.7117 8.71015 22 9.06641 22Z" fill="#707683"></path><path d="M11.5061 6.73312C11.384 6.5783 11.1971 6.48828 11.0001 6.48828C10.803 6.48828 10.6161 6.5783 10.494 6.73312L7.27135 10.6003C7.11838 10.7942 7.08947 11.0585 7.1977 11.2814C7.30534 11.5036 7.53067 11.6445 7.7774 11.6445H8.42193V16.1992C8.42193 16.5555 8.7102 16.8438 9.06646 16.8438H12.9336C13.2899 16.8438 13.5782 16.5555 13.5782 16.1992V11.6445H14.2227C14.4694 11.6445 14.6948 11.5036 14.8024 11.2814C14.9107 11.0585 14.8817 10.7942 14.7287 10.6003L11.5061 6.73312Z" fill="#707683"></path><path d="M18.0326 5.23699C17.76 3.81133 16.5446 2.67253 15.0617 2.5838C14.3221 1.02029 12.7454 0 11 0C9.25461 0 7.67791 1.02029 6.93834 2.5838C5.4554 2.67253 4.23998 3.81133 3.96743 5.23699C1.75626 5.52591 0 7.42234 0 9.71094C0 12.1807 2.04467 14.2227 4.55469 14.2227H7.13281V12.8216C6.66136 12.6535 6.26106 12.3054 6.03762 11.8434C5.716 11.1819 5.80284 10.38 6.25917 9.80156L9.50387 5.90795C9.85067 5.46734 10.4039 5.19922 11 5.19922C11.5961 5.19922 12.1493 5.46734 12.5182 5.93502L15.7188 9.77513C16.1972 10.38 16.284 11.1819 15.9617 11.8447C15.7383 12.306 15.3386 12.6535 14.8671 12.8215V14.2227H17.4453C19.9598 14.2227 22 12.1764 22 9.71094C22 7.42234 20.2437 5.52591 18.0326 5.23699Z" fill="#707683"></path></g><defs><clipPath id="clip0"><rect width="22" height="22" fill="white"></rect></clipPath></defs></svg>
          </label>
          <span
            id="btn__upload-media"
            onClick={OnClickSendImage}
            className="btn btn-primary btn__upload-media"
          >
            Send
          </span>
          <select id="portal-chat-box-select-message-tag" defaultValue="">
            <option value="" disabled>
              Select a message tag
            </option>
            <option value="">None</option>
            {avaiable_message_tags.map((tag, index) => {
              return (
                <option key={index} value={tag}>
                  {tag}
                </option>
              );
            })}
          </select>
          <div className="portal_chat_noti_sending_msg_wrapper">
            <span className="portal_chat_noti_sending_msg"></span>
          </div>
        </div>

        <form
          id="form__chat"
          data-prevent_default="true"
          onSubmit={sendMessage}
        >
          <textarea
            id="submit__chat"
            type="text"
            name="content"
            placeholder="Type a message"
          />
          <button id="send__message--btn" type="submit" hidden />
        </form>
      </div>

      <div
        className={
          'portal-chat__tab portal-chat__comment-reply portal-chat__composer ' +
          (tab === 'comment' ? 'active' : '')
        }
      >
        <div className="portal-chat__composer__action">
          <label>
            <input
              multiple
              className="image-selector"
              id="add__image__comment"
              type="file"
              style={{ opacity: 0, zIndex: -1 }}
              onChange={AddImage}
              onClick={onInputClick}
              disabled
            />
            {/* prettier-ignore */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41661 7.33339C6.41661 8.34584 5.59584 9.16661 4.58339 9.16661C3.57077 9.16661 2.75 8.34584 2.75 7.33339C2.75 6.32077 3.57077 5.5 4.58339 5.5C5.59584 5.5 6.41661 6.32077 6.41661 7.33339Z" fill="#707683"></path><path d="M19.25 2.75H2.75C1.23384 2.75 0 3.98384 0 5.5V16.5C0 16.5514 0.0127563 16.5999 0.0156097 16.6512C0.00268555 16.7612 0.00822448 16.8721 0.0485077 16.9767C0.274933 18.2656 1.39699 19.25 2.75 19.25H19.25C20.7662 19.25 22 18.0162 22 16.5V5.5C22 3.98384 20.7662 2.75 19.25 2.75ZM2.75 4.58339H19.25C19.7551 4.58339 20.1666 4.99495 20.1666 5.5V12.7775L15.345 7.95576C14.718 7.32869 13.6978 7.32869 13.0717 7.95576L8.70839 12.3191L7.55327 11.1642C6.92636 10.5371 5.90602 10.5371 5.27995 11.1642L1.83339 14.6107V5.5C1.83339 4.99495 2.24495 4.58339 2.75 4.58339Z" fill="#707683"></path></svg>
          </label>
          <label>
            {/* prettier-ignore */}
            <svg onClick={SelectMedia} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path d="M9.06641 19.4219H12.9336C13.2898 19.4219 13.5781 19.1336 13.5781 18.7773C13.5781 18.4211 13.2898 18.1328 12.9336 18.1328H9.06641C8.71015 18.1328 8.42188 18.4211 8.42188 18.7773C8.42188 19.1336 8.71015 19.4219 9.06641 19.4219Z" fill="#707683"></path><path d="M9.06641 22H12.9336C13.2898 22 13.5781 21.7117 13.5781 21.3555C13.5781 20.9992 13.2898 20.7109 12.9336 20.7109H9.06641C8.71015 20.7109 8.42188 20.9992 8.42188 21.3555C8.42188 21.7117 8.71015 22 9.06641 22Z" fill="#707683"></path><path d="M11.5061 6.73312C11.384 6.5783 11.1971 6.48828 11.0001 6.48828C10.803 6.48828 10.6161 6.5783 10.494 6.73312L7.27135 10.6003C7.11838 10.7942 7.08947 11.0585 7.1977 11.2814C7.30534 11.5036 7.53067 11.6445 7.7774 11.6445H8.42193V16.1992C8.42193 16.5555 8.7102 16.8438 9.06646 16.8438H12.9336C13.2899 16.8438 13.5782 16.5555 13.5782 16.1992V11.6445H14.2227C14.4694 11.6445 14.6948 11.5036 14.8024 11.2814C14.9107 11.0585 14.8817 10.7942 14.7287 10.6003L11.5061 6.73312Z" fill="#707683"></path><path d="M18.0326 5.23699C17.76 3.81133 16.5446 2.67253 15.0617 2.5838C14.3221 1.02029 12.7454 0 11 0C9.25461 0 7.67791 1.02029 6.93834 2.5838C5.4554 2.67253 4.23998 3.81133 3.96743 5.23699C1.75626 5.52591 0 7.42234 0 9.71094C0 12.1807 2.04467 14.2227 4.55469 14.2227H7.13281V12.8216C6.66136 12.6535 6.26106 12.3054 6.03762 11.8434C5.716 11.1819 5.80284 10.38 6.25917 9.80156L9.50387 5.90795C9.85067 5.46734 10.4039 5.19922 11 5.19922C11.5961 5.19922 12.1493 5.46734 12.5182 5.93502L15.7188 9.77513C16.1972 10.38 16.284 11.1819 15.9617 11.8447C15.7383 12.306 15.3386 12.6535 14.8671 12.8215V14.2227H17.4453C19.9598 14.2227 22 12.1764 22 9.71094C22 7.42234 20.2437 5.52591 18.0326 5.23699Z" fill="#707683"></path></g><defs><clipPath id="clip0"><rect width="22" height="22" fill="white"></rect></clipPath></defs></svg>
          </label>
          <span
            id="btn__upload-media-private"
            onClick={OnClickSendImage}
            className="btn btn-primary btn__upload-media"
          >
            Send
          </span>
          <span
            id="btn__upload-media-comment"
            onClick={OnClickSendImage}
            className="btn btn-primary btn__upload-media"
          >
            Send
          </span>
          <div className="portal_chat_noti_sending_msg_wrapper">
            <span className="portal_chat_noti_sending_msg"></span>
          </div>
        </div>
        <form
          id="form__chat_element"
          data-prevent_default="true"
          onSubmit={sendReplyComment}
        >
          <textarea
            id="submit__comment"
            type="text"
            name="content"
            placeholder="Type a reply"
            disabled
          />
          <button id="send__message-comment-btn" type="submit" hidden></button>
        </form>
      </div>
    </div>
  );
}

export default PortalChatBox;
