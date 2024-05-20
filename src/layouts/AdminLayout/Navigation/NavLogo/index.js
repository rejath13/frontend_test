import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { ConfigContext } from "../../../../contexts/ConfigContext";
import * as actionType from "../../../../store/actions";

import adminprofile from "../../../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../../../assets/images/profile-logo/shone.jpg";

import vishalprofile from "../../../../assets/images/profile-logo/vishal.jpg";

import ajmal_mprofile from "../../../../assets/images/profile-logo/ajmal_m.jpg";

import nishadprofile from "../../../../assets/images/profile-logo/nishad.jpeg";

const loginUserId = localStorage.getItem("loginUserId");
const loginUserName = localStorage.getItem("loginUserName");

const NavLogo = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const { dispatch } = configContext;

  let toggleClass = ["mobile-menu"];
  if (collapseMenu) {
    toggleClass = [...toggleClass, "on"];
  }

  return (
    <React.Fragment>
      <div className="navbar-brand header-logo">
        <Link to="#" className="b-brand">
          <div className="b-bg">
            <img
              src={
                loginUserId === "1"
                  ? adminprofile
                  : loginUserId === "5"
                  ? shamsprofile
                  : loginUserId === "3"
                  ? shamnadprofile
                  : loginUserId === "2"
                  ? rasickprofile
                  : loginUserId === "6"
                  ? ajmalprofile
                  : loginUserId === "7"
                  ? celineprofile
                  : loginUserId === "8"
                  ? shoneprofile
                  : loginUserId === "9"
                  ? vishalprofile
                  : loginUserId === "10"
                  ? ajmal_mprofile
                  : loginUserId === "11" || loginUserId === "13"
                  ? nishadprofile
                  : adminprofile
              }
              className="left-logo"
              alt="User Profile"
            />
          </div>
          <span className="b-title">{loginUserName}</span>
        </Link>
        <Link
          to="#"
          className={toggleClass.join(" ")}
          id="mobile-collapse"
          onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}
        >
          <span />
        </Link>
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
