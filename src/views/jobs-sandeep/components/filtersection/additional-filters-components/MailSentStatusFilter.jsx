import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMailSentStatusFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";

const MailSentStatusFilter = () => {
  //
  const dispatch = useDispatch();
  const { mailSentStatusFilters } = useSelector((state) => state.jobsFilter);

  return (
    <>
      <h6>Mail Sent Status : </h6>

      <div className="additionalFilters__checkbox-section">
        {Object.keys(mailSentStatusFilters).map((filter) => (
          <div className="additionalFilters__checkbox-container" key={filter}>
            <label>{filter === "sent" ? "Sent" : "Not Sent"}</label>
            <input
              type="checkbox"
              checked={mailSentStatusFilters[filter]}
              onChange={() => dispatch(toggleMailSentStatusFilters(filter))}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default MailSentStatusFilter;
