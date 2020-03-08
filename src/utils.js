import { startOfYear, endOfYear } from "date-fns";

export const getStartAndEndOfYear = year => {
  const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;
  const firstDateOfYear = new Date(yearNumber, 0, 1);

  return {
    startOfYear: startOfYear(firstDateOfYear),
    endOfYear: endOfYear(firstDateOfYear)
  };
};

export const getNumberWithOrdinal = n => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
};
