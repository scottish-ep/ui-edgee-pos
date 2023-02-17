import React from "react";
import Tags from "@yaireo/tagify/dist/react.tagify";

export function TagInput({ allowedTagList, value, tagifyRef }) {
  return (
    <Tags
      tagifyRef={tagifyRef}
      settings={{
        maxTags: 6,
        dropdown: {
          enabled: 0, // always show suggestions dropdown
        },
        enforceWhitelist: true,
        editTags: false, // disable editing
      }}
      whitelist={allowedTagList}
      value={value}
    />
  );
}
