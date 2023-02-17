// import React, { Fragment, useState, useEffect } from 'react';
// import dummyCommentList from '../dummy-data/dummyCommentList';
// import Image from "next/image"
// import parseComment from '../data/parseComment';
// import parsePost from '../data/parsePost';
// import { conformsTo } from 'lodash';
// import { async } from 'regenerator-runtime';

// const PortalComment = ({ user, page, isChangeUser, onUpdate }) => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     page == 0 && setPosts([]);
//   }, [page, isChangeUser]);

//   const HandleClickReply = (e) => {
//     useEffect(
//       function () {
//         var a = document.getElementsByClassName('fa__reply');
//         var buttons = document.getElementsByClassName('btn__reply');
//         for (var i = 0; i < a.length; i++) {
//           a[i].classList.remove('active');
//         }
//         for (i = 0; i < buttons.length; i++) {
//           buttons[i].classList.remove('active');
//         }
//         e.target.classList.add('active');
//         document.getElementById('submit__comment').removeAttribute('disabled');
//         document.getElementById('submit__comment').focus();
//         document
//           .getElementById('add__image__comment')
//           .removeAttribute('disabled');
//       },
//       [e]
//     );
//   };

//   const HandleClickPrivateMessage = (e) => {
//     useEffect(function() {
//       var a = document.getElementsByClassName('fa__reply');
//       var buttons = document.getElementsByClassName('btn__reply');
//       for (var i = 0; i < a.length; i++) {
//         a[i].classList.remove('active');
//       }
//       for (i = 0; i < buttons.length; i++) {
//         buttons[i].classList.remove('active');
//       }
//       e.target.classList.add('active');
//       document.getElementById('submit__comment').removeAttribute('disabled');
//       document.getElementById('submit__comment').focus();
//       document.getElementById('add__image__comment').removeAttribute('disabled');
//     }, [e])
//   };

//   useEffect(() => {
//     user && getData(user);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, page]);

//   const getData = (user) => {
//     var url = '/portal/facebook/comments/' + user.id + '?page=' + (page + 1);
//     fetch(url)
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.message == 'success') {
//           let postList = res.result?.data.map(parsePost);
//           setPosts(page == 0 ? postList : posts.concat(postList));
//           onUpdate(false, res.result.last_page);
//         }
//       })
//       .catch((error) => console.log(error));
//   };

//   return (
//     <Fragment>
//       {posts && posts.length
//         ? posts.map((post) => {
//             return (
//               <div key={post.id} className="comment__wrap d-flex mb-6 relative">
//                 <div
//                   className="d-flex flex-column flex-grow-1"
//                   style={{ maxWidth: 100 + '%' }}
//                 >
//                   <span className="post__content post__content-all text-dark-50 font-weight-normal comment__content font-size-sm">
//                     {post.content}
//                   </span>
//                   {post.comments &&
//                     post.comments.map(parseComment).map((comment) => {
//                       return (
//                         <div key={comment.commentId}>
//                           <div className="d-flex comment__wrap-content">
//                             <div className="symbol symbol-60 symbol-2by3 flex-shrink-0 mr-4">
//                               <div
//                                 className="symbol-label avatar"
//                                 style={{
//                                   backgroundImage:
//                                     'url(' + comment.imgUrl + ')',
//                                 }}
//                               ></div>
//                             </div>
//                             <div className="d-flex flex-column flex-grow-1">
//                               <div className="d-flex align-items-center justify-content-between">
//                                 <a
//                                   href="#"
//                                   className="user__name text-dark font-weight-bolder font-size-lg text-hover-primary mb-1"
//                                 >
//                                   {comment.name}
//                                 </a>
//                                 <div>
//                                   <button
//                                     className="btn__reply"
//                                     onClick={HandleClickReply}
//                                   >
//                                     <i
//                                       data-id={comment.commentId}
//                                       className="fas fa-comment fa__reply"
//                                     ></i>
//                                   </button>
//                                   <button
//                                     className="btn__reply"
//                                     onClick={HandleClickPrivateMessage}
//                                   >
//                                     <i
//                                       data-id={comment.commentId}
//                                       className="fa fa-reply fa__reply fa__private-reply"
//                                     ></i>
//                                   </button>
//                                 </div>
//                               </div>
//                               {comment.photo && (
//                                 <div className="post__photo">
//                                   <Image src={comment.photo} fill alt=""/>
//                                 </div>
//                               )}
//                               <span className="post__content font-weight-normal comment__content font-size-sm">
//                                 {comment.content}
//                               </span>
//                               <span className="time">{comment.sendTime}</span>
//                             </div>
//                           </div>
//                           <div className="reply__comment">
//                             {comment.replies &&
//                               comment.replies.map(parseComment).map((reply) => {
//                                 return (
//                                   <div
//                                     key={reply.commentId}
//                                     className="d-flex comment__wrap-content"
//                                   >
//                                     <div className="symbol symbol-60 symbol-2by3 flex-shrink-0 mr-4">
//                                       <div
//                                         className="symbol-label avatar"
//                                         style={{
//                                           backgroundImage:
//                                             'url(' + reply.imgUrl + ')',
//                                         }}
//                                       ></div>
//                                     </div>
//                                     <div className="d-flex flex-column flex-grow-1">
//                                       <div className="d-flex align-items-center justify-content-between">
//                                         <a
//                                           href="#"
//                                           className="user__name text-dark font-weight-bolder font-size-lg text-hover-primary mb-1"
//                                         >
//                                           {reply.name}
//                                         </a>
//                                         <div>
//                                           <button
//                                             className="btn__reply"
//                                             onClick={HandleClickReply}
//                                           >
//                                             <i
//                                               data-id={reply.commentId}
//                                               className="fas fa-comment fa__reply"
//                                             ></i>
//                                           </button>
//                                           <button
//                                             className="btn__reply"
//                                             onClick={HandleClickPrivateMessage}
//                                           >
//                                             <i
//                                               data-id={reply.commentId}
//                                               className="fa fa-reply fa__reply fa__private-reply"
//                                             ></i>
//                                           </button>
//                                         </div>
//                                       </div>
//                                       {reply.photo && (
//                                         <div className="post__photo">
//                                           <Image src={reply.photo} width="50%" alt=""/>
//                                         </div>
//                                       )}
//                                       <span className="post__content text-dark-50 font-weight-normal comment__content font-size-sm">
//                                         {reply.content}
//                                       </span>
//                                       <span className="time">
//                                         {reply.sendTime}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>
//             );
//           })
//         : null}
//     </Fragment>
//   );
// };

// export default PortalComment;
