import axios from "axios";
import format from "date-fns/format";

import { getStartAndEndOfYear } from "../utils.js";

export const fetchDebates = async (year, td) => {
  const { startOfYear, endOfYear } = getStartAndEndOfYear(year);

  const {
    data: { results: debates }
  } = await axios.get("https://api.oireachtas.ie/v1/debates", {
    params: {
      date_start: format(startOfYear, "yyyy-MM-dd"),
      date_end: format(endOfYear, "yyyy-MM-dd"),
      member_id: td.uri,
      limit: 10000
    }
  });

  return debates;
};
