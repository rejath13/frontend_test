import React, { useState, useRef, useEffect } from "react";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";
import { useSetCustomerStatusMutation } from "../../../../../store/api/jobs/jobsApi";
import { Form, Spinner, Badge } from "react-bootstrap";
import { setStatusColors } from "../../../helpers/job-card-helper";
import moment from 'moment';
import "./CustomerStatus.scss";

const JobStatus = ({ jobId, customerStatus, customerStatusUpdatedAt, customerStatusUpdatedBy }) => {
  if (jobId === 10) {

    console.log('Customer Status Updated At: ', customerStatusUpdatedAt)
  }
  //
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Choose");

  const selectBoxRef = useRef(null);
  const textBoxRef = useRef(null);

  const [setCustomerStatus, { isLoading }] = useSetCustomerStatusMutation();

  // Logged in User Details
  const loginUserName = localStorage.getItem("loginUserName");
  


  useEffect(() => {
    if (isEditing) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing]);

  const handleUpdate = async (value) => {
    await setCustomerStatus({
      jobId,
      customerStatus: value,
      updatedBy: loginUserName,
    });
    setIsEditing(false);
  };

  const handleSelectChange = (newValue) => {
    if (newValue !== "choose") {
      setSelectedValue(newValue);
      handleUpdate(newValue);
      setIsEditing(false);
    }
  };

  const handleClickOutside = (event) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(event.target)) {
      if (textBoxRef.current && !textBoxRef.current.contains(event.target)) {
        setIsEditing(!isEditing);
      }
    }
  };

  const { bgColor, textColor } = setStatusColors(customerStatus);

  return (
    <>
      <div
        className="status-column"
        ref={textBoxRef}
        onClick={() => setIsEditing(!isEditing)}
      >
        <h2>Job Status</h2>
        {/*Did not change the name of the component to Job Status from Customer Status */}
        <div>
          <span className="status-content">
            {" "}
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                variant="success"
                className=" status-change-spinner"
              ></Spinner>
            ) : (
              <Badge
                variant=""
                style={{ backgroundColor: `${bgColor}`, color: `${textColor}` }}
              >
                {capitalizeFirstLetter(customerStatus)}
              </Badge>
             
             
            )}
          </span>
          <div className="last-updated">
            {customerStatusUpdatedAt && <span className="last-updated-at">{moment(customerStatusUpdatedAt).format('YYYY-MM-DD HH:mm')}</span>}
            {customerStatusUpdatedBy && <span className="last-updated-by">({capitalizeFirstLetter(customerStatusUpdatedBy)})</span> }
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="select-container" ref={selectBoxRef}>
          <Form.Control
            as="select"
            onChange={(e) => handleSelectChange(e.target.value)}
            className="select"
            selected={selectedValue}
            size="sm"
            defaultValue={selectedValue}
          >
            <option value="choose">Choose</option>
            <option value="unassigned">Unassigned</option>
            <option value="scheduled">Scheduled</option>
            <option value="assigned">Assigned</option>
            <option value="inprogress">In Progress</option>
            <option value="demo">Demo</option>
            <option value="onhold">On Hold</option>
            <option value="completed">Completed</option>
            {/* <option value="deleted">Deleted</option> */}
          </Form.Control>
        </div>
      )}
    </>
  );
};

export default JobStatus;
