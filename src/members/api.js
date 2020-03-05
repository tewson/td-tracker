import axios from "axios";

export const fetchDailMembers = async houseNumber => {
  const {
    data: { results }
  } = await axios.get(`/data/dail/${houseNumber}/members.json`);

  return results.map(result => result.member);
};
