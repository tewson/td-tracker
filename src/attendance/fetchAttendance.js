import axios from "axios";

export const fetchAttendance = async memberCode => {
  const attendanceFilename = `${memberCode}.json`;

  const {
    data: { attendance, recordDate }
  } = await axios.get(
    // Shamefully hard-coding the house number and year for now.
    `/data/dail/32/2019/attendance/${attendanceFilename}`
  );

  return { attendance, recordDate };
};
