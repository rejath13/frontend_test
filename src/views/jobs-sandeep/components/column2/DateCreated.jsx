import React from "react";
import { formattedItems } from "../../helpers/job-card-helper";

const DateCreated = ({ createdDate }) => {
  const formattedDate = formattedItems.createdAt(createdDate);
  const daysElapsed = formattedItems.daysElapsed(createdDate);
  return (
    <>
      <p className="date-heading">Date Created</p>
      <p className="date">
        {formattedDate} - {daysElapsed} D
      </p>
    </>
  );
};

export default DateCreated;
