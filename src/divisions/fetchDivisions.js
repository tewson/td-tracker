import axios from "axios";
import format from "date-fns/format";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

export const fetchDivisions = async td => {
  const currentDate = new Date();

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