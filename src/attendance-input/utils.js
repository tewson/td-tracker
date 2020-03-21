import {
  DEFAULT_ATTENDANCE_SOURCE_URL,
  DEFAULT_ATTENDANCE_RECORD_DATE,
  DEFAULT_NUMBER_OF_SITTING_DAYS_IN_PERIOD
} from "./constants";

export const downloadAttendanceFile = (filename, attendance) => {
  const attendanceFileContent = JSON.stringify(
    {
      source: DEFAULT_ATTENDANCE_SOURCE_URL,
      recordDate: DEFAULT_ATTENDANCE_RECORD_DATE,
      attendance,
      numberOfSittingDaysInPeriod: DEFAULT_NUMBER_OF_SITTING_DAYS_IN_PERIOD
    },
    null,
    2
  );
  const attendanceFileBlob = new Blob([attendanceFileContent], {
    type: "application/json"
  });
  const attendanceFileUrl = URL.createObjectURL(attendanceFileBlob);
  var a = document.createElement("a");
  a.download = filename;
  a.href = attendanceFileUrl;
  a.click();
};
