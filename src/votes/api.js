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

export const fetchAllDailVotes = async (term, year) => {
  if (cachedAllDailVotes[term] && cachedAllDailVotes[term][year]) {
    return cachedAllDailVotes[term][year];
  }

  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      chamber_id: `https://data.oireachtas.ie/ie/oireachtas/house/dail/${term}`,
      limit: 10000
    }
  });

  if (!cachedAllDailVotes[term]) {
    cachedAllDailVotes[term] = {};
  }

  cachedAllDailVotes[term][year] = results.map(result => result.division);
  return fetchAllDailVotes(term, year);
};
