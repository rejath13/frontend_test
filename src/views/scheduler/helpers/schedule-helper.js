import moment from "moment";
import axios from "axios";

export const checkScheduleExpiry = (date) => {
  let isExpired = false;
  const scheduleDate = moment(date);
  if (scheduleDate) {
    const yesterday = moment().subtract(1, "days");
    isExpired = scheduleDate.isBefore(yesterday);
  }
  return isExpired;
};

export const fetchAddressFromCoordinates = async ({ lat, lng }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    if (response?.data?.results[0]) return response?.data?.results[0];
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const calculateScheduleStatus = (scheduleData) => {
  // console.log("Calculate Schedule Status: ", scheduleData);
  const {
    scheduleDate,
    fromTime,
    toTime,
    duration,
    isSentToTechnician,
    technicianId,
  } = scheduleData;
  // console.log("isSentToTechnician is ", isSentToTechnician);
  if (
    fromTime &&
    toTime &&
    duration &&
    scheduleDate &&
    isSentToTechnician &&
    parseInt(technicianId) !== 1
  ) {
    return "assigned";
  }
  if (
    fromTime &&
    toTime &&
    duration &&
    scheduleDate &&
    !isSentToTechnician &&
    parseInt(technicianId) !== 1
  ) {
    return "scheduled";
  } else return "unscheduled";
};

// export const checkScheduleOkToCreate = (scheduleFormData) => {
//   const isOkToCreate = {
//     status: false,
//     msg: "",
//   };
//   const {
//     fromTime,
//     toTime,
//     duration,
//     isSentToTechnician,
//     scheduleDate,
//     technicianId,
//   } = scheduleFormData;

//   if (!isSentToTechnician) {
//     isOkToUpdate.status = true;
//     return isOkToUpdate;
//   }
//   // Case where isSentToTechnician is already true
//   if (
//     fromTime &&
//     toTime &&
//     scheduleDate &&
//     duration &&
//     parseInt(technicianId) !== 1
//   ) {
//     isOkToUpdate.status = true;
//     return isOkToUpdate;
//   } else {
//     isOkToUpdate.status = false;
//     isOkToUpdate.msg = "Schedule  assigned! Please fill ( \n";
//     if (!fromTime) isOkToUpdate.msg += "From Time, \n";
//     if (!toTime) isOkToUpdate.msg += "To Time, \n";
//     if (!scheduleDate) isOkToUpdate.msg += "Schedule date \n";
//     if (parseInt(technicianId) === 1) isOkToUpdate.msg += "Technician \n";
//     return isOkToUpdate;
//   }
// };

export const checkJobAndScheduleQty = (job, scheduleData) => {
  // console.log(`Job : ${job} 
  //   Scheudle: ${scheduleData}
  // `);
  const {
    quantityNew: jobQtyNew,
    quantityService: jobQtyService,
    quantityMigrate: jobQtyMigrate,
    quantityTrading: jobQtyTrading,
  } = job?.salesPlus;
  const { schedQtyNew, schedQtyService, schedQtyMigrate, schedQtyTrading } =
    scheduleData;

  const isOkToUpdate = {
    status: false,
    msg: "",
  };

  if (
    schedQtyNew > jobQtyNew ||
    schedQtyService > jobQtyService ||
    schedQtyMigrate > jobQtyMigrate ||
    schedQtyTrading > jobQtyTrading
  ) {
    isOkToUpdate.status = false;
    isOkToUpdate.msg =
      "Schedule Quantities cannot be greater than Job Quantities";
    return isOkToUpdate;
  } else {
    isOkToUpdate.status = true;
    return isOkToUpdate;
  }
};

export const checkTimelineTechnicianOkToUpdate = (scheduleData) => {
  const isOkToUpdate = {
    status: false,
    msg: "",
  };

  const {
    fromTime,
    toTime,
    duration,
    isSentToTechnician,
    scheduleDate,
    technicianId,
  } = scheduleData;

  if (isSentToTechnician && parseInt(technicianId) === 1) {
    isOkToUpdate.status = false;
    isOkToUpdate.msg =
      "Schedule already Assigned. Cannot set technician to Not Assigned !";
    return isOkToUpdate;
  } else {
    isOkToUpdate.status = true;
    return isOkToUpdate;
  }
};

export const checkTimelineScheduleOkToUpdate = (scheduleData) => {
  const isOkToUpdate = {
    status: false,
    msg: "",
  };

  const { fromTime, toTime, duration, isSentToTechnician } = scheduleData;
  console.log(`
    Fromt Time: ${fromTime},
    to Time : ${toTime},
    duration: ${duration},
    isSentToTechnician: ${isSentToTechnician},

  `);

  if (isSentToTechnician) {
    if (fromTime && toTime && duration) {
      isOkToUpdate.status = true;
    } else {
      isOkToUpdate.status = false;
      isOkToUpdate.msg =
        "Schedule already Assigned. Please fill all schedule data";
    }
  } else {
    isOkToUpdate.status = true;
  }
  return isOkToUpdate;
};

export const checkScheduleOkToUpdate = (scheduleData) => {
  const isOkToUpdate = {
    status: false,
    msg: "",
  };
  const {
    fromTime,
    toTime,
    duration,
    isSentToTechnician,
    scheduleDate,
    technicianId,
  } = scheduleData;
  if (!isSentToTechnician) {
    isOkToUpdate.status = true;
    return isOkToUpdate;
  }
  // Case where isSentToTechnician is already true
  if (
    fromTime &&
    toTime &&
    scheduleDate &&
    duration &&
    parseInt(technicianId) !== 1
  ) {
    isOkToUpdate.status = true;
    return isOkToUpdate;
  } else {
    isOkToUpdate.status = false;
    isOkToUpdate.msg = "Schedule already assigned! Please fill ( \n";
    if (!fromTime) isOkToUpdate.msg += "From Time, \n";
    if (!toTime) isOkToUpdate.msg += "To Time, \n";
    if (!scheduleDate) isOkToUpdate.msg += "Schedule date \n";
    if (parseInt(technicianId) === 1) isOkToUpdate.msg += "Technician \n";
    return isOkToUpdate;
  }
};

// this is used in Send to technician component
export const checkScheduleOkToSend = ({
  scheduleDate,
  fromTime,
  toTime,
  duration,
  technicianId,
  isSentToTechnician,
}) => {
  const isOkToSend = {
    status: false,
    msg: "",
  };

  const isScheduleExpired = checkScheduleExpiry(scheduleDate);
  if (isScheduleExpired) {
    isOkToSend.status = false;
    isOkToSend.msg =
      "Schedule expired! Please create a new one or repeat this one";
    return isOkToSend;
  }

  if (isSentToTechnician) {
    isOkToSend.status = false;
    isOkToSend.msg = "Schedule already Assigned";
    return isOkToSend;
  }
  if (
    scheduleDate &&
    fromTime &&
    toTime &&
    duration &&
    parseInt(technicianId) !== 1
  ) {
    isOkToSend.status = true;
    return isOkToSend;
  } else {
    isOkToSend.status = false;
    isOkToSend.msg = "Please fill (";
    if (!fromTime) isOkToSend.msg += "From Time, ";
    if (!toTime) isOkToSend.msg += "To Time, ";
    if (!scheduleDate) isOkToSend.msg += "Schedule date, ";
    if (parseInt(technicianId) === 1) isOkToSend.msg += "Technician, ";
    isOkToSend.msg += " )";
    return isOkToSend;
  }
};

export const checkDateBeforeCurrentDay = ({ date }) => {
  const momentDate = moment(date);
  const momentCurrentDay = moment();

  return momentDate.isBefore(momentCurrentDay, "day");
};
