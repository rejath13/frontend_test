import React, { useContext, useState, useEffect } from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import NavIcon from "../NavIcon";
import NavBadge from "../NavBadge";

import { ConfigContext } from "../../../../../contexts/ConfigContext";
import * as actionType from "../../../../../store/actions";
import useWindowSize from "../../../../../hooks/useWindowSize";

//import Count from "./Count";
import { API_URL } from "../../../../../config/constant";

const authToken = localStorage.getItem("authToken");

const loginUserId = localStorage.getItem("loginUserId");

const url = API_URL + "getLeftMenuCount";

const options = {
  method: "get",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Xtoken: authToken,
  },
};

const NavItem = ({ layout, item }) => {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const { dispatch } = configContext;

  const [countArray, setCountArray] = useState([]);

  // useEffect(() => {
  //     const getCount = (async () => {
  //         const response = await fetch(url, options)

  //         const data = await response.json();

  //         setCountArray(data.countArray);
  //     })
  //     getCount();
  // }, [])

  // const configContext = useContext(ConfigContext);
  // const { rtlLayout } = configContext.state;
  // let dropdownRightAlign = false;
  // if (rtlLayout) {
  //     dropdownRightAlign = true;
  // }

  let itemTitle = item.title;
  if (item.icon) {
    itemTitle = <span className="pcoded-mtext">{item.title}</span>;
  }

  let itemTarget = "";
  if (item.target) {
    itemTarget = "_blank";
  }

  let subContent;
  if (item.external) {
    subContent = (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <NavIcon items={item} />
        {itemTitle}
        <NavBadge items={item} />
      </a>
    );
  } else {
    if (item.id === "dashboard") {
      if (loginUserId === "1" || loginUserId === "5") {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "customers") {
      if (
        loginUserId === "1" ||
        loginUserId === "2" ||
        loginUserId === "3" ||
        loginUserId === "4" ||
        loginUserId === "5" ||
        loginUserId === "7" ||
        loginUserId === "8" ||
        loginUserId === "10"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.customerCount > 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    Active+New+Demo Customers Count
                  </Tooltip>
                }
              >
                <span
                  className="label label-primary pcoded-badge"
                  style={{ right: "5px" }}
                >
                  {countArray.customerCount}
                </span>
              </OverlayTrigger>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "subscription") {
      if (
        loginUserId === "1" ||
        loginUserId === "2" ||
        loginUserId === "3" ||
        loginUserId === "4" ||
        loginUserId === "5" ||
        loginUserId === "7"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.subCount > 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Current month due</Tooltip>
                }
              >
                <span
                  className="label label-primary pcoded-badge"
                  style={{ right: "5px" }}
                >
                  {countArray.subCount}
                </span>
              </OverlayTrigger>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "subscription-due") {
      if (
        loginUserId === "1" ||
        loginUserId === "3" ||
        loginUserId === "5" ||
        loginUserId === "7"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.subDueCount > 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    Total (Active+New+Demo) Expired Customers Count
                  </Tooltip>
                }
              >
                <span
                  className="label label-primary pcoded-badge"
                  style={{ right: "5px" }}
                >
                  {countArray.subDueCount}
                </span>
              </OverlayTrigger>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "monitoring-due") {
      if (
        loginUserId === "1" ||
        loginUserId === "3" ||
        loginUserId === "5" ||
        loginUserId === "8" ||
        loginUserId === "10"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.monDueCount > 0 ? (
              <span
                className="label label-primary pcoded-badge"
                style={{ right: "5px" }}
              >
                {countArray.monDueCount}
              </span>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "training") {
      if (
        loginUserId === "1" ||
        loginUserId === "5" ||
        loginUserId === "8" ||
        loginUserId === "10"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.trainingCount > 0 ? (
              <span
                className="label label-primary pcoded-badge"
                style={{ right: "5px" }}
              >
                {countArray.trainingCount}
              </span>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "blocked-accounts") {
      if (
        loginUserId === "1" ||
        loginUserId === "2" ||
        loginUserId === "3" ||
        loginUserId === "4" ||
        loginUserId === "5" ||
        loginUserId === "7" ||
        loginUserId === "8" ||
        loginUserId === "10"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.blockedCount > 0 ? (
              <span
                className="label label-primary pcoded-badge"
                style={{ right: "5px" }}
              >
                {countArray.blockedCount}
              </span>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    } else if (item.id === "jobs") {
      if (
        loginUserId === "1" ||
        loginUserId === "2" ||
        loginUserId === "5" ||
        loginUserId === "7"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
            {countArray.jobsCount > 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Unassigned Count</Tooltip>}
              >
                <span
                  className="label label-primary pcoded-badge"
                  style={{ right: "5px" }}
                >
                  {countArray.jobsCount}
                </span>
              </OverlayTrigger>
            ) : (
              ""
            )}
          </NavLink>
        );
      }
    }
    /* Comment by Sandeep - commented schedule */
    // else if (item.id === "schedule") {
    //   if (
    //     loginUserId === "1" ||
    //     loginUserId === "2" ||
    //     loginUserId === "5" ||
    //     loginUserId === "7"
    //   ) {
    //     subContent = (
    //       <NavLink
    //         to={item.url}
    //         className="nav-link"
    //         exact={true}
    //         target={itemTarget}
    //       >
    //         <NavIcon items={item} />
    //         {itemTitle}
    //         {countArray.scheduleCount > 0 ? (
    //           <span
    //             className="label label-primary pcoded-badge"
    //             style={{ right: "5px" }}
    //           >
    //             {countArray.scheduleCount}
    //           </span>
    //         ) : (
    //           ""
    //         )}
    //       </NavLink>
    //     );
    //   }
    // }
    else if (item.id === "vehicles") {
      if (
        loginUserId === "1" ||
        loginUserId === "2" ||
        loginUserId === "3" ||
        loginUserId === "4" ||
        loginUserId === "5" ||
        loginUserId === "7" ||
        loginUserId === "8" ||
        loginUserId === "10" ||
        loginUserId === '19'
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "salesplus") {
      if (
        loginUserId === "1" ||
        loginUserId === "5" ||
        loginUserId === "9" ||
        loginUserId === "11" ||
        loginUserId === "6" ||
        loginUserId === "13" ||
        loginUserId === "14"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "cold-call") {
      if (
        loginUserId === "1" ||
        loginUserId === "5" ||
        loginUserId === "9" ||
        loginUserId === "11" ||
        loginUserId === "6" ||
        loginUserId === "13"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "door-door") {
      if (
        loginUserId === "1" ||
        loginUserId === "5" ||
        loginUserId === "6" ||
        loginUserId === "9" ||
        loginUserId === "10" ||
        loginUserId === "11" ||
        loginUserId === "13"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "door-report") {
      if (
        loginUserId === "1" ||
        loginUserId === "5" ||
        loginUserId === "9" ||
        loginUserId === "11" ||
        loginUserId === "6" ||
        loginUserId === "13"
      ) {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "customer-service") {
      if (loginUserId === "1" || loginUserId === "5") {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "mail") {
      if (loginUserId === "1" || loginUserId === "5" || loginUserId === "14") {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else if (item.id === "itc") {
      if (loginUserId !== "14") {
        subContent = (
          <NavLink
            to={item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={item} />
            {itemTitle}
          </NavLink>
        );
      }
    } else {
      subContent = (
        <NavLink
          to={item.url}
          className="nav-link"
          exact={true}
          target={itemTarget}
        >
          <NavIcon items={item} />
          {itemTitle}
        </NavLink>
      );
    }
  }
  let mainContent = "";
  if (layout === "horizontal") {
    mainContent = (
      <ListGroup.Item
        as="li"
        bsPrefix=" "
        onClick={() => dispatch({ type: actionType.NAV_CONTENT_LEAVE })}
      >
        {subContent}
      </ListGroup.Item>
    );
  } else {
    if (windowSize.width < 992) {
      mainContent = (
        <ListGroup.Item
          as="li"
          bsPrefix=" "
          className={item.classes}
          onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}
        >
          {subContent}
        </ListGroup.Item>
      );
    } else {
      mainContent = (
        <ListGroup.Item as="li" bsPrefix=" " className={item.classes}>
          {subContent}
        </ListGroup.Item>
      );
    }
  }

  return <React.Fragment>{mainContent}</React.Fragment>;
};

export default NavItem;
