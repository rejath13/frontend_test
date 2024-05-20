import { capitalizeFirstLetter } from "../../jobs-sandeep/helpers/job-card-helper";

export const formatScheduleStatus = (status) => {
  let color = "";
  let textColor = "white";

  switch (status) {
    case "unscheduled": {
      color = "red";
      break;
    }
    case "scheduled": {
      color = "purple"; // primary of bootstrap colors
      break;
    }
    case "assigned": {
      color = "blue";
      break;
    }
    case "partial": {
      color = "orange";
      break;
    }
    case "completed": {
      color = "green";
      break;
    }
  }
  // console.log("BAdge bg color: ", color);
  return {
    scheduleStatus: status ? capitalizeFirstLetter(status) : "",
    color,
    textColor,
  };
};
