import React, { useState } from "react";
import classNames from "classnames";

interface TabProps {
  className?: string;
  list: Array<ITabList>;
  defaultActiveValue?: string;
  onTabChange?: (value: string) => void;
}

interface ITabList {
  label: string;
  value: string;
}



const TabsVerticle = (props: TabProps) => {
  const { className, list, defaultActiveValue = "", onTabChange} = props;

  const [activeValue, setActiveVal] = useState<string>(defaultActiveValue);

  const handleClickTab = (item: ITabList) => {
    onTabChange?.(item?.value);
    setActiveVal(item?.value)
  }

  if(!list || list?.length <= 0){
    return null;
  }

  return (
    <div className={classNames("custom__tab__verticle__component", className)}>
      {list?.map(item => {
        return <div onClick={() => handleClickTab(item)} key={item?.value} className={classNames("tab__ver__item", {"active": activeValue === item?.value})}>
          {item?.label}
        </div>
      })}
    </div>
  );
};

export default TabsVerticle;
