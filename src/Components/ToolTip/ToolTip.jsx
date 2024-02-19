import React, { useState } from "react";

const TheToolTip = ({ label, isOptional }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="field-with-details tooltip-container"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <span style={{ color: "red" }}>{label}</span>
      {showDetails && (
        <span className="details tooltip-text">
          {isOptional ? "This field is optional" : "This field is mandatory"}
        </span>
      )}
    </div>
  );
};

export default TheToolTip;
