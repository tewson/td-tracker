import React from "react";
import format from "date-fns/format";

import { Calendar } from "./Calendar.jsx";

export const ActivityCalendar = ({ activities }) => {
  const debateDates = activities.debates.reduce((debateDatesAcc, debate) => {
    if (debateDatesAcc[debate.debateRecord.date]) {
      return {
        ...debateDatesAcc,
        [debate.debateRecord.date]: [
          ...debateDatesAcc[debate.debateRecord.date],
          debate
        ]
      };
    }

    return {
      ...debateDatesAcc,
      [debate.debateRecord.date]: [debate]
    };
  }, {});

  const renderDateWithActivityHighlight = date => (
    <span
      className={
        debateDates[format(date, "yyyy-MM-dd")]
          ? "has-background-success"
          : null
      }
    >
      {format(date, "dd")}
    </span>
  );

  return <Calendar renderDate={renderDateWithActivityHighlight} />;
};
