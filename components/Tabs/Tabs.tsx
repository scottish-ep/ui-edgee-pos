import React, { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./Select.module.css";

import { StatusEnum, StatusList } from "../../types";

interface TabsProps {
  defaultTab?: string;
  countTotal?: number;
  tabs?: { name: StatusEnum | string; count: number }[];
  onChange?: (value: string) => void;
  onClick?: (value: string) => void;
  showTabAll?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  defaultTab,
  countTotal = 0,
  tabs,
  onChange,
  onClick,
  showTabAll = true,
}) => {
  const [tabActive, setTabActive] = useState(defaultTab || "");

  useEffect(() => {
    onChange?.(tabActive);
  }, [tabActive, onChange]);

  return (
    <div className={classNames("flex -mb-[1px]", styles.container)}>
      {showTabAll && (
        <div
          className={classNames(
            "flex gap-x-1 border !border-[#DADADD] rounded-t px-3 py-[7px] font-medium text-[#1D1C2D] bg-[#F0F0F1] cursor-pointer z-10",
            {
              "bg-white font-bold !border-b-0": tabActive === "",
            },
            styles.tabs
          )}
          onClick={() => {
            onClick && onClick("");
            setTabActive("");
          }}
        >
          <span>Tất cả</span>
          <span>({countTotal})</span>
        </div>
      )}

      {tabs?.map((tab, index) => (
        <div
          key={index}
          className={classNames(
            "flex gap-x-1 border !border-[#DADADD] rounded-t px-3 py-[7px] font-medium text-[#1D1C2D] bg-[#F0F0F1] cursor-pointer z-10",
            {
              "bg-white font-bold !border-b-0": tab.name === tabActive,
            },
            styles.tabs
          )}
          onClick={() => {
            setTabActive(tab.name);
            onClick && onClick(tab.name);
          }}
        >
          <span>
            {StatusList.find((status) => status.value === tab.name)?.name ||
              tab.name}
          </span>
          <span>({tab.count})</span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
