import axios from "axios";

export const fetchAttendance = async (
  houseType,
  houseTerm,
  year,
  memberCode
) => {
  const attendanceFilename = `${memberCode}.json`;

  const {
    data: { attendance, recordDate, source }
  } = await axios.get(
    `/data/${houseType}/${houseTerm}/${year}/attendance/${attendanceFilename}`
  );

  return { attendance, recordDate, source };
};
