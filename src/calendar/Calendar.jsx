import React from "react";
import format from "date-fns/format";
import getYear from "date-fns/getYear";
import startOfISOWeek from "date-fns/startOfISOWeek";
import endOfISOWeek from "date-fns/endOfISOWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";

export const Calendar = ({ activities }) => {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);

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

  const months = Array(12)
    .fill(null)
    .map((_, monthIndex) => {
      const firstDateOfMonth = new Date(currentYear, monthIndex, 1);
      const weeksInMonth = eachWeekOfInterval(
        {
          start: startOfMonth(firstDateOfMonth),
          end: endOfMonth(firstDateOfMonth)
        },
        { weekStartsOn: 1 }
      );

      return {
        name: firstDateOfMonth.toLocaleString("default", { month: "long" }),
        weeks: weeksInMonth.map(week => {
          return eachDayOfInterval({
            start: startOfISOWeek(week),
            end: endOfISOWeek(week)
          }).map(day => day);
        })
      };
    });

  return (
    <div className="columns is-multiline">
      {months.map(month => {
        return (
          <div
            key={month.name}
            className="column is-half-tablet is-one-third-desktop"
          >
            <div className="box" style={{ height: "100%" }}>
              <h6 className="title is-6">
                {month.name} {currentYear}
              </h6>
              {month.weeks.map(week => {
                return (
                  <div key={week[0].toISOString()}>
                    {week.map(day => {
                      const formattedDate = format(day, "yyyy-MM-dd");
                      const formattedDay = format(day, "dd");
                      return (
                        <span
                          key={formattedDay}
                          className={
                            debateDates[formattedDate]
                              ? "has-background-success"
                              : null
                          }
                        >
                          {formattedDay}{" "}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
