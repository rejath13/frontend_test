import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglePaymentStatusFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";

const PaymentStatusFilter = () => {
  //
  const dispatch = useDispatch();
  const { paymentStatusFilters } = useSelector((state) => state.jobsFilter);

  return (
    <>
      <h6>Payment Status : </h6>

      <div className="additionalFilters__checkbox-section">
        {Object.keys(paymentStatusFilters).map((filter) => (
          <div className="additionalFilters__checkbox-container" key={filter}>
            <label>
              {filter === "paid"
                ? "Paid"
                : filter === "partial"
                ? "Partial"
                : "Not Paid"}
            </label>
            <input
              type="checkbox"
              checked={paymentStatusFilters[filter]}
              onChange={() => dispatch(togglePaymentStatusFilters(filter))}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentStatusFilter;
