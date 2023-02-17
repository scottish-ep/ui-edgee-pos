import { atom, selector } from "recoil";
import memoize from "lodash/memoize";

let itemListState = atom({
  key: "itemListState",
  default: window.__FACEBOOK__MESSAGE__ ? window.__FACEBOOK__MESSAGE__.facebook_message_blocks : [],
});

console.log(
  window.__FACEBOOK__MESSAGE__ ? window.__FACEBOOK__MESSAGE__.facebook_message_blocks : [],
);

let itemWithId = memoize(function (id, metadata) {
  let defaultValue;
  switch (metadata.type) {
    case "text":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            value: metadata.defaultValue ? metadata.defaultValue.value : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
    case "image":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            url: metadata.defaultValue,
            file: metadata.defaultValue ? metadata.defaultValue.file : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
    case "audio":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            url: metadata.defaultValue,
            file: metadata.defaultValue ? metadata.defaultValue.file : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
    case "file":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            url: metadata.defaultValue,
            file: metadata.defaultValue ? metadata.defaultValue.file : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
    case "video":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            url: metadata.defaultValue,
            file: metadata.defaultValue ? metadata.defaultValue.file : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
    case "delay":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            value: metadata.defaultValue ? metadata.defaultValue.value : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : 3,
          };
      break;
    case "card":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : Array.from({ length: metadata.settings.length }, () => ({
            imageURL: "",
            imageFile: null,
            title: "",
            subtitle: "",
            order: "",
          }));
      break;
    case "gallery":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : Array.from({ length: metadata.settings.length }, () => ({
            imageURL: "",
            imageFile: null,
            title: "",
            subtitle: "",
            order: "",
          }));
      break;
    case "button":
      defaultValue = metadata.defaultValue
        ? metadata.defaultValue
        : {
            value: metadata.defaultValue ? metadata.defaultValue.value : "",
            order: metadata.defaultValue ? metadata.defaultValue.order : "",
          };
      break;
  }
  return atom({
    key: "item" + id,
    default: defaultValue,
  });
});

let quickReplyListState = atom({
  key: "quickReplyList",
  default: [],
});

let buttonListOfItemWithId = memoize(function (id, metadata) {
  let defaultValue;
  switch (metadata.type) {
    case "gallery":
      defaultValue = metadata.defaultValue
        ? Object.keys(metadata.defaultValue).map((key) => [Number(key), metadata.defaultValue[key]])
        : Array.from({ length: metadata.settings.length }, () => []);
      break;
    case "card":
      defaultValue = metadata.defaultValue
        ? Object.keys(metadata.defaultValue).map((key) => [Number(key), metadata.defaultValue[key]])
        : Array.from({ length: metadata.settings.length }, () => []);
      break;
    default:
      defaultValue = [];
      break;
  }
  return atom({
    key: `item${id}-button-list`,
    default: defaultValue,
  });
});

let rawItemListState = selector({
  key: "rawItemList",
  get: function ({ get }) {
    let itemIdList = get(itemListState);
    let itemList = itemIdList.map(function (metadata) {
      return {
        type: metadata.type,
        content: get(itemWithId(metadata.id, metadata)),
        buttonList: get(buttonListOfItemWithId(metadata.id, metadata)),
      };
    });
    return itemList;
  },
});

export { itemListState, itemWithId, quickReplyListState, buttonListOfItemWithId, rawItemListState };
