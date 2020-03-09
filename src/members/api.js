import axios from "axios";

export const fetchDailMembers = async term => {
  const {
    data: { results }
  } = await axios.get(`/data/dail/${term}/members.json`);

  return results.map(result => result.member);
};
