// import React, { useState, useEffect, useRef } from 'react';
// import { request } from '../utils/request';
// import { PortalCustomerDetailNote } from './PortalCustomerDetailNote';
// import { TagInput } from './TagInput';
// import Image from 'next/image';

// function PortalCustomerDetail({ user, updateUserSupporterList }) {
//   let [allowedTagList, setAllowedTagList] = useState([]);
//   let [tagList, setTagList] = useState([]);
//   let tagifyRef = useRef();
//   useEffect(
//     function () {
//       window.selectedProductIds = [];
//       setAllowedTagList([]);
//       setTagList([]);
//       if (user && user.id != 1) {
//         request('/portal/facebook/user-tags').then(setAllowedTagList);
//         request('/portal/facebook/user-tags/' + user.id).then(setTagList);
//       }
//     },
//     [user]
//   );
//   function handleUpdateTagList(e) {
//     e.preventDefault();
//     if (!user) {
//       return;
//     }
//     let fullTagSet = new Set(
//       tagifyRef.current.value.map(({ value }) => value).concat(tagList)
//     );
//     let fullTagList = [...fullTagSet].map((value) => ({ value }));
//     request('/portal/facebook/user-tags/add', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ tags: fullTagList, user: user.id }),
//     })
//       .then(function (tagList) {
//         setTagList(tagList);
//         tagifyRef.current.removeAllTags();
//       })
//       .catch(function (error) {
//         window.alertDanger(error);
//       });
//   }

//   function handleRemoveTag(e) {
//     var tagValue = e.target.value;
//     request('/portal/facebook/user-tags/remove', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ tag: tagValue, user: user.id }),
//     })
//       .then(function (tagList) {
//         setTagList(tagList);
//       })
//       .catch(function (error) {
//         window.alertDanger(error);
//       });
//   }

//   function unseenMessage() {
//     fetch(`/portal/facebook/users/unseen/${user.social_id}/${user.id}`)
//       .then((res) => res.json())
//       .then(() => {
//         //Promise.all([updateUserSupporterList(user.social_id, user.id, "remove")]);
//         window.alertSuccess('Đánh dấu là chưa xem thành công');
//         // Remove staff's name from user's supporter list
//       });
//   }

//   function CreateOrder() {
//     useEffect(function () {
//       document.getElementById('sidebarCollapsePortal').click();
//     }, []);
//   }

//   function supportUser() {
//     if (updateUserSupporterList(user.social_id, user.id)) {
//       window.alertSuccess('Nhận chăm sóc thành công');
//     }
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="portal-customer-detail">
//       <div className="portal-customer-detail--wrapper">
//         <div className="portal-customer-detail__user card__border">
//           <Image id="user__detail__ava" src={user.pfpURL || '#'} alt="" />
//           <div className="portal-customer-detail__user-info">
//             <h3 className="portal-customer-detail__user-name">{user.name}</h3>
//             <a
//               href={
//                 user
//                   ? 'https://facebook.com/profile.php?id=' + user.facebook
//                   : ''
//               }
//               className="portal-customer-detail__user-fb"
//             >
//               <span>ID </span>
//               <span>
//                 <strong>{user.facebook}</strong>
//               </span>
//             </a>
//             {/*<p className="portal-customer-detail__user-phone">{user.phone}</p>*/}
//             <p className="user__order-status">
//               <span className="user__success-order">
//                 Tổng đơn hàng{' '}
//                 <strong>{user.customerDetail.totalOrderCount}</strong>
//               </span>
//               <span className="user__failed-order">
//                 Tổng đơn hủy{' '}
//                 <strong>{user.customerDetail.transferOrderCount}</strong>
//               </span>
//             </p>

//             {user.systemTag && (
//               <p className="portal-customer-detail__user-tag">
//                 {user.systemTag}
//               </p>
//             )}
//           </div>
//         </div>
//         {/* {user && user.isChatWith && (
//           <div className="wrap__support_name">
//             {user.isChatWith.map(function (supporter, idx) {
//               return (
//                 <span className="support__name" key={idx}>
//                   <i className="fa fa-user"></i> {supporter}
//                 </span>
//               );
//             })}
//           </div>
//         )} */}
//         <div className="portal-customer-detail__user_action card__border">
//           <div className="portal-customer-detail__user-section">
//             <h4>Thông tin khách hàng</h4>
//             <ul className="portal-customer-detail__info-list">
//               <li className="portal-customer-detail__info">
//                 <span>
//                   <i className="far fa-calendar-alt"></i>
//                 </span>
//                 <span>{user.customerDetail.joinTime || '-'}</span>
//               </li>
//               <li className="portal-customer-detail__info">
//                 <span>
//                   <i className="fa fa-envelope"></i>
//                 </span>
//                 <span>{user.customerDetail.email || '-'}</span>
//               </li>
//               <li className="portal-customer-detail__info">
//                 <span>
//                   <i className="fas fa-phone-alt"></i>
//                 </span>
//                 <span>{user.customerDetail.phone || '-'}</span>
//               </li>
//               <li className="portal-customer-detail__info">
//                 <span>
//                   <i className="fa fa-user"></i>
//                 </span>
//                 <span>{user.customerDetail.gender || '-'}</span>
//               </li>
//             </ul>
//           </div>
//           <div className="portal-customer-detail__user-section">
//             <h4>Ghi chú</h4>
//             <PortalCustomerDetailNote user={user} />
//           </div>
//           <div className="portal-customer-detail__user-section">
//             <h4>Loại KH</h4>
//             {tagList.map((tag, index) => (
//               <button
//                 type="button"
//                 onClick={handleRemoveTag}
//                 value={tag}
//                 className="tag__btn btn btn-light btn-hover-danger btn-sm btn-delete"
//                 key={index}
//               >
//                 X {tag}
//               </button>
//             ))}
//             <form
//               className="form__user_info_tag"
//               onSubmit={handleUpdateTagList}
//             >
//               <TagInput tagifyRef={tagifyRef} allowedTagList={allowedTagList} />
//               <button type="submit" className="save__tag-btn">
//                 <i className="fa fa-plus"></i>
//               </button>
//             </form>
//           </div>

//           <div>
//             <button
//               type="button"
//               onClick={CreateOrder}
//               className="portal-customer-detail__btn2 create__order"
//             >
//               <i className="fa fa-plus"></i> Tạo đơn hàng
//             </button>

//             <button
//               type="button"
//               onClick={supportUser}
//               className="portal-customer-detail__btn2"
//             >
//               Nhận chăm sóc
//             </button>

//             <button
//               type="button"
//               onClick={unseenMessage}
//               className="portal-customer-detail__btn2"
//             >
//               Đánh dấu là chưa xem
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PortalCustomerDetail;
