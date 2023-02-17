import React from "react";
import styles from "./TitlePage.module.css";
import Icon from "../Icon/Icon";
import classNames from "classnames";

interface TitlePageProps {
  title?: string;
  titleClassName?: string;
  href?: string;
  description?: string;
  className?: string;
}

const TitlePage = (props: TitlePageProps) => {
  const { title, href, description, className, titleClassName, ...rest } =
    props;

  return (
    <div className="flex flex-row gap-[16px] items-center">
      {href && (
        <button
          type="button"
          className={styles.button}
          onClick={() => (window.location.href = href)}
        >
          <Icon icon="back" size={24} color="#DADADD" />
        </button>
      )}
      <div className="flex flex-col gap-y-2">
        <div className={classNames(styles.title, titleClassName)}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
};

export default TitlePage;
