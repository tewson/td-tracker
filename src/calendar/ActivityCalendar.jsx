import React, { useEffect, useState } from "react";
import { format, isSameMonth } from "date-fns";

import { Calendar } from "./Calendar.jsx";
import { fetchAttendance } from "../attendance/fetchAttendance.js";
import { AttendanceTooltip } from "../attendance/AttendanceTooltip.jsx";
import { fetchDebates } from "../debates/fetchDebates.js";
import { fetchDivisions, fetchAllDailDivisions } from "../divisions/api.js";
import { ContributionModal } from "./ContributionModal.jsx";

import "react-popper-tooltip/dist/styles.css";

export const ActivityCalendar = ({ houseType, houseNumber, year, td }) => {
  const [activityIsLoading, setActivityIsLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [allDailDivisions, setAllDailDivisions] = useState([]);
  const [attendanceRecordDate, setAttendanceRecordDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [contributionModalData, setContributionModalData] = useState(null);
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchActivityData = async () => {
      setActivityIsLoading(true);

      const fetchAttendancePromise = fetchAttendance(
        houseType,
        houseNumber,
        year,
        td.memberCode
      )
        .then(({ attendance, recordDate }) => {
          setAttendanceRecordDate(recordDate);
          setMessage(`Attendance record date: ${recordDate}`);
          return attendance;
        })
        .catch(error => {
          if (error.response.status === 403 || error.response.status === 404) {
            console.warn(`Attendance data for ${td.memberCode} not available.`);
            setMessage("No attendance data available yet.");
            return {};
          } else {
            console.error(error);
            throw error;
          }
        });

      const [
        attendance,
        debates,
        divisions,
        allDailDivisions
      ] = await Promise.all([
        fetchAttendancePromise,
        fetchDebates(houseNumber, year, td),
        fetchDivisions(houseNumber, year, td),
        fetchAllDailDivisions(houseNumber, year)
      ]);

      setAttendance(attendance);
      setDebates(debates);
      setDivisions(divisions);
      setAllDailDivisions(allDailDivisions);
      setActivityIsLoading(false);
    };

    fetchActivityData();
  }, [houseType, houseNumber, year, td]);

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
            <button className="button is-info is-text" onClick={openModal}>
              {shortDate}
            </button>
          </span>
        );
      } else {
        return (
          <AttendanceTooltip
            placement="top"
            trigger="click"
            attendanceType={attendance[formattedDate]}
          >
            <span className="has-activity">
              <button className="button is-dark is-text">{shortDate}</button>
            </span>
          </AttendanceTooltip>
        );
      }
    }

    return shortDate;
  };

  const dailDivisions = divisions.filter(
    division => division.house.chamberType === "house"
  );

  const attendanceEntries = Object.entries(attendance);

  const sittingDayAttendanceCount = attendanceEntries.reduce(
    (count, [_, attendanceType]) => {
      if (attendanceType === "SITTING") {
        return count + 1;
      }

      return count;
    },
    0
  );

  const sittingDayAttendancePercentage =
    (sittingDayAttendanceCount / attendanceEntries.length) * 100;

  return (
    <>
      <div className="box activity-calendar-summary">
        <div className="content">
          <p>
            Cast{" "}
            {activityIsLoading ? (
              "..."
            ) : (
              <span className="has-text-weight-bold">
                {dailDivisions.length}
              </span>
            )}{" "}
            out of{" "}
            {activityIsLoading ? (
              "..."
            ) : (
              <span className="has-text-weight-bold">
                {allDailDivisions.length}
              </span>
            )}{" "}
            Dáil votes.
          </p>
          <progress
            className="progress is-primary"
            value={activityIsLoading ? null : dailDivisions.length}
            max={allDailDivisions.length}
          >
            {((dailDivisions.length / allDailDivisions.length) * 100).toFixed(
              2
            )}
            %
          </progress>

          {attendanceEntries.length > 0 && (
            <>
              <p>
                Came in{" "}
                {activityIsLoading ? (
                  "..."
                ) : (
                  <span className="has-text-weight-bold">
                    {sittingDayAttendanceCount}
                  </span>
                )}{" "}
                out of <span className="has-text-weight-bold">101</span> sitting
                days.
              </p>
              <p className="is-size-7">
                ({year}-01-01 - {attendanceRecordDate})
              </p>
              <progress
                className="progress is-primary"
                value={activityIsLoading ? null : sittingDayAttendanceCount}
                max={101}
              >
                {((sittingDayAttendanceCount / 101) * 100).toFixed(2)}%
              </progress>
              <p>
                {activityIsLoading ? (
                  "..."
                ) : (
                  <span className="has-text-weight-bold">
                    {sittingDayAttendancePercentage.toFixed(2)}%
                  </span>
                )}{" "}
                of attendance were sitting days.
              </p>
              <p className="is-size-7">
                ({year}-01-01 - {attendanceRecordDate})
              </p>
              <progress
                className="progress is-primary"
                value={
                  activityIsLoading ? null : sittingDayAttendancePercentage
                }
                max={100}
              >
                {sittingDayAttendancePercentage}%
              </progress>
            </>
          )}
        </div>
      </div>
      {message && (
        <div className="notification activity-calendar-notification">
          {message}
        </div>
      )}
      <div className="legend">
        <div className="legend-item">
          <button className="button is-info">&nbsp;&nbsp;</button>
          <span className="legend-label">Contributions</span>
        </div>
        <div className="legend-item">
          <button className="button is-dark">&nbsp;&nbsp;</button>
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
