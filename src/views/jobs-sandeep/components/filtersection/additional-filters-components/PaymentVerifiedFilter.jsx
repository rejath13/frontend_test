import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglePaymentVerifiedFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";

const PaymentVerifiedFilter = () => {
  //
  const dispatch = useDispatch();
  const { paymentVerifiedFilters } = useSelector((state) => state.jobsFilter);

  return (
    <>
      <h6>Payment Verified : </h6>

      <div className="additionalFilters__checkbox-section">
        {Object.keys(paymentVerifiedFilters).map((filter) => (
          <div className="additionalFilters__checkbox-container" key={filter}>
            <label>{filter === "paid" ? "Verified" : "Not Verified"}</label>
            <input
              type="checkbox"
              checked={paymentVerifiedFilters[filter]}
              onChange={() => dispatch(togglePaymentVerifiedFilters(filter))}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentVerifiedFilter;
