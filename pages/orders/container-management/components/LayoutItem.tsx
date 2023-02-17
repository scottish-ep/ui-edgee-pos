import React from "react";

interface LayoutItemProps {
  name: string;
  description: React.ReactNode;
}

const LayoutItem: React.FC<LayoutItemProps> = ({ name, description }) => (
  <div className="flex items-center gap-x-6 gap-y-2 flex-wrap min-h-[45px]">
    <div className="text-medium font-medium text-[#2E2D3D] w-[183px]">
      {name}
    </div>
    <div className="flex-1">{description}</div>
  </div>
);

export default LayoutItem;
