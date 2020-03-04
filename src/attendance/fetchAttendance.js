import axios from "axios";

export const fetchAttendance = async (
  houseType,
  houseNumber,
  year,
  memberCode
) => {
  const attendanceFilename = `${memberCode}.json`;

  const {
    data: { attendance, recordDate }
  } = await axios.get(
    `/data/${houseType}/${houseNumber}/${year}/attendance/${attendanceFilename}`
  );

  return { attendance, recordDate };
};
