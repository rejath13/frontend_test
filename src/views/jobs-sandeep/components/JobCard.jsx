import React from "react";
import { Card, Button } from "react-bootstrap";
import "./JobCard.scss";
import {
  formatStatusColourBox,
  formattedItems,
} from "../helpers/job-card-helper";
import {
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaGripLines,
  FaPenToSquare,
  FaRegCalendarPlus,
  FaMoneyBill1,
  FaBoxesStacked,
} from "react-icons/fa6";
import { LiaGripLinesVerticalSolid } from "react-icons/lia";

import IndexComponent from "./column1/IndexComponent";
import DateCreated from "./column2/DateCreated";
import SalesPerson from "./column2/SalesPerson";
import ExpectedCompletionDate from "./column2/ExpectedCompletionDate";
import CompanyInfo from "./column3/CompanyInfo";
import ProjectValue from "./column4/ProjectValue";
import StatusNote from "./column5/StatusNote";
import ScheduleNote from "./column5/ScheduleNote";
import JobRemarks from "./column5/JobRemarks";
import StatusRow from "./column6/status-row/StatusRow";
import Quantity from "./column4/Quantity";
import ButtonRow from "./column6/button-row/ButtonRow";
// import { implementationType as allTypes } from "../../itc/projects/project-options-data";

const JobCard = ({ job, index, provided }) => {
  // if (job.id === 10) {
  //   console.log('Job 10 is ', job)
  // }
  const {
    id: jobId,
    paymentVerified,
    customerEmailSent,
    expectedCompletionTime,
    customerStatusUpdatedAt,
    customerStatusUpdatedBy,
    paymentStatusUpdatedAt,
    paymentStatusUpdatedBy,
    paymentVerifiedUpdatedAt,
    paymentVerifiedUpdatedBy,

    salesPlus: {
      modifiedDate,
      companyName,
      customerName,
      customerPhone,
      implementationType,
      customerStatus,
      traccarId,
      statusWonNote,
      statusNote,
      price,
      noteCustomerComment,
      noteForScheduling,
      jobRemarks,
      paymentStatus,
      projectValue,
      quantityNew,
      quantityMigrate,
      quantityService,
      quantityTrading,
      expectedCompletionDate,
      salesPerson,
 
    } = {},
  } = job ?? {};

  const {
    email: salesEmail,
    phone: salesPhone,
    name: salesName,
    id,
  } = salesPerson ?? {};

  const statusRowData = {
    jobId,
    customerStatus,
    customerStatusUpdatedAt,
    customerStatusUpdatedBy,
    paymentStatusUpdatedAt,
    paymentStatusUpdatedBy,
    paymentVerifiedUpdatedAt,
    paymentVerifiedUpdatedBy,
    paymentStatus,
    paymentVerified,
  };

  const jobCardBorderCSS =
    quantityService > 0 && !quantityNew && !quantityMigrate && !quantityTrading
      ? "service-border"
      : "default-border";

  const statusColourBoxStyles = {
    backgroundColor: formatStatusColourBox(customerStatus),
  };

  return (
    <div className={`job-card ${jobCardBorderCSS}`}>
      {/* First Column*/}
      <section className="column1" {...provided?.dragHandleProps}>
        <div className="column1__index">
          <IndexComponent index={job.id} sortOrder={job.sortOrder} />
        </div>
        {provided && (
          <div className="column1__sort-handle">
            <LiaGripLinesVerticalSolid />
          </div>
        )}
        <div
          className="column1__status-colour-box"
          style={statusColourBoxStyles}
        ></div>
      </section>
      {/* Second Column */}
      <section className="column2">
        <div className="column2__date-created">
          <DateCreated createdDate={modifiedDate} />
        </div>
        <div className="column2__sales-person">
          <SalesPerson salesName={salesName} />
        </div>
        <div className="column2__expected-completion">
          <ExpectedCompletionDate
            jobId={job.id}
            expectedCompletionDate={expectedCompletionDate}
            expectedCompletionTime={expectedCompletionTime}
          />
        </div>
      </section>
      {/* Third Column */}
      <section className="column3">
        <CompanyInfo
          companyName={companyName}
          customerName={customerName}
          customerPhone={customerPhone}
          implementationType={implementationType}
          jobId={jobId}
        />
      </section>
      {/* Fourth Column */}
      <section className="column4">
        <div className="column4__quantity">
          <Quantity
            quantityNew={quantityNew}
            quantityMigrate={quantityMigrate}
            quantityService={quantityService}
            quantityTrading={quantityTrading}
          />
        </div>
        <div className="column4__project-value">
          <ProjectValue projectValue={projectValue} />
        </div>
      </section>
      {/* Fifth Column */}
      <section className="column5">
        <div className="status-note-wrapper">
          <label>Status Note</label>
          <StatusNote jobId={jobId} statusNote={noteCustomerComment} />
        </div>
        <div className="schedule-note-wrapper">
          <label>Sched. Note</label>
          <ScheduleNote jobId={jobId} statusWonNote={noteForScheduling} />
        </div>
        <div className="job-remarks-wrapper">
          <label>Remark</label>
          <JobRemarks jobId={jobId} jobRemarks={jobRemarks} />
        </div>
      </section>
      {/* Sixth Column */}
      <section className="column6">
        <div className="column6__status-row">
          <StatusRow {...statusRowData} />
        </div>
        <div className="column6__button-row">
          <ButtonRow traccarId={traccarId} jobId={jobId} />
        </div>
      </section>
    </div>
  );
};

export default JobCard;
