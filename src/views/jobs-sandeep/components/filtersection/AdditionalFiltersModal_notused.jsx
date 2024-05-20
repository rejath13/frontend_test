import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalFiltersModal } from "../../../../store/slices/jobsModalSlice2";
import {
  setPaymentVerifiedFilters,
  togglePaymentVerifiedFilters,
  togglePaymentStatusFilters,
  toggleMailSentStatusFilters,
  toggleAccountCreatedStatusFilters,
} from "../../../../store/slices/jobsFilterSlice";
import { BsCheck } from "react-icons/bs";
import "./AdditionalFiltersModal.scss";

const AdditionalFiltersModal = ({ show }) => {
  const {
    paymentStatusFilters,
    paymentVerifiedFilters,
    mailSentStatusFilters,
    accountCreatedStatusFilters,
    deletedStatusFilters,
  } = useSelector((state) => state.jobsFilter);

  // console.log("Payment Status Filters = ", paymentStatusFilters);
  const dispatch = useDispatch();

  return (
    <Modal
      show={show}
      onHide={() => dispatch(setAdditionalFiltersModal())}
      backdrop={true}
      keyboard={true}
      animation={false}
    >
      <section className="additionalFilters">
        <div>
          <h4>Payment Status : </h4>

          <div className="additionalFilters__checkbox-section">
            {Object.keys(paymentStatusFilters).map((filter) => (
              <div
                className="additionalFilters__checkbox-container"
                key={filter}
              >
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
        </div>
        <div>
          {/* <h2>Payment Verified</h2> */}

          <h4>Payment Verified : </h4>

          <div className="additionalFilters__checkbox-section">
            {Object.keys(paymentVerifiedFilters).map((filter) => (
              <div
                className="additionalFilters__checkbox-container"
                key={filter}
              >
                <label>{filter === "paid" ? "Paid" : "Not Paid"}</label>
                <input
                  type="checkbox"
                  checked={paymentVerifiedFilters[filter]}
                  onChange={() =>
                    dispatch(togglePaymentVerifiedFilters(filter))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4>Mail Sent Status : </h4>

          <div className="additionalFilters__checkbox-section">
            {Object.keys(mailSentStatusFilters).map((filter) => (
              <div
                className="additionalFilters__checkbox-container"
                key={filter}
              >
                <label>{filter === "sent" ? "Sent" : "Not Sent"}</label>
                <input
                  type="checkbox"
                  checked={mailSentStatusFilters[filter]}
                  onChange={() => dispatch(toggleMailSentStatusFilters(filter))}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4>Account Created Status : </h4>

          <div className="additionalFilters__checkbox-section">
            {Object.keys(accountCreatedStatusFilters).map((filter) => (
              <div
                className="additionalFilters__checkbox-container"
                key={filter}
              >
                <label>
                  {filter === "created" ? "Created" : "Not Created"}
                </label>
                <input
                  type="checkbox"
                  checked={accountCreatedStatusFilters[filter]}
                  onChange={() =>
                    dispatch(toggleAccountCreatedStatusFilters(filter))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default AdditionalFiltersModal;
