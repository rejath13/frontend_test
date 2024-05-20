import React from "react";
import { BsCheck } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import {
  disableOtherCheckboxes,
  getScheduleFiltersStatusArray,
  toggleCheckbox,
} from "../../../../../store/slices/scheduler/schedulerFilterSlice";
import { getScheduleCounts } from "../../../../../store/slices/scheduler/scheduleCountSlice";
import "./ScheduleFilterCheckbox.scss";

const ScheduleFilterCheckbox = ({ checkbox }) => {
  //
  const dispatch = useDispatch();
  const { id, label, value, bgColour, textColour, isChecked } = checkbox;

  const scheduleCounts = useSelector(getScheduleCounts);
  //   console.log("Scheudle counts: ", scheduleCounts);

  const handleOnChange = (id) => {
    dispatch(toggleCheckbox(id));
  };
  return (
    <div
      className="schedule-filter-checkbox-container"
      style={{
        border: `2px solid ${bgColour}`,
        backgroundColor: `${isChecked ? bgColour : "white"}`,
        color: `${isChecked ? textColour : "black"}`,
        padding: ".25rem",
        borderRadius: ".25rem",
      }}
    >
      <label
        htmlFor={label}
        onClick={(e) => dispatch(disableOtherCheckboxes(id))}
        className="schedule-filter-checkbox-label"
      >
        <span>{label}</span> <span>[{scheduleCounts[`${value}Count`]}]</span>
        {/* <span>{title}</span> <span>[{jobCount[`${name}Count`]}]</span> */}
      </label>
      <input
        type="checkbox"
        className="filter-jobs__checkbox"
        id={label}
        name={label}
        value="checkboxValue"
        checked={isChecked}
        readOnly
        // onChange={(e) => handleOnChange(id)}
        style={{
          display: "none",
          // backgroundColor: `${isChecked ? "black" : "white"} !important`,
        }}
      />
      <div
        onClick={(e) => handleOnChange(id)}
        style={{
          border: "1px solid #000", // Border style
          width: "20px", // Adjust the size as needed
          height: "20px", // Adjust the size as needed
          borderRadius: ".15rem",
          backgroundColor: isChecked ? "white" : "white", // Custom background color
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isChecked && (
          <BsCheck
            style={{
              fontSize: "2rem",
              color: "green",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleFilterCheckbox;
