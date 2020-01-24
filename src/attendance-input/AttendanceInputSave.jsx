import React from "react";

export const AttendanceInputSave = ({ filename, onSave }) => {
  return (
    <div className="container has-text-right">
      {filename}
      <button className="button is-primary" onClick={onSave}>
        Save
      </button>
    </div>
  );
};
