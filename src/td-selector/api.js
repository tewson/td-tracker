import axios from "axios";

export const fetchDailMembers = async houseNumber => {
  const { data: members } = await axios.get(
    `/data/dail/${houseNumber}/members.json`
  );
  return members;
};
