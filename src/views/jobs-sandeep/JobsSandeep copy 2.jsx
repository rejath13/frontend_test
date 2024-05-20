import "./JobsSandeep.scss";
import JobList from "./components/JobList";
import { useFetchJobsQuery } from "../../store/jobs/api/jobsApi";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import FilterJobs from "./components/filtersection/FilterJobs";
import {
  addSubFilter,
  removeSubFilter,
} from "../../store/slices/jobsFilterSlice";

function App() {
  // const authToken = localStorage.getItem("authToken");
  // const loginUserType = localStorage.getItem("loginUserType");

  // const [scrollPosition, setScrollPosition] = useState(0);
  // const lastLoadedItemRef = useRef(null);

  // Restore scroll position when the component mounts
  // useEffect(() => {
  //   if (lastLoadedItemRef.current) {
  //     lastLoadedItemRef.current.scrollIntoView(); // Scroll to the last loaded item
  //   }
  // }, [scrollPosition]);
  // Filters

  // if (jobs) {
  return (
    <div className="jobs">
      <FilterJobs />
    </div>
  );
  // }
}

export default App;
