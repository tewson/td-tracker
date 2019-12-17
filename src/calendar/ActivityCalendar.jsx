import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import isSameMonth from "date-fns/isSameMonth";

import { Calendar } from "./Calendar.jsx";
import { fetchAttendance } from "../attendance/fetchAttendance.js";
import { AttendanceTooltip } from "../attendance/AttendanceTooltip.jsx";
import { fetchDebates } from "../debates/fetchDebates.js";
import { ActivityModal } from "./ActivityModal.jsx";

import "react-popper-tooltip/dist/styles.css";

export const ActivityCalendar = ({ td }) => {
  const [debates, setDebates] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activityModalData, setActivityModalData] = React.useState({});
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchAttendanceAndSetMessage = async () => {
      try {
        const attendance = await fetchAttendance(td.memberCode);
        setAttendance(attendance);
        setMessage(null);
      } catch (error) {
        if (error.response.status === 404) {
          console.warn(`Attendance data for ${td.memberCode} not available.`);
        } else {
          console.error(error);
        }
        setAttendance({});
        setMessage("No attendance data available yet.");
      }
    };

    const fetchDebatesAndSetData = async () => {
      const debates = await fetchDebates(td);

      setDebates(debates);
    };

    fetchAttendanceAndSetMessage();
    fetchDebatesAndSetData();
  }, [td]);

  const debateDates = debates.reduce((debateDatesAcc, debate) => {
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

  function closeModal() {
    document.querySelector("html").classList.remove("is-clipped");
    setActivityModalData({});
  }

  const renderDateWithActivityHighlight = (date, firstDateOfMonth) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const shortDate = format(date, "dd");

    function openModal() {
      const debatesOnDate = debates.filter(
        debate => debate.debateRecord.date === formattedDate
      );

      document.querySelector("html").classList.add("is-clipped");
      setActivityModalData({
        date,
        debates: debatesOnDate
      });
    }

    if (!isSameMonth(date, firstDateOfMonth)) {
      return <span className="has-text-grey-light">{shortDate}</span>;
    }

    if (debateDates[formattedDate] || attendance[formattedDate]) {
      if (debateDates[formattedDate]) {
        return (
          <span className="has-activity">
            <button className="button is-info" onClick={openModal}>
              {shortDate}
            </button>
          </span>
        );
      } else {
        return (
          <AttendanceTooltip
            placement="top"
            trigger="click"
            content={`Attendance type: ${attendance[formattedDate]}`}
          >
            <span className="has-activity">
              <button className="button">{shortDate}</button>
            </span>
          </AttendanceTooltip>
        );
      }
    }

    return shortDate;
  };

  return (
    <>
      {message && (
        <div className="notification activity-calendar-notification is-warning">
          {message}
        </div>
      )}
      <Calendar renderDate={renderDateWithActivityHighlight} />
      <ActivityModal
        data={activityModalData}
        closeModal={closeModal}
      ></ActivityModal>
    </>
  );
};
