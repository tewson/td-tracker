import React from "react";
import classNames from "classnames";
import format from "date-fns/format";
import getYear from "date-fns/getYear";
import startOfISOWeek from "date-fns/startOfISOWeek";
import endOfISOWeek from "date-fns/endOfISOWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import isWeekend from "date-fns/isWeekend";

const defaultRenderDate = date => <span>{format(date, "dd")}</span>;

export const Calendar = ({ renderDate = defaultRenderDate }) => {
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
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                      <th
                        key={d}
                        className={classNames({
                          weekend: d === "Sa" || d === "Su"
                        })}
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {month.weeks.map(week => {
                    return (
                      <tr key={week[0].toISOString()}>
                        {week.map(date => {
                          return (
                            <td
                              key={format(date, "dd")}
                              className={classNames({
                                "weekend has-text-grey-light": isWeekend(date)
                              })}
                            >
                              {renderDate(date)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
