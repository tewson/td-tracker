import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";

import { Calendar } from "./Calendar.jsx";

export const ActivityCalendar = ({ td, activities }) => {
  const [attendance, setAttendance] = useState({});
  useEffect(() => {
    const fetchAttendance = async () => {
      const attendanceFilename = `${td.memberCode}.json`;

      try {
        const {
          data: { attendance }
        } = await axios.get(`/data/${attendanceFilename}`);

        setAttendance(attendance);
      } catch (error) {
        if (error.response.status === 404) {
          console.warn(`${attendanceFilename} not found.`);
        } else {
          console.error(error);
        }
      }
    };

    fetchAttendance();
  }, [td]);

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

  const renderDateWithActivityHighlight = date => {
    const formattedDate = format(date, "yyyy-MM-dd");

    return (
      <span
        className={
          debateDates[formattedDate]
            ? "has-background-success"
            : attendance[formattedDate]
            ? "has-background-grey-light"
            : null
        }
      >
        {format(date, "dd")}
      </span>
    );
  };

  return <Calendar renderDate={renderDateWithActivityHighlight} />;
};
