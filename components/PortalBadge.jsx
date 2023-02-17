import React from "react";

function PortalBadge({ badge, badgeTooltip }) {
  return (
    <div className="portal-badge">
      <span>{badge}</span>
      <span className="portal-badge__tooltip">{badgeTooltip}</span>
    </div>
  );
}

export default PortalBadge;
