import React from "react";
import "./popup.css";
function popup({ trigger, setTrigger, children }) {
  return trigger ? (
    <div className="popup">
      <div className="popup-inner">{children}</div>
    </div>
  ) : (
    ""
  );
}

export default popup;
