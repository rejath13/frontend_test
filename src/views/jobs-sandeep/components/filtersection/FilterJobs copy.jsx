import React, { useState, useEffect } from "react";
import { useFetchJobsQuery } from "../../../../store/jobs/api/jobsApi";
import "./FilterJobs.scss";
import { useSelector, useDispatch } from "react-redux";
import { BsCheck } from "react-icons/bs";
import {
  setFilter,
  addSubFilter,
  removeSubFilter,
  toggleCheckbox,
  toggleAllCheckboxes,
  setDropdownFilter,
  setSearchTextFilter,
  setCheckboxCounts,
} from "../../../../store/slices/jobsFilterSlice";
import { setCounts } from "../../../../store/slices/jobsCountSlice";
import { Form, Button } from "react-bootstrap";
import JobList from "./../JobList";
import AdditionalFiltersModal from "./AdditionalFiltersModal";
import { setAdditionalFiltersModal } from "../../../../store/slices/jobsModalSlice";

const FilterJobs = () => {
  const checkboxes = useSelector((state) => state.jobsFilter.checkboxes);
  const mainFilter = useSelector((state) => state.jobsFilter.mainFilter);
  const subFilters = useSelector((state) => state.jobsFilter.subFilters);

  const showAdditionalFiltersModal = useSelector(
    (state) => state.jobsModal.additionalFiltersModal.show
  );
  const {
    pendingCount,
    unassignedCount,
    scheduledCount,
    assignedCount,
    inprogressCount,
    demoCount,
    onholdCount,
    deletedCount,
  } = useSelector((state) => state.jobsCount);
  console.log("Pending Count from selector: ", pendingCount);
  const dropdownFilter = useSelector(
    (state) => state.jobsFilter.dropdownFilter
  );
  const searchTextFilter = useSelector(
    (state) => state.jobsFilter.searchTextFilter
  );

  const {
    data: initialJobs,
    initialError,
    initialIsFetching,
  } = useFetchJobsQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (initialJobs) {
      // console.log("Initial Jobs Availabe");
      const pendingCount = initialJobs.length;
      // console.log("Pending count useeffect : ", pendingCount);
      const unassignedCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "unassigned"
      ).length;
      const scheduledCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "scheduled"
      ).length;
      const assignedCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "assigned"
      ).length;
      const inprogressCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "inprogress"
      ).length;
      const demoCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "demo"
      ).length;
      const onholdCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "onhold"
      ).length;
      const deletedCount = initialJobs.filter(
        (job) => job.salesPlus.customerStatus === "deleted"
      ).length;
      // console.log("useeffect deleted count: ", deletedCount);
      dispatch(
        setCounts({
          pendingCount,
          unassignedCount,
          scheduledCount,
          assignedCount,
          inprogressCount,
          demoCount,
          onholdCount,
          deletedCount,
        })
      );
      dispatch(
        setCheckboxCounts({
          unassignedCount,
          scheduledCount,
          assignedCount,
          inprogressCount,
          demoCount,
          onholdCount,
          deletedCount,
        })
      );
    }
  }, [initialJobs]);

  const setFilterArray = () => {
    checkboxes.map(({ name, isChecked }) => {
      isChecked
        ? dispatch(addSubFilter(name))
        : dispatch(removeSubFilter(name));
    });
  };

  useEffect(() => {
    setFilterArray();
  }, []);

  const {
    data: jobs,
    error,
    isFetching,
  } = useFetchJobsQuery({
    mainFilter,
    subFilters,
    dropdownFilter,
    searchTextFilter,
  });

  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  // Pagination - Load More
  const loadMore = () => {
    setVisibleItems((prevValue) => prevValue + itemsPerPage);
  };

  if (isFetching) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  // const checkboxes = useSelector((state) => state.jobsFilter.checkboxes);
  // const mainFilter = useSelector((state) => state.jobsFilter.mainFilter);
  // const dropdownFilter = useSelector(
  //   (state) => state.jobsFilter.dropdownFilter
  // );
  // const searchTextFilter = useSelector(
  //   (state) => state.jobsFilter.searchTextFilter
  // );
  // const [searchText, setSearchText] = useState("");
  // const dispatch = useDispatch();

  // console.log(
  //   "Sub Filters: ",
  //   useSelector((state) => state.jobsFilter.subFilters)
  // );

  const handleOnChange = (id, name) => {
    console.log("handlechange name is ", name);
    if (name !== "all") {
      dispatch(toggleCheckbox(id));
    } else {
      dispatch(toggleAllCheckboxes());
    }
  };

  const checkboxStyles = {
    // input[type="checkbox"]:checked + .label {
    //   /* Styles for checked checkbox */
    // }
  };

  const filterCheckboxes = checkboxes.map(
    ({ id, title, count, name, isChecked, bgColour, textColour }) => {
      return (
        <div
          className="filter-jobs__checkbox-container"
          key={id}
          style={{
            border: `2px solid ${bgColour}`,
            backgroundColor: `${isChecked ? bgColour : "white"}`,
            color: `${isChecked ? textColour : "black"}`,
            padding: ".5rem",
            borderRadius: ".25rem",
          }}
        >
          <label htmlFor={name}>
            <span>{title}</span> <span>[{count}]</span>
          </label>
          <input
            type="checkbox"
            className="filter-jobs__checkbox"
            id={name}
            name={name}
            value="checkboxValue"
            checked={isChecked}
            onChange={(e) => handleOnChange(id, name)}
            style={{
              display: "none",
              // backgroundColor: `${isChecked ? "black" : "white"} !important`,
            }}
          />
          <div
            onClick={(e) => handleOnChange(id, name)}
            style={{
              border: "1px solid #000", // Border style
              width: "20px", // Adjust the size as needed
              height: "20px", // Adjust the size as needed
              borderRadius: ".15rem",
              backgroundColor: isChecked ? "white" : "white", // Custom background color
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isChecked && (
              <BsCheck
                style={{
                  fontSize: "2rem",
                  color: "green",
                }}
              />
            )}
          </div>
        </div>
      );
    }
  );

  const handleDropDownFilterChange = (event) =>
    dispatch(setDropdownFilter(event.target.value));

  const handleOnChangeSearchTextFilter = (event) => {
    dispatch(setSearchTextFilter(event.target.value));
  };

  return (
    <>
      <div className="filter-jobs">
        <section className="filter-jobs__column1">
          <button
            className="filter-jobs__btn-pending"
            onClick={() => dispatch(setFilter("pending"))}
          >
            Pending - [{pendingCount}]
          </button>
        </section>
        {mainFilter === "pending" && (
          <>
            <section className="filter-jobs__column2">
              {filterCheckboxes}
            </section>
            <section className="filter-jobs__column3">
              <Form.Control
                as="select"
                aria-label="Default select example"
                onChange={handleDropDownFilterChange}
                value={dropdownFilter}
              >
                <option value="">Select Additional Filters</option>
                <option value="payVerified">Payment Verified</option>
                <option value="paystatus">Payment status</option>
                <option value="mailSentStatus">MailSent Status</option>
                <option value="accountCreatedStatus">
                  Account Created Status
                </option>
              </Form.Control>
              <Button onClick={() => dispatch(setAdditionalFiltersModal())}>
                Filters
              </Button>
              {showAdditionalFiltersModal && (
                <AdditionalFiltersModal show={showAdditionalFiltersModal} />
              )}
            </section>
            <section className="filter-jobs__column4">
              {/* <input
                type="text"
                value={searchTextFilter}
                key="searchText"
                
                onChange={handleOnChangeSearchTextFilter}
              /> */}
              <Form.Control
                type="text"
                placeholder="Search Jobs"
                value={searchTextFilter}
                key="searchJobsTextFilter"
                onChange={handleOnChangeSearchTextFilter}
              />
            </section>
            <section className="filter-jobs__column5">
              <button
                className="filter-jobs__btn-completed"
                onClick={() => dispatch(setFilter("completed"))}
              >
                Completed
              </button>
            </section>
          </>
        )}
      </div>
      {jobs && (
        <>
          <JobList jobs={jobs} visibleItems={visibleItems} />
          <Button className="btn-load-more" onClick={loadMore}>
            Load More
          </Button>
        </>
      )}
    </>
  );
};

export default FilterJobs;
