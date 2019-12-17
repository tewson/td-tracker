import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";
import isSameMonth from "date-fns/isSameMonth";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

import { Calendar } from "./Calendar.jsx";
import { AttendanceTooltip } from "./AttendanceTooltip.jsx";
import { ActivityModal } from "./ActivityModal.jsx";

import "react-popper-tooltip/dist/styles.css";

export const ActivityCalendar = ({ td }) => {
  const [debates, setDebates] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activityModalData, setActivityModalData] = React.useState({});
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchAttendance = async () => {
      const attendanceFilename = `${td.memberCode}.json`;

      try {
        const {
          data: { attendance }
        } = await axios.get(`/data/${attendanceFilename}`);

        setAttendance(attendance);
        setMessage(null);
      } catch (error) {
        if (error.response.status === 404) {
          console.warn(`${attendanceFilename} not found.`);
        } else {
          console.error(error);
        }
        setAttendance({});
        setMessage("No attendance data available yet.");
      }
    };

    const fetchDebates = async () => {
      const currentDate = new Date();

      const {
        data: { results: debates }
      } = await axios.get("https://api.oireachtas.ie/v1/debates", {
        params: {
          date_start: format(startOfYear(currentDate), "yyyy-MM-dd"),
          date_end: format(endOfYear(currentDate), "yyyy-MM-dd"),
          member_id: td.uri,
          limit: 10000
        }
      });

      setDebates(debates);
    };

    fetchAttendance();
    fetchDebates();
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
