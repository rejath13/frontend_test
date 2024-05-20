import React, { useState, useRef, useEffect } from "react";
import {
  useSetPaymentVerifiedStatusMutation,
  useGetStatusLastUpdatedByQuery,
} from "../../../../../store/api/jobs/jobsApi";
import { Badge, Form, Spinner, Popover, OverlayTrigger } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from 'moment'
import "./PayVerifiedStatus.scss";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";

const PayVerifiedStatus = ({ jobId, paymentVerified, paymentStatus, paymentVerifiedUpdatedAt, paymentVerifiedUpdatedBy  }) => {
  //
  const [showPopover, setShowPopover] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Choose");

  const selectBoxRef = useRef(null);
  const textBoxRef = useRef(null);

  const { addToast } = useToasts();

  const showToast = (toastMessage, toastType) => {
    addToast(toastMessage, {
      appearance: toastType,
      autoDismiss: true,
    });
  };

  // Logged in User Details
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserType = localStorage.getItem("loginUserType");
  const loginUserId = localStorage.getItem("loginUserId");

  const [setPaymentVerifiedStatus, { isLoading }] =
    useSetPaymentVerifiedStatusMutation();

  // const { data: lastUpdatedBy, isLoading: updatedByLoading } =
  //   useGetStatusLastUpdatedByQuery({
  //     jobId,
  //     categoryName: "paymentVerifiedStatus",
  //   });

  // const popoverContent = (
  //   <Popover id="popover-basic">
  //     <Popover.Title as="h3">Last Updated By</Popover.Title>
  //     <Popover.Content>
  //       <p>User: {lastUpdatedBy?.userName}</p>
  //       <p>
  //         Date:{" "}
  //         {DateTime.fromISO(lastUpdatedBy?.modifiedDate, {
  //           zone: "utc",
  //         }).toFormat("yyyy-MM-dd HH:mm:ss")}
  //       </p>
  //     </Popover.Content>
  //   </Popover>
  // );

  // console.log(
  //   "Last Updated payment verified Status by : ",
  //   lastUpdatedBy,
  //   " job id : ",
  //   jobId
  // );

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing]);

  const handleUpdate = async (value) => {
    await setPaymentVerifiedStatus({
      jobId,
      loginUserName,
      paymentVerified: value,
    });
    setIsEditing(false);
  };

  const handleSelectChange = (newValue) => {
    if (newValue !== "choose") {
      if (newValue === "1" && paymentStatus !== "yes") {
        const toastMessage =
          "Cannot Change status to Verified when Pay Status is not Paid";
        showToast(toastMessage, "warning");
      } else {
        setSelectedValue(newValue);
        handleUpdate(newValue);
        setIsEditing(false);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(event.target)) {
      if (textBoxRef.current && !textBoxRef.current.contains(event.target)) {
        setIsEditing(!isEditing);
      }
    }
  };

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  const handlePayVerifiedStatusClick = () => {
    if (loginUserName.toLowerCase() === "celine" || loginUserName === "admin") {
      setIsEditing(!isEditing);
    } else {
      const toastMessage =
        "You are not authorized to change Payment Verified Status";
      showToast(toastMessage, "error");
    }
  };

  return (
    <>
      <div
        className="status-column"
        ref={textBoxRef}
        onClick={handlePayVerifiedStatusClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h2>Pay Verified</h2>
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
              <Badge variant={paymentVerified ? "success" : "danger"}>
                {paymentVerified ? "Yes" : "No"}
              </Badge>
            )}
          </span>
        </div>
        {/* {lastUpdatedBy?.userName && (
          <div className="last-updated-by">
            <p className="text-info">
              {capitalizeFirstLetter(lastUpdatedBy?.userName)}/{" "}
              {DateTime.fromISO(lastUpdatedBy?.modifiedDate, {
                zone: "utc",
              }).toFormat("yyyy-MM-dd HH:mm")}
            </p>
          </div>
        )} */}

      <div className="last-updated">
            {paymentVerifiedUpdatedAt && <span className="last-updated-at">{moment(paymentVerifiedUpdatedAt).format('YYYY-MM-DD HH:mm')}</span>}
            {paymentVerifiedUpdatedBy && <span className="last-updated-by">({capitalizeFirstLetter(paymentVerifiedUpdatedBy)})</span> }
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
            <option value="1">Verified</option>
            <option value="0">Not Verified</option>
          </Form.Control>
        </div>
      )}
    </>
  );
};

export default PayVerifiedStatus;
