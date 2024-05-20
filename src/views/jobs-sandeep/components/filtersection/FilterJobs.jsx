import React, { useState, useRef, useEffect } from "react";
import {
  useFetchJobsQuery,
  useGetSortOrdersQuery,
} from "../../../../store/api/jobs/jobsApi";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Spinner, Badge, Tabs, Tab } from "react-bootstrap";
import JobList from "./../JobList";
import JobsFilterCheckbox from "./JobsFilterCheckbox";
import { setSingleFilteredJobs } from "../../../../store/slices/jobs/jobSlice";
import {
  resetFilters,
  selectAllCheckboxes,
  setFilter,
  setSearchTextFilter,
  toggleCheckbox,
} from "../../../../store/slices/jobs/jobsFilterSlice";
import JobsModal from "../modals/JobsModal";
import { openModal } from "../../../../store/slices/jobs/jobsModalSlice";
import { setData } from "../../../../store/slices/jobs/jobSlice";
import { setNewJobsNotificationCount } from "../../../../store/slices/jobs/jobsCountSlice";
import "./FilterJobs.scss";
import notificationSound from "./../../../../assets/sounds/jobs/jobs-notification-sound.mp3";

import { TbFilterPlus, TbFilterOff } from "react-icons/tb";

const FilterJobs = () => {
  const dispatch = useDispatch();

  // const checkboxes = useSelector((state) => state.jobsFilter.checkboxes);

  const { mainFilter, searchTextFilter, checkboxes } = useSelector(
    (state) => state.jobsFilter
  );
  // console.log("main filter is ", mainFilter);
  const pendingCount = useSelector((state) => state.jobsCount.pendingCount);

  const newJobsNotificationCount = useSelector(
    (state) => state.jobsCount.newJobsNotificationCount
  );

  const allFilters = useSelector((state) => state.jobsFilter);

  const {
    data: jobs,
    error,
    isFetching,
  } = useFetchJobsQuery(allFilters, {
    pollingInterval: 120000, // Refetch jobs every 3 minutes
  });

  // Additional Filters Jobs Count =================/
  // Calculate count when additional Filters are applied
  const { additionalFiltersCount } = allFilters;

  // console.log("AdditionalFiltersCount: ", additionalFiltersCount);
  let additionalFiltersJobsCount = 0;
  if (additionalFiltersCount > 0) {
    additionalFiltersJobsCount = jobs.length;
  }
  // ================================================/

  if (jobs) {
    // console.log("Jobs in filter jobs: ", jobs);
    dispatch(setData(jobs)); // for storing the jobs in internal redux state and not api state for filtering job with id in other components
  }

  // Pagination - Load More ==============/
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const loadMore = () => {
    setVisibleItems((prevValue) => prevValue + itemsPerPage);
  };
  // =====================================/

  // Play Notification Sound ==========/
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  useEffect(() => {
    newJobsNotificationCount > 0 && playNotificationSound();
    // setTimeout(() => {
    //   dispatch(setNewJobsNotificationCount(0));
    // }, 30000);
  }, [newJobsNotificationCount]);
  // ============================== //

  const handleOnChangeSearchTextFilter = (event) => {
    dispatch(setSearchTextFilter(event.target.value));
  };

  return (
    <>
      <JobsModal />
      <div
        className="filter-jobs"
        style={{ position: "relative", minHeight: "90px" }}
      >
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${
                mainFilter === "pending" ? "active" : ""
              } `}
              onClick={() => {
                console.log("Clicked pending");
                dispatch(setFilter("pending"));
              }}
              href="#"
            >
              <span>Pending</span>
              <span>[{pendingCount}]</span>
              {newJobsNotificationCount > 0 && (
                <span style={{ marginLeft: "10px", display: "inline-block" }}>
                  <Badge variant="warning">{newJobsNotificationCount}</Badge>
                </span>
              )}
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                mainFilter === "completed" ? "active" : ""
              } `}
              onClick={() => dispatch(setFilter("completed"))}
              href="#"
            >
              <span>Completed</span>
            </a>
          </li>
        </ul>
        {mainFilter === "pending" && (
          <>
            <section className="filter-jobs__column2">
              {checkboxes?.map((checkbox) => (
                <JobsFilterCheckbox key={checkbox.id} checkbox={checkbox} />
              ))}
            </section>
            <section className="filter-jobs__column3">
              <Button
                className="filter-jobs__filter-button"
                onClick={() => {
                  dispatch(selectAllCheckboxes()); // Select all checkboxes
                  dispatch(
                    openModal({
                      componentKey: "additionalFilters",
                      size: "lg",
                    })
                  );
                }}
              >
                {additionalFiltersCount > 0 && (
                  <Badge
                    pill
                    variant="danger"
                    style={{
                      position: "absolute",
                      top: "125%",
                      right: "50%",
                      transform: "translate(50%, -50%)",
                      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {additionalFiltersJobsCount}
                  </Badge>
                )}
                <TbFilterPlus className="filter-icon" />
              </Button>
              <Button
                variant="danger"
                className="filter-jobs__filter-button"
                onClick={() => dispatch(resetFilters())}
              >
                <TbFilterOff className="filter-icon" />
              </Button>

              {/* {showAdditionalFiltersModal && (
                <AdditionalFiltersModal show={showAdditionalFiltersModal} />
              )} */}
            </section>
            <section className="filter-jobs__column4">
              <Form.Control
                type="text"
                placeholder="Search Jobs"
                value={searchTextFilter}
                key="searchJobsTextFilter"
                onChange={handleOnChangeSearchTextFilter}
              />
            </section>
          </>
        )}
        {mainFilter === "completed" && (
          <>
            <section className="filter-jobs__column2">
              <Form.Control
                type="text"
                placeholder="Search Jobs"
                value={searchTextFilter}
                key="searchJobsTextFilter"
                onChange={handleOnChangeSearchTextFilter}
              />
            </section>
            <section className="filter-jobs__column3">
              <Button
                className="filter-jobs__filter-button"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentKey: "additionalFilters",
                      size: "lg",
                    })
                  )
                }
              >
                {additionalFiltersCount > 0 && (
                  <Badge
                    pill
                    variant="danger"
                    style={{
                      position: "absolute",
                      top: "125%",
                      right: "50%",
                      transform: "translate(50%, -50%)",
                      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {additionalFiltersJobsCount}
                  </Badge>
                )}
                <TbFilterPlus className="filter-icon" />
              </Button>

              <Button
                variant="danger"
                className="filter-jobs__filter-button"
                onClick={() => dispatch(resetFilters())}
              >
                <TbFilterOff className="filter-icon" />
              </Button>
              {/* {showAdditionalFiltersModal && (
                <AdditionalFiltersModal show={showAdditionalFiltersModal} />
              )} */}
            </section>
          </>
        )}
      </div>

      {isFetching && (
        <div className="loader-main">
          <div>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="success"
              className="spinner"
            ></Spinner>
            {/* <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> */}
            {/* <h1>Loading...</h1> */}
          </div>
        </div>
      )}
      {error && <h1>Error:{error}</h1>}
      {jobs && (
        <>
          <JobList
            jobs={jobs}
            visibleItems={visibleItems}
            // singleCheckbox={isSelectedSingleCheckbox}
            // filteredJobs={filteredJobs}
            additionalFiltersCount={additionalFiltersCount}
          />
          <Button className="btn-load-more" onClick={loadMore}>
            Load More
          </Button>
        </>
      )}
    </>
  );
};

export default FilterJobs;
