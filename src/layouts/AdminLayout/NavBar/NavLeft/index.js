import React from "react";
import { ListGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import useWindowSize from "../../../../hooks/useWindowSize";

const NavLeft = () => {
  const location = useLocation();

  const currentPage = location.pathname.slice(1);

  const formattedPageText = currentPage.replace(/-/g, " ");

  const windowSize = useWindowSize();

  // const configContext = useContext(ConfigContext);
  // const { rtlLayout } = configContext.state;
  // let dropdownRightAlign = false;
  // if (rtlLayout) {
  //     dropdownRightAlign = true;
  // }

  let navItemClass = ["nav-item"];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, "d-none"];
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(" ")}>
          <h5 className="m-b-10 m-t-15 text-capitalize">
            {formattedPageText === "door door"
              ? "Door to Door"
              : formattedPageText === "jobs" //formerly 'sandeep'
              ? ""
              : formattedPageText === "scheduler"
              ? ""
              : formattedPageText}
          </h5>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
