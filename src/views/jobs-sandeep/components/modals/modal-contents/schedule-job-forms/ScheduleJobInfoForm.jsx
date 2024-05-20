import React from "react";
import "./ScheduleJobInfoForm.scss";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "react-bootstrap";
import { getJobInfo } from "../../../../../../store/slices/scheduler/schedulerFormSlice";
import { getJobDetails } from "../../../../../../store/slices/jobs/jobSlice";
import { implementationTypeStyles } from "../../../../../scheduler/helpers/schedule-info-helper";

const ScheduleJobInfoForm = () => {
  //
  const { jobId, salesPlusId, companyName, contactName, contactPhone } =
    useSelector(getJobInfo);
  const job = useSelector(getJobDetails);
  // console.log("job in repeat schedule: ", job);

  return (
    <div className="schedule-job-info-form ">
      <p className="stacked">
        <span className="heading">JobId</span>
        <span>{jobId}</span>
      </p>

      {/* <p className="stacked">
        <span className="heading">Sales Plus Id</span>
        <span>{salesPlusId}</span>
      </p> */}

      <p className="stacked company-name">
        <span className="heading">CompanyName</span>
        <span>{companyName}</span>
      </p>

      <p className="stacked">
        <span className="heading">Customer Name</span>
        <span>{job?.salesPlus?.customerName}</span>
      </p>

      <p className="stacked">
        <span className="heading">Customer Phone</span>
        <span>{job?.salesPlus?.customerPhone}</span>
      </p>
      <p className="stacked">
        <span className="heading">Job Qty</span>
        <span>
          <Badge variant="primary">N{job?.salesPlus?.quantityNew}</Badge>
          <Badge variant="success">S{job?.salesPlus?.quantityService}</Badge>
          <Badge variant="warning">M{job?.salesPlus?.quantityMigrate}</Badge>
          <Badge variant="secondary">T{job?.salesPlus?.quantityTrading}</Badge>
        </span>
      </p>
      <p className="stacked">
        <span className="heading">Imp. Type</span>
        <span
          style={{
            ...implementationTypeStyles(job?.salesPlus?.implementationType),
            border: "1px solid gray",
            display: "block",
            padding: "7px 4px",
            borderRadius: "4px",
            letterSpacing: ".02rem",
          }}
        >
          {job?.salesPlus?.implementationType}
        </span>
      </p>
    </div>
  );
};

export default ScheduleJobInfoForm;
