import moment from "moment";

export let durationMinTime = new Date().setHours(0, 0, 0);
export let durationMaxTime = new Date().setHours(12, 0, 0);

export const formFromTime = (fromTime) => {
  if (fromTime) {
    // console.log("formFromTimeBefore: ", fromTime);
    // console.log("formFromTime: ", moment(fromTime, "HH:mm:ss").toDate());
    return moment(fromTime, "HH:mm:ss").toDate();
  } else {
    return null;
  }
};
export const formDuration = (duration) => {
  if (duration) {
    return moment(duration, "HH:mm:ss").toDate();
  } else {
    return null;
  }
};
export const formToTime = (toTime) => {
  if (toTime) {
    return moment(toTime, "HH:mm:ss").toDate();
  } else {
    return null;
  }
};

export const calculateFromTime = ({ duration, toTime }) => {
  const formattedDuration = moment(duration, "hh:mm");
  const formattedToTime = moment(toTime, "hh:mm");
  const calculatedFromTime = formattedToTime.subtract({
    hours: formattedDuration.hours(),
    minutes: formattedDuration.minutes(),
  });
  return calculatedFromTime.toDate();
};

export const calculateToTime = (duration, fromTime) => {
  const formattedDuration = moment(duration, "hh:mm");
  const formattedFromTime = moment(fromTime, "hh:mm");
  const calculatedToTime = formattedFromTime.add({
    hours: formattedDuration.hours(),
    minutes: formattedDuration.minutes(),
  });
  return calculatedToTime.toDate();
};

export const calculateDuration = (fromTime, toTime) => {
  const momentFromTime = moment(fromTime, "hh:mm");
  const momentToTime = moment(toTime, "hh:mm");

  const calculatedDuration = moment.duration(momentToTime.diff(momentFromTime));

  const hours = calculatedDuration.hours();
  const minutes = calculatedDuration.minutes();
  const momentDuration = moment().set({ hours, minutes });
  return momentDuration.toDate();
};

export const showToast = (toastMessage, toastType, addToast) => {
  addToast(toastMessage, {
    appearance: toastType,
    autoDismiss: true,
  });
};

export const validateDurationChange = ({ fromTime, duration, toTime }) => {
  if (!fromTime) {
    return {
      validated: false,
      message: "Please choose a From Time",
    };
  } else {
    return { validated: true, message: "Please choose a From Time" };
  }
};

//  // Handle To Time
//  const handleToTimeChange = (datePickerTime) => {
//   const calculatedDuration = calculateDuration(info.fromTime, datePickerTime);
//   if (
//     moment(datePickerTime, "HH:mm:ss").isAfter(
//       moment(info.fromTime, "HH:mm:ss"),
//       ["hour", "minute"]
//     )
//   ) {
//     // Check whether new To Time is greater than from Time

//     setInfo((prevInfo) => ({
//       ...prevInfo,
//       duration: calculatedDuration,
//       toTime: datePickerTime,
//     }));
//   } else {
//     const toastMessage = "'To' Time cannot be less than 'from' time";
//     showToast(toastMessage, "error", addToast);

//     console.log(toastMessage);
//   }
// };

// // Handle From Time
// const handleFromTimeChange = (datePickerTime) => {
//   console.log("moment info totime: ", moment(info.toTime));
//   if (
//     moment(info.toTime, "HH:mm:ss").isAfter(
//       moment(datePickerTime, "HH:mm:ss"),
//       ["hour", "minute"]
//     )
//   ) {
//     // Check whether new To Time is greater than from Time
//     if (info.toTime) {
//       const calculatedDuration = calculateDuration(
//         datePickerTime,
//         info.toTime
//       );
//       setInfo((prevInfo) => ({
//         ...prevInfo,
//         fromTime: datePickerTime,
//         duration: calculatedDuration,
//       }));
//     }
//     setInfo((prevInfo) => ({ ...prevInfo, fromTime: datePickerTime }));
//   } else {
//     const toastMessage = "'To' Time cannot be less than 'from' time";
//     showToast(toastMessage, "error", addToast);

//     console.log(toastMessage);
//   }
// };

// console.log("From Time: ", formFromTime(info.fromTime));
// console.log("Duration Time: ", formDuration(info.duration));
// console.log("To Time: ", formToTime(info.toTime));

//   let { fromTime, toTime, duration } = useSelector(getTimes);
//   console.log("from time after dispatch: ", moment(fromTime, "HH:mm:ss"));
//   fromTime = moment(fromTime, "HH:mm:ss").format("h:mm aa");
//   toTime = moment(toTime, "HH:mm:ss").format("HH:mm");
//   duration = moment(duration, "HH:mm:ss").format("h:mm aa");

//   console.log("From Time is : ", fromTime && fromTime.toDate());

//   console.log("Duration is ", duration);

// console.log("Duration is ", duration);
