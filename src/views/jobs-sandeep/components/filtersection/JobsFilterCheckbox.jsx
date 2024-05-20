import React from "react";
import { BsCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCheckbox,
  toggleAllCheckboxes,
  disableOtherCheckboxes,
} from "../../../../store/slices/jobs/jobsFilterSlice";
import "./JobsFilterCheckbox.scss";

const JobsFilterCheckbox = ({ checkbox }) => {
  const { id, bgColour, isChecked, textColour, name, title } = checkbox;
  const jobCount = useSelector((state) => state.jobsCount);
  const dispatch = useDispatch();
  const handleOnChange = (id) => dispatch(toggleCheckbox(id));

  return (
    <div
      className="filter-jobs__checkbox-container"
      // onClick={(e) => dispatch(disableOtherCheckboxes(id))}
      style={{
        border: `2px solid ${bgColour}`,
        backgroundColor: `${isChecked ? bgColour : "white"}`,
        color: `${isChecked ? textColour : "black"}`,
        padding: ".25rem",
        borderRadius: ".25rem",
      }}
    >
      <label
        htmlFor={name}
        onClick={
          name !== "all" ? (e) => dispatch(disableOtherCheckboxes(id)) : null
        }
        className={`${name !== "all" ? "checkbox-label" : ""}`}
      >
        <span>{title}</span> <span>[{jobCount[`${name}Count`]}]</span>
      </label>
      <input
        type="checkbox"
        className="filter-jobs__checkbox"
        id={name}
        name={name}
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

export default JobsFilterCheckbox;
