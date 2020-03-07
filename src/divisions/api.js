import axios from "axios";
import format from "date-fns/format";

import { getStartAndEndOfYear } from "../utils.js";

let cachedAllDailDivisions = {};

export const fetchDivisions = async (year, td) => {
  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      member_id: td.uri,
      limit: 10000
    }
  });

  return results.map(result => result.division);
};

export const fetchAllDailDivisions = async (houseNumber, year) => {
  if (
    cachedAllDailDivisions[houseNumber] &&
    cachedAllDailDivisions[houseNumber][year]
  ) {
    return cachedAllDailDivisions[houseNumber][year];
  }

  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      chamber_id: `https://data.oireachtas.ie/ie/oireachtas/house/dail/${houseNumber}`,
      chamber: "dail",
      limit: 10000
    }
  });

  if (!cachedAllDailDivisions[houseNumber]) {
    cachedAllDailDivisions[houseNumber] = {};
  }

  cachedAllDailDivisions[houseNumber][year] = results.map(
    result => result.division
  );
  return fetchAllDailDivisions(houseNumber, year);
};
