import React from "react";
import { Badge } from "react-bootstrap";
import { FaBoxes as QtyIcon } from "react-icons/fa";
const JobQuantities = ({ schedule }) => {
  // console.log("Job Quantities: ", schedule?.salesPlus);
  const {
    quantityNew = "",
    quantityMigrate = "",
    quantityTrading = "",
    quantityService = "",
  } = schedule?.salesPlus;
  return (
    <>
      {/* <span className="label-name">Job Qty:</span> */}
      <span className="label-name">
        <QtyIcon />
      </span>
      <span className="job-qty-badges ">
        {quantityNew > 0 && <Badge variant="primary">N{quantityNew}</Badge>}
        {quantityMigrate > 0 && (
          <Badge variant="warning">M{quantityMigrate}</Badge>
        )}
        {quantityTrading > 0 && (
          <Badge variant="secondary">T{quantityTrading}</Badge>
        )}
        {quantityService > 0 && (
          <Badge variant="success">S{quantityService}</Badge>
        )}
      </span>
    </>
  );
};

export default JobQuantities;
