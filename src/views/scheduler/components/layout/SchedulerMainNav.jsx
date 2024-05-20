import React from "react";
import { capitalizeFirstLetter } from "../../../jobs-sandeep/helpers/job-card-helper";
import {
  selectMainNavTabs,
  updateSchedulerMainNav,
} from "../../../../store/slices/scheduler/schedulerMainNavSlice";
import { useSelector, useDispatch } from "react-redux";

import "./SchedulerMainNav.scss";

const SchedulerMainNav = () => {
  // SchedulerMainNav Component
  const mainNavTabs = useSelector(selectMainNavTabs);
  const dispatch = useDispatch();

  const handleMainNavTabClick = (clickedId) => {
    dispatch(updateSchedulerMainNav(clickedId));
  };

  return (
    <>
      <ul className="nav nav-tabs">
        {mainNavTabs?.map((item, index) => (
          <li key={index} className="nav-item">
            <a
              className={`nav-link ${item.isActive ? "active" : ""} `}
              onClick={() => handleMainNavTabClick(item.id)}
              href="#"
            >
              <span>{capitalizeFirstLetter(item.link)}</span>
              {/* <span>[00]</span> */}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SchedulerMainNav;
