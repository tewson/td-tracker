import React from "react";

import {
  DEFAULT_ATTENDANCE_SOURCE_URL,
  DEFAULT_ATTENDANCE_RECORD_DATE
} from "./constants";

export const AttendanceInputMeta = () => {
  return (
    <>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Source</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                value={DEFAULT_ATTENDANCE_SOURCE_URL}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Record date</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                value={DEFAULT_ATTENDANCE_RECORD_DATE}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
