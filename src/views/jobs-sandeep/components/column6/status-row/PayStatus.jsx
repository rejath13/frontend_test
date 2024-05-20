import React, { useState, useRef, useEffect } from "react";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";
import {
  useSetPaymentStatusMutation,
  useGetStatusLastUpdatedByQuery,
} from "../../../../../store/api/jobs/jobsApi";
// import {
//   useSetPaymentStatusMutation,
//   useGetStatusLastUpdatedByQuery,
// } from "../../../../../store/jobs/api/jobsApi";
import { Badge, Form, Spinner, Popover, OverlayTrigger } from "react-bootstrap";
import moment from 'moment';
import "./PayStatus.scss";

const PayStatus = ({ jobId, paymentStatus, paymentStatusUpdatedAt, paymentStatusUpdatedBy }) => {
  //
  const [showPopover, setShowPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Choose");

  // Logged in User Details
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserType = localStorage.getItem("loginUserType");
  const loginUserId = localStorage.getItem("loginUserId");

  const selectBoxRef = useRef(null);
  const textBoxRef = useRef(null);

  const [setPaymentStatus, { isLoading }] = useSetPaymentStatusMutation();
  // const { data: lastUpdatedBy, isLoading: updatedByLoading } =
  //   useGetStatusLastUpdatedByQuery({ jobId, categoryName: "paymentStatus" });

  // console.log("last updated by is ", lastUpdatedBy);

  // const popoverContent = (
  //   <Popover id="popover-basic">
  //     <Popover.Title as="h3">Last Updated By</Popover.Title>
  //     <Popover.Content>
  //       <p>User: {lastUpdatedBy?.userName}</p>
  //       <p>
  //         Date:{" "}
  //         {DateTime.fromISO(lastUpdatedBy?.modifiedDate, {
  //           zone: "utc",
  //         }).toFormat("yyyy-MM-dd HH:mm")}
  //       </p>
  //     </Popover.Content>
  //   </Popover>
  // );

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing]);

  const handleUpdate = async (value) => {
    await setPaymentStatus({
      jobId,
      loginUserId,
      loginUserName,
      paymentStatus: value,

      categoryName: "paymentStatus", // for get last updated by
    });
    setIsEditing(false);
  };

  const handleSelectChange = (newValue) => {
    if (newValue !== "choose") {
      setSelectedValue(newValue);
      handleUpdate(newValue);
    }
  };

  const handleClickOutside = (event) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(event.target)) {
      if (textBoxRef.current && !textBoxRef.current.contains(event.target)) {
        setIsEditing(!isEditing);
      }
    }
  };

  return (
    <>
      <div
        className="status-column"
        ref={textBoxRef}
        onClick={() => setIsEditing(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h2>Pay Status</h2>
        {/* <OverlayTrigger
          trigger="hover focus"
          placement="top"
          show={showPopover}
          overlay={popoverContent}
        >
        </OverlayTrigger> */}

        <div>
          <span className="status-content">
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
                variant={
                  paymentStatus === "yes"
                    ? "success"
                    : paymentStatus === "no"
                    ? "danger"
                    : "warning"
                }
              >
                {paymentStatus === "yes"
                  ? "Paid"
                  : paymentStatus === "no"
                  ? "Not Paid"
                  : "Partial"}
              </Badge>
            )}
          </span>

          <div className="last-updated">
            {paymentStatusUpdatedAt && <span className="last-updated-at">{moment(paymentStatusUpdatedAt).format('YYYY-MM-DD HH:mm')}</span>}
            {paymentStatusUpdatedBy && <span className="last-updated-by">({capitalizeFirstLetter(paymentStatusUpdatedBy)})</span> }
          </div>
          {/* <button onClick={handleEditClick}>Edit</button> */}
        </div>
        {/* {lastUpdatedBy?.userName && (
          <div className="last-updated-by">
            <p className="text-info">
              {capitalizeFirstLetter(lastUpdatedBy?.userName)}/{" "}
              {DateTime.fromISO(lastUpdatedBy?.modifiedDate, {
                // zone: "utc",
              }).toFormat("yyyy-MM-dd HH:mm")}
            </p>
          </div>
        )} */}
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
            <option value="yes">Paid</option>
            <option value="no">Not Paid</option>
            <option value="partial">Partially Paid</option>
          </Form.Control>
          {/* <button onClick={handleSaveClick}>Save</button> */}
        </div>
      )}
    </>
  );
};

export default PayStatus;
