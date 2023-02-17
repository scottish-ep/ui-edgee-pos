// import React, { useEffect } from "react";
// import { itemListState, itemWithId, rawItemListState } from "../../states/ChatState";
// import { useRecoilValue } from "recoil";

// let countCompleteSequence = 0;

// function SendRequestCreateBlock({data, token, total}) {
//   useEffect(function() {
//     window.scrollTo(0, 0);
//   document.getElementById("overlay").style.display = "block";
//   document.body.style.overflow = "hidden";
//   fetch("/facebook/message-blocks/store", {
//     method: "POST",
//     headers: {
//       "X-CSRF-TOKEN": token,
//     },
//     body: data,
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((res) => {
//       console.log(res);
//       countCompleteSequence++;
//       if (countCompleteSequence == total) {
//         // @TODO: Update is_updated, remove message block
//         // let url = window.location.href;
//         // if (url.indexOf("facebook/setting-templates")) {
//         //     var idSettingMessage = url.substring(url.lastIndexOf('/') + 1);
//         //     fetch(
//         //         '/facebook/message-blocks/remove/'+idSettingMessage,
//         //         {
//         //             method: 'GET',
//         //         }
//         //     )
//         //     .then((res) => {
//         //         console.log(res);
//         //     });
//         // }
//         // @TODO: Redirect to config page
//         let url = window.location.href;
//         var idSettingMessage = url.substring(url.lastIndexOf("/") + 1);
//         window.location.href = "/facebook/setting-templates";
//       }
//     });
//   }, [data, token, total])
// }

// function CreateChatButton() {
//   let token = document.querySelector('meta[name="csrf-token"]').content;
//   let itemList = useRecoilValue(rawItemListState);
//   console.log(itemList);
//   function removeOldBlocks() {
//     var message = window.__FACEBOOK__MESSAGE__;
//     if (message) {
//       fetch("/facebook/setting-templates/remove-block/" + message.id, {
//         method: "GET",
//       })
//         .then((res) => {
//           return res.json();
//         })
//         .then((res) => {
//           console.log(res);
//           createBlock();
//         });
//     }
//   }
//   function createBlock() {
//     var facebookTag = document.getElementById("facebook__message-tag").value;
//     countCompleteSequence = 0;
//     for (let i = 0; i < itemList.length; i++) {
//       let type = itemList[i].type;
//       if (itemList[i].type == "gallery" && itemList[i].content.length == 1) {
//         type = "card";
//       }
//       let data = new FormData();
//       // TODO: add message type
//       data.append("message_type", "template");
//       data.append("type", type);
//       data.append("order", i);
//       data.append("message_fb_tag", facebookTag);
//       data.append("message_id", document.getElementById("message_id").value);
//       if (type == "text") {
//         data.append("value", itemList[i].content.value);
//       } else if (type == "delay") {
//         data.append("value", itemList[i].content.value);
//       } else if (type == "image") {
//         if (itemList[i].content.url && itemList[i].content.url.indexOf("blob:http") === -1) {
//           data.append("value", itemList[i].content.url);
//         } else {
//           data.append("value", itemList[i].content.file);
//         }
//       } else if (type == "card") {
//         // @TODO edit problem
//         data.append("value", itemList[i].content[0].imageFile);
//         data.append("value_title", itemList[i].content[0].title);
//         data.append("value_subtitle", itemList[i].content[0].subtitle);
//       } else if (type == "audio") {
//         // @TODO edit problem
//         if (itemList[i].content.url && itemList[i].content.url.indexOf("blob:http") === -1) {
//           data.append("value", itemList[i].content.url);
//         } else {
//           data.append("value", itemList[i].content.file);
//         }
//       } else if (type == "video") {
//         // @TODO edit problem
//         if (itemList[i].content.url && itemList[i].content.url.indexOf("blob:http") === -1) {
//           data.append("value", itemList[i].content.url);
//         } else {
//           data.append("value", itemList[i].content.file);
//         }
//       } else if (type == "file") {
//         // @TODO edit problem
//         if (itemList[i].content.url && itemList[i].content.url.indexOf("blob:http") === -1) {
//           data.append("value", itemList[i].content.url);
//         } else {
//           data.append("value", itemList[i].content.file);
//         }
//       } else if (type == "gallery") {
//         data.append("number", itemList[i].content.length);
//         for (let j = 0; j < itemList[i].content.length; j++) {
//           // @TODO edit problem
//           if (
//             itemList[i].content[j].imageURL &&
//             itemList[i].content[j].imageURL.indexOf("blob:http") === -1
//           ) {
//             data.append("value_" + j, itemList[i].content[j].imageURL);
//           } else {
//             data.append("value_" + j, itemList[i].content[j].imageFile);
//           }
//           data.append("value_title_" + j, itemList[i].content[j].title);
//           data.append("value_subtitle_" + j, itemList[i].content[j].subtitle);
//         }
//       }
//       SendRequestCreateBlock(data, token, itemList.length);
//     }
//   }
//   return (
//     <button type="button" onClick={() => removeOldBlocks()} className="page-header__next-btn">
//       Hoàn tất
//     </button>
//   );
// }

// function ChatType() {
//   return (
//     <div className="chat-type">
//       {/*<ul>
//                 <li>
//                     <svg
//                         width="20"
//                         height="20"
//                         viewBox="0 0 20 20"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg">
//                         <path
//                             d="M17.5 9.58336C17.5029 10.6832 17.2459 11.7683 16.75 12.75C16.162 13.9265 15.2581 14.916 14.1395 15.6078C13.021 16.2995 11.7319 16.6662 10.4167 16.6667C9.31678 16.6696 8.23176 16.4126 7.25 15.9167L2.5 17.5L4.08333 12.75C3.58744 11.7683 3.33047 10.6832 3.33333 9.58336C3.33384 8.26815 3.70051 6.97907 4.39227 5.86048C5.08402 4.7419 6.07355 3.838 7.25 3.25002C8.23176 2.75413 9.31678 2.49716 10.4167 2.50002H10.8333C12.5703 2.59585 14.2109 3.32899 15.4409 4.55907C16.671 5.78915 17.4042 7.42973 17.5 9.16669V9.58336Z"
//                             stroke="#7B59DE"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             />
//                         <line x1="7.5" y1="8.66663" x2="13.3333" y2="8.66663" stroke="#7B59DE" />
//                         <line x1="7.5" y1="11.1666" x2="13.3333" y2="11.1666" stroke="#7B59DE" />
//                     </svg>
//                     Post
//                 </li>
//             </ul>
//             <button type="button" className="editor-item__add-button-btn">
//                 + Tạo tin nhắn mới
//             </button>*/}
//       <CreateChatButton />
//     </div>
//   );
// }

// export default ChatType;
