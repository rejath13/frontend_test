import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { useSelector, useDispatch } from "react-redux";
import {
  setSingleFilteredJobs,
  syncJobsOrderDb,
  updateJobsOrder,
} from "../../../store/slices/jobs/jobSlice";
import {
  usePersistSortOrderMutation,
  useGetSortOrderQuery,
} from "../../../store/api/jobs/jobsApi";

import "./jobList.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const JobCardList = ({
  jobs,
  visibleItems,
  // singleCheckbox,
  // filteredJobs,
  additionalFiltersCount,
}) => {
  //

  const checkboxes = useSelector((state) => state.jobsFilter.checkboxes);

  const { data: dbSortOrder } = useGetSortOrderQuery();
  // console.log("Dbsortorder: ", dbSortOrder);

  const dispatch = useDispatch();

  const [persistSortOrder, { isLoading }] = usePersistSortOrderMutation();

  const getSelectedSingleCheckbox = () => {
    return checkboxes.filter((item) => item.isChecked);
  };
  /* Here we are checking whether the filter checkboxes are multiple checked for adding drag n drop*/
  const singleCheckbox =
    checkboxes.filter((item) => item.isChecked).length === 1 ? true : false;
  let singleFilter;
  if (singleCheckbox) {
    singleFilter = getSelectedSingleCheckbox()[0].name; // get the single checked checkbox
  }

  useEffect(() => {
    if (dbSortOrder) {
      dispatch(syncJobsOrderDb(dbSortOrder.sortOrderData));
    }
  }, [dbSortOrder]); // Run when dbSortOrder changes to sync with redux state

  const singleFilteredJobsMappings = useSelector(
    (state) => state.jobs.singleFilteredJobsMappings
  );

  // console.log(
  //   "Single Filtered Mappings in JobList: ",
  //   singleFilteredJobsMappings
  // );
  // useEffect(() => {
  // }, [singleFilteredJobsMappings]);

  // if (dbSortOrder?.sortOrderData[singleFilter]) {
  //   dispatch(
  //     updateJobsOrder({
  //       filter: singleFilter,
  //       reorderedJobs: dbSortOrder.sortOrderData[singleFilter],
  //     })
  //   );
  // }

  const orderJobs = () => {
    // let sortOrderData = dbSortOrder?.sortOrderData;
    let sortOrderData = singleFilteredJobsMappings;
    console.log("Order jobs dbSortOrder: ", sortOrderData);
    let storedJobs = sortOrderData?.[singleFilter];
    // console.log("StoredJobs is ", storedJobs);
    // console.log("Single Filter is ", singleFilter);
    if (storedJobs) {
      const orderedJobsMap = new Map(
        storedJobs.map((job, index) => [job.id, index])
      );

      // Find extra items
      const extraItems = jobs.filter((job) => !orderedJobsMap.has(job.id));
      // console.log("Extra items in jobs: ", extraItems);

      // Removed extra items from jobs array
      jobs = jobs.filter((job) => orderedJobsMap.has(job.id));

      // console.log("OrderedJobsMap : ", orderedJobsMap);
      // console.log("Order Jobs jobs =", jobs);
      jobs = jobs.toSorted((a, b) => {
        const indexA = orderedJobsMap.get(a.id);
        const indexB = orderedJobsMap.get(b.id);
        if (indexA < indexB) {
          return -1;
        } else if (indexA > indexB) {
          return 1;
        } else {
          return 0;
        }
      });
      // console.log("job after sorting: ", jobs);

      // Add extra items to the start of the jobs array
      jobs = [...extraItems, ...jobs];
      // console.log("job after adding extra: ", jobs);

      return jobs;
      // console.log("OrderedJobsMap is : ", orderedJobsMap);
    }
  };
  if (singleCheckbox) {
    orderJobs();
    // console.log("jobs after ordering : ", jobs);
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return; // Dragged outside the list
    }

    const updatedItems = Array.from(jobs);

    let [movedItem] = updatedItems.splice(result.source.index, 1);

    movedItem = { ...movedItem, orderedItemFlag: true };

    updatedItems.splice(result.destination.index, 0, movedItem);

    await dispatch(
      updateJobsOrder({
        filter: singleFilter,
        reorderedJobs: updatedItems,
      })
    );
    let tempMappings = { ...dbSortOrder?.sortOrderData };

    tempMappings[singleFilter] = updatedItems;
    // console.log("Temp Mappings: ", tempMappings);

    const response = await persistSortOrder({ tempMappings });
  };

  return (
    <>
      {singleCheckbox && !additionalFiltersCount && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <ul
                className="job-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {jobs?.slice(0, visibleItems).map((job, index) => {
                  return (
                    <Draggable
                      key={job.id}
                      draggableId={job.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          id={`job-${index}`}
                          className="job-list__item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <JobCard
                            job={job}
                            index={index}
                            provided={provided}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* {singleCheckbox &&
        additionalFiltersCount && ( // This is for displaying items when it is single checkbox selected and additional Filters are applied. drag n drop will not be available.
          <ul className="job-list">
            {jobs?.slice(0, visibleItems).map((job, index) => {
              return (
                <li key={job.id} id={`job-${index}`} className="job-list__item">
                  <JobCard job={job} index={index} provided={false} />
                </li>
              );
            })}
          </ul>
        )} */}

      {!singleCheckbox && (
        <ul className="job-list">
          {jobs?.slice(0, visibleItems).map((job, index) => {
            return (
              <li key={job.id} id={`job-${index}`} className="job-list__item">
                <JobCard job={job} index={index} provided={false} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
export default JobCardList;
