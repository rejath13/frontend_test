import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAccountCreatedStatusFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";

const AccountCreatedStatusFilter = () => {
  //
  const dispatch = useDispatch();
  const { accountCreatedStatusFilters } = useSelector(
    (state) => state.jobsFilter
  );

  return (
    <>
      <h6>Account Created Status : </h6>

      <div className="additionalFilters__checkbox-section">
        {Object.keys(accountCreatedStatusFilters).map((filter) => (
          <div className="additionalFilters__checkbox-container" key={filter}>
            <label>{filter === "created" ? "Created" : "Not Created"}</label>
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
    </>
  );
};

export default AccountCreatedStatusFilter;
