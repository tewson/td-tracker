import React, { useCallback, useEffect, useState } from "react";
import { format, isSameMonth } from "date-fns";

import { Calendar } from "./Calendar.jsx";
import { fetchAttendance } from "../attendance/fetchAttendance.js";
import { AttendanceTooltip } from "../attendance/AttendanceTooltip.jsx";
import { fetchDebates } from "../debates/fetchDebates.js";
import { fetchVotes, fetchAllDailVotes } from "../votes/api.js";
import { ContributionModal } from "./ContributionModal.jsx";

import "react-popper-tooltip/dist/styles.css";
import { ATTENDANCE_TYPE } from "../attendance/constants.js";

const getDateAttendanceTypeMap = (attendanceDates, type) => {
  return attendanceDates.reduce(
    (acc, attendanceDate) => ({
      ...acc,
      [attendanceDate]: type
    }),
    {}
  );
};

export const ActivityCalendar = ({ houseType, houseTerm, year, td }) => {
  const [activityIsLoading, setActivityIsLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [allDailVotes, setAllDailVotes] = useState([]);
  const [attendanceRecordDate, setAttendanceRecordDate] = useState("");
  const [
    numberOfSittingDaysInPeriod,
    setNumberOfSittingDaysInPeriod
  ] = useState(0);
  const [attendanceDisplayed, setAttendanceDisplayed] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [contributionModalData, setContributionModalData] = useState(null);
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchActivityData = async () => {
      setActivityIsLoading(true);

      const [debates, votes, allDailVotes] = await Promise.all([
        fetchDebates(houseTerm, year, td),
        fetchVotes(houseTerm, year, td),
        fetchAllDailVotes(houseTerm, year)
      ]);

      setDebates(debates);
      setVotes(votes);
      setAllDailVotes(allDailVotes);
      setActivityIsLoading(false);
    };

    fetchActivityData();
  }, [houseType, houseTerm, year, td]);

  useEffect(() => {
    const fetchAndOverlayAttendance = () => {
      fetchAttendance(houseType, houseTerm, year, td.memberCode)
        .then(
          ({
            attendance: fetchedAttendance,
            numberOfSittingDaysInPeriod,
            recordDate,
            source
          }) => {
            const totalAttendanceDaysCount = Object.values(
              ATTENDANCE_TYPE
            ).reduce((acc, type) => (acc += fetchedAttendance[type].length), 0);

            setAttendanceRecordDate(recordDate);
            setNumberOfSittingDaysInPeriod(numberOfSittingDaysInPeriod);
            setMessage(
              <>
                <p>
                  <span className="has-text-weight-bold">Attendance:</span>{" "}
                  {totalAttendanceDaysCount} days<sup>*</sup> as of {recordDate}
                </p>
                <p className="is-size-7 attendance-source-container">
                  Source:{" "}
                  <a href={source}>Oireachtas records of attendance for TAA</a>
                </p>
                <p className="is-size-7">
                  <span className="has-text-weight-bold">*</span> TDs are
                  required to report only 120 days of attendance in order to
                  claim full travel and accommodation allowance (TAA).{" "}
                  <a
                    href="https://www.oireachtas.ie/en/members/salaries-and-allowances/parliamentary-standard-allowances/"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Read more
                  </a>
                </p>
              </>
            );

            const attendanceMap = {
              ...getDateAttendanceTypeMap(
                fetchedAttendance[ATTENDANCE_TYPE.SITTING],
                ATTENDANCE_TYPE.SITTING
              ),
              ...getDateAttendanceTypeMap(
                fetchedAttendance[ATTENDANCE_TYPE.OTHER],
                ATTENDANCE_TYPE.OTHER
              )
            };

            setAttendance(attendanceMap);
          }
        )
        .catch(error => {
          if (error.response.status === 403 || error.response.status === 404) {
            console.warn(`Attendance data for ${td.memberCode} not available.`);
            setMessage("No attendance data available yet.");
            setAttendance({});
          } else {
            console.error(error);
          }
        });
    };

    if (attendanceDisplayed) {
      fetchAndOverlayAttendance();
    }
  }, [attendanceDisplayed, houseTerm, houseType, td.memberCode, year]);

  const toggleAttendance = useCallback(() => {
    if (attendanceDisplayed) {
      setAttendance({});
      setAttendanceDisplayed(false);
    } else {
      setAttendanceDisplayed(true);
    }
  }, [attendanceDisplayed]);

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

  const voteDates = votes.reduce((voteDatesAcc, vote) => {
    if (voteDatesAcc[vote.date]) {
      return {
        ...voteDatesAcc,
        [vote.date]: [...voteDatesAcc[vote.date], vote]
      };
    }

    return {
      ...voteDatesAcc,
      [vote.date]: [vote]
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

      const votesOnDate = votes.filter(vote => vote.date === formattedDate);

      document.querySelector("html").classList.add("is-clipped");
      setContributionModalData({
        date,
        debates: debatesOnDate,
        votes: votesOnDate
      });
    }

    if (
      debateDates[formattedDate] ||
      voteDates[formattedDate] ||
      attendance[formattedDate]
    ) {
      if (debateDates[formattedDate] || voteDates[formattedDate]) {
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

  const dailVotes = votes.filter(vote => vote.house.chamberType === "house");

  const attendanceEntries = Object.entries(attendance);

  const sittingDayAttendanceCount = attendanceEntries.reduce(
    (count, [_, attendanceType]) => {
      if (attendanceType === ATTENDANCE_TYPE.SITTING) {
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
      <div className="has-text-right">
        <label className="checkbox">
          <input
            type="checkbox"
            value={attendanceDisplayed}
            onChange={toggleAttendance}
          />{" "}
          Attendance data
        </label>
      </div>
      <div className="box activity-calendar-summary">
        <div className="content">
          <p>
            Cast{" "}
            {activityIsLoading ? (
              "..."
            ) : (
              <span className="has-text-weight-bold">{dailVotes.length}</span>
            )}{" "}
            out of{" "}
            {activityIsLoading ? (
              "..."
            ) : (
              <span className="has-text-weight-bold">
                {allDailVotes.length}
              </span>
            )}{" "}
            Dáil votes.
          </p>
          <progress
            className="progress is-primary"
            value={activityIsLoading ? null : dailVotes.length}
            max={allDailVotes.length}
          >
            {((dailVotes.length / allDailVotes.length) * 100).toFixed(2)}%
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
                out of{" "}
                <span className="has-text-weight-bold">
                  {numberOfSittingDaysInPeriod}
                </span>{" "}
                sitting days.
              </p>
              <p className="is-size-7">
                ({year}-01-01 - {attendanceRecordDate})
              </p>
              <progress
                className="progress is-primary"
                value={activityIsLoading ? null : sittingDayAttendanceCount}
                max={numberOfSittingDaysInPeriod}
              >
                {(
                  (sittingDayAttendanceCount / numberOfSittingDaysInPeriod) *
                  100
                ).toFixed(2)}
                %
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
      {message && attendanceDisplayed && (
        <div className="notification activity-calendar-notification">
          {message}
        </div>
      )}
      {attendanceDisplayed && (
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
      )}
      <Calendar renderDate={renderDateWithActivityHighlight} />
      <ContributionModal
        data={contributionModalData}
        closeModal={closeModal}
      ></ContributionModal>
    </>
  );
};
