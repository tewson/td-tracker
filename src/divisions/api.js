import axios from "axios";
import format from "date-fns/format";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

let cachedAllDailDivisions;

export const fetchDivisions = async td => {
  const currentDate = new Date(2019, 0, 1);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear(currentDate), "yyyy-MM-dd"),
      date_end: format(endOfYear(currentDate), "yyyy-MM-dd"),
      member_id: td.uri,
      limit: 10000
    }
  });

  return results.map(result => result.division);
};

export const fetchAllDailDivisions = async () => {
  if (cachedAllDailDivisions) {
    return cachedAllDailDivisions;
  }

  const currentDate = new Date(2019, 0, 1);

  const {
    data: { results }
  } = await axios.get("https://api.oireachtas.ie/v1/divisions", {
    params: {
      date_start: format(startOfYear(currentDate), "yyyy-MM-dd"),
      date_end: format(endOfYear(currentDate), "yyyy-MM-dd"),
      chamber_id: "https://data.oireachtas.ie/ie/oireachtas/house/dail/32",
      chamber: "dail",
      limit: 10000
    }
  });

  cachedAllDailDivisions = results.map(result => result.division);
  return fetchAllDailDivisions();
};