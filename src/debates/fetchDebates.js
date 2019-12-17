import axios from "axios";
import format from "date-fns/format";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

export const fetchDebates = async td => {
  const currentDate = new Date();

  const {
    data: { results: debates }
  } = await axios.get("https://api.oireachtas.ie/v1/debates", {
    params: {
      date_start: format(startOfYear(currentDate), "yyyy-MM-dd"),
      date_end: format(endOfYear(currentDate), "yyyy-MM-dd"),
      member_id: td.uri,
      limit: 10000
    }
  });

  return debates;
};
