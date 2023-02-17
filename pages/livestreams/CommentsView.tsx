/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import LivestreamApi from "../../services/livestream";
import { isArray } from "../../utils/utils";
import { get } from "lodash";
import { format } from "date-fns/esm";
import { VariableSizeList } from "react-window";
import classNames from "classnames";
import styles from "./styles.module.css";

export interface CommentsProps {
  livestream_id: string;
  is_mobile: boolean;
}

export const CommentsView = ({ livestream_id, is_mobile }: CommentsProps) => {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    getCommentList();
  }, [livestream_id]);

  const getCommentList = async () => {
    const data = await LivestreamApi.getListComment({
      limit: 1000,
      livestream_id: livestream_id,
    });
    if (data) {
      setComments(data.data);
    }
  };

  if (!is_mobile) {
    return (
      <div className={styles.comment_container} id="video-comments">
        <div className={styles.comment_title}>Trò chuyện</div>
        <div className={styles.comment_break}></div>
        <div className={styles.wrapper_comment + " w-full"}>
          {isArray(comments) &&
            comments.map((item, index) => (
              <div key={index} className={styles.box_comment}>
                <div className={styles.name_user}>
                  {get(item, "user.customer.name") ||
                    get(item, "user.name") ||
                    get(item, "user.phone") ||
                    ""}
                  <span className={styles.content_comment}>
                    {" "}
                    {get(item, "created_at")
                      ? format(new Date(get(item, "created_at")), "HH:mm")
                      : ""}
                  </span>
                </div>
                <div className={styles.content_comment}>
                  {get(item, "comment") || ""}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={classNames(styles.comment_mobile)}
        id="video-comments-mobile"
      >
        <div>
          <div className={styles.wrapper_comment}>
            <VariableSizeList
              itemCount={comments.length}
              itemSize={(index) => {
                const comment = get(comments[index], "comment");
                const nameLineHeight = 21;
                const charactersPerLine = 31;
                const defaultLineHeight = 20;
                return (
                  nameLineHeight +
                  (Math.floor(comment.length / charactersPerLine) + 1) *
                    defaultLineHeight
                );
              }}
              height={210}
              width={350}
            >
              {({ index, style }) => {
                return (
                  <div style={style} className={styles.box_comment}>
                    <div className={styles.name_user}>
                      {get(comments[index], "user.customer.name") ||
                        get(comments[index], "user.name") ||
                        get(comments[index], "user.phone") ||
                        ""}
                      <span className={styles.content_comment}>
                        {" "}
                        {get(comments[index], "created_at")
                          ? format(
                              new Date(get(comments[index], "created_at")),
                              "HH:mm"
                            )
                          : ""}
                      </span>
                    </div>
                    <div className={styles.content_comment}>
                      {get(comments[index], "comment") || ""}
                    </div>
                  </div>
                );
              }}
            </VariableSizeList>
          </div>
        </div>
      </div>
    );
  }
};
