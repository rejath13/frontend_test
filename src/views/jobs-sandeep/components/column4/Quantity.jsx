import React from "react";
import { FaBoxesStacked } from "react-icons/fa6";
import { Badge } from "react-bootstrap";
import "./Quantity.scss";

const Quantity = ({
  quantityNew,
  quantityMigrate,
  quantityService,
  quantityTrading,
}) => {
  return (
    <>
      <FaBoxesStacked />
      <div className="column4__quantity-values">
        {quantityNew ? (
          <h3 className="badge-quantity">
            <Badge variant="primary">N-{quantityNew}</Badge>
          </h3>
        ) : (
          ""
        )}
        {quantityService ? (
          <h3 className="badge-quantity">
            <Badge variant="success">S-{quantityService}</Badge>
          </h3>
        ) : (
          ""
        )}
        {quantityMigrate ? (
          <h3 className="badge-quantity">
            <Badge variant="warning">M-{quantityMigrate}</Badge>
          </h3>
        ) : (
          ""
        )}
        {quantityTrading ? (
          <h3 className="badge-quantity">
            <Badge variant="secondary">T-{quantityTrading}</Badge>
          </h3>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Quantity;
