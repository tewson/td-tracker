import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

export const getStartAndEndOfYear = year => {
  const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;
  const firstDateOfYear = new Date(yearNumber, 0, 1);

  return {
    startOfYear: startOfYear(firstDateOfYear),
    endOfYear: endOfYear(firstDateOfYear)
  };
};
