import axios from "axios";

export const fetchAttendance = async memberCode => {
  const attendanceFilename = `${memberCode}.json`;

  const {
    data: { attendance }
  } = await axios.get(`/data/${attendanceFilename}`);

  return attendance;
};
