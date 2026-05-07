import React from "react";

const Loader = () => {
  return (
    <div className="text-center">
      <div
        className="spinner-border"
        role="status"
        style={{ color: "var(--primaryColor)" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
