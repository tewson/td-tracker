import React from "react";
import format from "date-fns/format";
import getYear from "date-fns/getYear";
import startOfISOWeek from "date-fns/startOfISOWeek";
import endOfISOWeek from "date-fns/endOfISOWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";

export const Calendar = () => {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);

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

  return months.map(month => {
    return (
      <div key={month.name} className="box">
        <h6 className="title is-6">
          {month.name} {currentYear}
        </h6>
        {month.weeks.map(week => {
          return (
            <div key={week[0].toISOString()}>
              {week.map(day => {
                const formattedDay = format(day, "dd");
                return <span key={formattedDay}>{formattedDay} </span>;
              })}
            </div>
          );
        })}
      </div>
    );
  });
};
