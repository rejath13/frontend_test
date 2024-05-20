import React from "react";
import { Badge } from "react-bootstrap";
import { implementationTypeStyles } from "../../../../../helpers/schedule-info-helper";

const RepeatScheduleJobInfo = ({ schedule }) => {
  // console.log("Schedule in job info : ", schedule);
  const { jobId } = schedule;
  const { companyName, customerName, customerPhone, implementationType } =
    schedule?.salesPlus;
  const { quantityNew, quantityMigrate, quantityService, quantityTrading } =
    schedule?.job;

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
        <span>{customerName}</span>
      </p>

      <p className="stacked">
        <span className="heading">Customer Phone</span>
        <span>{customerPhone}</span>
      </p>
      <p className="stacked">
        <span className="heading">Job Qty</span>
        <span>
          <Badge variant="primary">N{quantityNew}</Badge>
          <Badge variant="success">S{quantityService}</Badge>
          <Badge variant="warning">M{quantityMigrate}</Badge>
          <Badge variant="secondary">T{quantityTrading}</Badge>
        </span>
      </p>
      <p className="stacked">
        <span className="heading">Imp. Type</span>
        <span
          style={{
            ...implementationTypeStyles(implementationType),
            border: "1px solid gray",
            display: "block",
            padding: "7px 4px",
            borderRadius: "4px",
            letterSpacing: ".02rem",
          }}
        >
          {implementationType}
        </span>
      </p>
    </div>
  );
};

export default RepeatScheduleJobInfo;
