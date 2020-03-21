import axios from "axios";

export const fetchAttendance = async (
  houseType,
  houseTerm,
  year,
  memberCode
) => {
  const attendanceFilename = `${memberCode}.json`;

  const {
    data: { attendance, numberOfSittingDaysInPeriod = 0, recordDate, source }
  } = await axios.get(
    `/data/${houseType}/${houseTerm}/${year}/attendance/${attendanceFilename}`
  );

  return { attendance, numberOfSittingDaysInPeriod, recordDate, source };
};
