import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import isSameMonth from "date-fns/isSameMonth";

import { Calendar } from "./Calendar.jsx";
import { fetchAttendance } from "../attendance/fetchAttendance.js";
import { AttendanceTooltip } from "../attendance/AttendanceTooltip.jsx";
import { fetchDebates } from "../debates/fetchDebates.js";
import { fetchDivisions } from "../divisions/fetchDivisions.js";
import { ContributionModal } from "./ContributionModal.jsx";

import "react-popper-tooltip/dist/styles.css";

export const ActivityCalendar = ({ td }) => {
  const [activityIsLoading, setActivityIsLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [contributionModalData, setContributionModalData] = useState(null);
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchActivityData = async () => {
      setActivityIsLoading(true);

      const fetchAttendancePromise = fetchAttendance(td.memberCode)
        .then(attendance => {
          setMessage(null);
          return attendance;
        })
        .catch(error => {
          if (error.response.status === 404) {
            console.warn(`Attendance data for ${td.memberCode} not available.`);
            setMessage("No attendance data available yet.");
            return {};
          } else {
            console.error(error);
            throw error;
          }
        });

      const [attendance, debates, divisions] = await Promise.all([
        fetchAttendancePromise,
        fetchDebates(td),
        fetchDivisions(td)
      ]);

      setAttendance(attendance);
      setDebates(debates);
      setDivisions(divisions);
      setActivityIsLoading(false);
    };

    fetchActivityData();
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

  const divisionDates = divisions.reduce((divisionDatesAcc, division) => {
    if (divisionDatesAcc[division.date]) {
      return {
        ...divisionDatesAcc,
        [division.date]: [...divisionDatesAcc[division.date], division]
      };
    }

    return {
      ...divisionDatesAcc,
      [division.date]: [division]
    };
  }, {});

  function closeModal() {
    document.querySelector("html").classList.remove("is-clipped");
    setContributionModalData(null);
  }

  const renderDateWithActivityHighlight = (date, firstDateOfMonth) => {
    const shortDate = format(date, "dd");

    if (!isSameMonth(date, firstDateOfMonth)) {
      return <span className="has-text-grey-light">{shortDate}</span>;
    }

    if (activityIsLoading) {
      return (
        <span className="has-activity">
          <button className="button is-loading">{shortDate}</button>
        </span>
      );
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    function openModal() {
      const debatesOnDate = debates.filter(
        debate => debate.debateRecord.date === formattedDate
      );

      const divisionsOnDate = divisions.filter(
        division => division.date === formattedDate
      );

      document.querySelector("html").classList.add("is-clipped");
      setContributionModalData({
        date,
        debates: debatesOnDate,
        divisions: divisionsOnDate
      });
    }

    if (
      debateDates[formattedDate] ||
      divisionDates[formattedDate] ||
      attendance[formattedDate]
    ) {
      if (debateDates[formattedDate] || divisionDates[formattedDate]) {
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
      <div className="legend">
        <div className="legend-item">
          <button className="button is-info">&nbsp;&nbsp;</button>
          <span className="legend-label">Contributions</span>
        </div>
        <div className="legend-item">
          <button className="button">&nbsp;&nbsp;</button>
          <span className="legend-label">Attendance</span>
        </div>
      </div>
      <Calendar renderDate={renderDateWithActivityHighlight} />
      <ContributionModal
        data={contributionModalData}
        closeModal={closeModal}
      ></ContributionModal>
    </>
  );
};
