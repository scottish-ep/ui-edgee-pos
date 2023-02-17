import React from "react";
import classNames from "classnames";
import styles from "./Break.module.css";

interface BreakProps {
  className?: string;
}

const Break = (props: BreakProps) => {
  const { className } = props;

  return <div className={classNames(styles.break, className)}></div>;
};

export default Break;
