import React from "react";

import {
  DEFAULT_ATTENDANCE_SOURCE_URL,
  DEFAULT_ATTENDANCE_RECORD_DATE,
  DEFAULT_NUMBER_OF_SITTING_DAYS_IN_PERIOD
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
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">No. of sitting days in period</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                value={DEFAULT_NUMBER_OF_SITTING_DAYS_IN_PERIOD.toString()}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
