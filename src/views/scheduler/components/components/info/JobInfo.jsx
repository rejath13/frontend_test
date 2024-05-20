import React from "react";
import { UserIcon } from "../../icons";
import SchedulePriorityInfo from "./SchedulePriorityInfo";
import JobQuantities from "./JobQuantities";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { BsPersonVcard as ContactNameIcon } from "react-icons/bs";
import { LuPhone as ContactPhoneIcon } from "react-icons/lu";
import { RiShieldUserFill as UsernameIcon } from "react-icons/ri";
import { IoIosBusiness as CompanyNameIcon } from "react-icons/io";

import "./JobInfo.scss";

const JobInfo = ({ schedule }) => {
  //
  const dispatch = useDispatch();

  const handleUpdateContactInfo = () => {
    dispatch(
      openModal({
        componentKey: "updateScheduleContactInfoContent",
        size: "lg",
        data: {
          schedule,
        },
      })
    );
  };

  return (
    <>
      <div className="row1" id="job-info">
        <p className="label-name">{schedule.id}</p>
        <SchedulePriorityInfo schedule={schedule} />
        <p>
          <span className="label-name">JobId:</span>{" "}
          <span>{schedule.jobId}</span>
        </p>
        <p>
          <span className="label-name">SalesPlusId:</span>{" "}
          <span>{schedule.salesPlusId}</span>
        </p>
        <p className="sales-person heading-horizontal">
          <UserIcon />
          <span>{schedule?.salesPlus?.salesPerson?.name}</span>
        </p>
      </div>
      <div id="schedule-card-company-info" className="row2">
        <div className="company-name">
          <p className="heading-horizontal">
            {/* <span className="label-name">Company:</span> */}
            <span className="label-name">
              <CompanyNameIcon />
            </span>
            <span>{schedule.salesPlus?.companyName}</span>
          </p>
        </div>

        <div className="company-contacts">
          <div>
            <div className="company-info-row">
              <p
                className="heading-horizontal contact-name"
                // onClick={handleUpdateContactInfo}
              >
                {/* <span className="label-name">Contact Name:</span> */}
                <span className="label-name">
                  <ContactNameIcon />
                </span>
                <span>{schedule.contactName}</span>
              </p>
            </div>
            <div className="company-info-row">
              <p className="heading-horizontal">
                {/* <span className="label-name">User:</span> */}
                <span className="label-name">
                  <UsernameIcon />
                </span>
                <span>{schedule?.salesPlus?.customerData?.username}</span>
              </p>
              <p
                className="heading-horizontal contact-phone"
                // onClick={handleUpdateContactInfo}
              >
                {/* <span className="label-name">Contact Ph:</span> */}
                <span className="label-name">
                  <ContactPhoneIcon />
                </span>
                <span>{schedule.contactPhone}</span>
              </p>
              <p className="heading-horizontal">
                <JobQuantities schedule={schedule} />
              </p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default JobInfo;
