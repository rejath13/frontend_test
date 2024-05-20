import React from "react";
import { capitalizeFirstLetter } from "../../../helpers/job-card-helper";
import { toggleDeletedStatusFilters } from "../../../../../store/slices/jobs/jobsFilterSlice";
import { useSelector, useDispatch } from "react-redux";

const DeletedStatusFilter = () => {
  //
  const dispatch = useDispatch();
  const { deletedStatusFilters } = useSelector((state) => state.jobsFilter);

  return (
    <>
      <h4>Deleted Status : </h4>

      <div className="additionalFilters__checkbox-section">
        {Object.keys(deletedStatusFilters).map((filter) => (
          <div className="additionalFilters__checkbox-container" key={filter}>
            <label>{capitalizeFirstLetter(filter)}</label>
            <input
              type="checkbox"
              checked={deletedStatusFilters[filter]}
              onChange={() => dispatch(toggleDeletedStatusFilters(filter))}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default DeletedStatusFilter;
