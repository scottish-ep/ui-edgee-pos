let dummyMessageList = [
  {
    id: 1,
    sender: "customer", // "me" | "customer"
    type: "text",
    content: "Kem dưỡng ẩm xài như thế nào vậy chị ?",
    quickReplyList: ["Tư vấn cách sử dụng", "Công dụng của sản phẩm"],
  },
  {
    id: 2,
    sender: "me", // "me" | "customer"
    type: "text",
    content: "Chào chị, công dụng của kem dưỡng ẩm là chống da khô, lão hóa, kiểm soát dầu nhờn",
    quickReplyList: [],
  },
  {
    id: 3,
    sender: "customer",
    type: "text",
    content: "Đặt hàng khi nào nhận được hàng vậy chị ?",
    quickReplyList: ["Thời gian nhận hàng", "Chi phí ship hàng", "Thông tin giao hàng"],
  },
];

export default dummyMessageList;
