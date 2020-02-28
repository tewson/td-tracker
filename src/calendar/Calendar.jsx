import React from "react";
import { useParams } from "react-router-dom";
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
  const { year } = useParams();

  const currentDate = new Date(year, 0, 1);
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
        firstDate: firstDateOfMonth,
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
        const monthName = month.firstDate.toLocaleString("default", {
          month: "long"
        });

        return (
          <div
            key={monthName}
            className="column is-half-tablet is-one-third-desktop"
          >
            <div className="box" style={{ height: "100%" }}>
              <h6 className="calendar-month title is-6 has-text-centered">
                {monthName} {currentYear}
              </h6>
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                      <th
                        key={d}
                        className={classNames("has-text-centered", {
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
                              className={classNames("has-text-centered", {
                                "weekend has-text-grey-light": isWeekend(date)
                              })}
                            >
                              {renderDate(date, month.firstDate)}
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
