import React from "react";
import CustomerStatus from "./CustomerStatus";
import PayStatus from "./PayStatus";
import PayVerifiedStatus from "./PayVerifiedStatus";
import CompletionStatus from "./CompletionStatus";
import "./StatusRow.scss";

const StatusRow = ({
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
}) => {
  return (
    <>
      <div className="customer-status-container">
        <CustomerStatus 
        jobId={jobId} 
        customerStatus={customerStatus} 
        customerStatusUpdatedAt={customerStatusUpdatedAt} 
        customerStatusUpdatedBy={customerStatusUpdatedBy} />
      </div>
      <div className="pay-status-container">
        <PayStatus 
        jobId={jobId} 
        paymentStatus={paymentStatus} 
        paymentStatusUpdatedAt={paymentStatusUpdatedAt} 
        paymentStatusUpdatedBy={paymentStatusUpdatedBy}/>
      </div>
      <div className="pay-verified-container">
        <PayVerifiedStatus
          jobId={jobId}
          paymentVerified={paymentVerified}
          paymentStatus={paymentStatus}
          paymentVerifiedUpdatedAt={paymentVerifiedUpdatedAt}
          paymentVerifiedUpdatedBy={paymentVerifiedUpdatedBy}
        />
      </div>
      {/* <div>
        <CompletionStatus />
      </div> */}
    </>
  );
};

export default StatusRow;
