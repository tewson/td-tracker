import axios from "axios";
import format from "date-fns/format";

import { getStartAndEndOfYear } from "../utils.js";

let cachedAllDailVotes = {};

export const fetchVotes = async (term, year, td) => {
  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      member_id: td.uri,
      chamber_id: `https://data.oireachtas.ie/ie/oireachtas/house/dail/${term}`,
      limit: 10000
    }
  });

  return results.map(result => result.division);
};

export const fetchAllDailVotes = async (houseNumber, year) => {
  if (
    cachedAllDailVotes[houseNumber] &&
    cachedAllDailVotes[houseNumber][year]
  ) {
    return cachedAllDailVotes[houseNumber][year];
  }

  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      chamber_id: `https://data.oireachtas.ie/ie/oireachtas/house/dail/${houseNumber}`,
      limit: 10000
    }
  });

  if (!cachedAllDailVotes[houseNumber]) {
    cachedAllDailVotes[houseNumber] = {};
  }

  cachedAllDailVotes[houseNumber][year] = results.map(
    result => result.division
  );
  return fetchAllDailVotes(houseNumber, year);
};
