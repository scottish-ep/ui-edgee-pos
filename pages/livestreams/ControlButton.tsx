import {
  faChevronDown,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { ReactElement, useState } from "react";
import { Popover } from "react-tiny-popover";
import styles from "./styles.module.css";
import { ReactNode } from "react";
import Icon from "../../components/Icon/Icon";

export interface MenuItem {
  label: string;
}
interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  svg?: ReactNode;
  className?: string;
  popoverContainerClassName?: string;
  popoverTriggerBtnClassName?: string;
  popoverTriggerBtnSeparatorClassName?: string;
  menuItems?: MenuItem[];
  onMenuItemClick?: (item: MenuItem) => void;
}

export const ControlButton = ({
  label,
  disabled,
  onClick,
  iconColor,
  iconSize = 48,
  svg,
  icon,
  className,
  menuItems,
  popoverContainerClassName,
  popoverTriggerBtnClassName,
  popoverTriggerBtnSeparatorClassName,
  onMenuItemClick,
  ...rest
}: ButtonProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  let classes = styles.button;
  if (className) {
    classes += ` ${className}`;
  }

  const handleMenuClick = (item: MenuItem) => {
    setMenuVisible(false);
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  let menuTrigger: ReactElement | undefined;
  let menu: ReactElement = <div />;
  if (menuItems && menuItems.length > 0) {
    classes += ` ${styles.hasDropdown}`;
    menuTrigger = (
      <button
        disabled={disabled}
        className={`${styles.button} ${popoverTriggerBtnClassName}  ${styles.dropdown}`}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <div
          className={`${styles.separator} ${popoverTriggerBtnSeparatorClassName}`}
        />
        <FontAwesomeIcon height={32} icon={faChevronDown} />
      </button>
    );

    menu = (
      <div className={`${styles.popoverMenu} ${popoverContainerClassName}`}>
        <ul className={styles.list}>
          {menuItems?.map((item, i) => {
            return (
              <li key={i} onClick={() => handleMenuClick(item)}>
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const mainContent = (
    <button
      disabled={disabled}
      // className={classes}
      className={classNames(styles.button_container)}
      onClick={() => {
        setMenuVisible(false);
        if (onClick) onClick();
      }}
    >
      {icon && (
        <Icon
          icon={icon}
          size={iconSize || 48}
          color={iconColor || "#4B4B59"}
        />
      )}
      {svg && svg}
      <span className={styles.button_text}>{label}</span>
    </button>
  );

  if (!menuTrigger) {
    return mainContent;
  }

  return (
    <Popover isOpen={menuVisible} positions={["top"]} content={menu}>
      <div className={styles.buttonWrapper}>
        {mainContent}
        {/* {menuTrigger} */}
      </div>
    </Popover>
  );
};
