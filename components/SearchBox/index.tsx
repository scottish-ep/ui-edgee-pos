import React, {
  FC,
  InputHTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import Icon from "../Icon/Icon";
import { debounce } from "lodash";
import { useOnClickOutside } from "usehooks-ts";

interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  icon?: string;
  popupContent?: any;
  showPopup?: boolean;
  onClose?: () => void;
  onChange?: (e: any) => void;
  value?: string;
}

const SearchBox: FC<SearchBoxProps> = (props) => {
  const {
    icon,
    containerClassName,
    popupContent,
    showPopup = false,
    onClose,
    value="",
    onChange,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    onClose?.();
  });


  return (
    <div
      ref={ref}
      className={classNames("search__box__component ", containerClassName)}
    >
      <div className={classNames("flex items-center s__input__group")}>
        <div
          className={classNames(
            "flex items-center justify-center text-white font-16 font-bold text-center search__box__submit__btn"
          )}
        >
          <Icon icon="search" size={24} color="#FF970D" />
        </div>
        <input
          onChange={(e) => onChange?.(e)}
          value={value}
          type="text"
          className="search__box__input text-[14px] w-[100%]"
          {...rest}
        />
      </div>
      {showPopup ? (
        <div className="popup__content__search">{popupContent}</div>
      ) : null}
    </div>
  );
};

export default SearchBox;
