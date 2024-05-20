import React, { useContext } from "react";
import { ListGroup, Dropdown, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { ConfigContext } from "../../../../contexts/ConfigContext";

import adminprofile from "../../../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../../../assets/images/profile-logo/celine.jpg";

import vishalprofile from "../../../../assets/images/profile-logo/vishal.jpg";

import shoneprofile from "../../../../assets/images/profile-logo/shone.jpg";

import ajmal_mprofile from "../../../../assets/images/profile-logo/ajmal_m.jpg";

import nishadprofile from "../../../../assets/images/profile-logo/nishad.jpeg";

import { API_URL } from "../../../../config/constant";
const authToken = localStorage.getItem("authToken");

const NavRight = () => {
  const configContext = useContext(ConfigContext);
  const { rtlLayout } = configContext.state;
  const loginUserId = localStorage.getItem("loginUserId");
  const loginUserName = localStorage.getItem("loginUserName");

  const history = useHistory();

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginUserId");
    localStorage.removeItem("loginUserType");
    localStorage.removeItem("loginUserName");
    localStorage.removeItem("sale_person_id");
    localStorage.removeItem("authVehicleToken");
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
      data: JSON.stringify({ token: authToken }),
    };

    const url = `${API_URL}tokenDelete`;

    const response = await fetch(url, options);

    history.push("/");
  };

  return (
    <React.Fragment>
      <ListGroup
        as="ul"
        bsPrefix=" "
        className="navbar-nav ml-auto"
        id="navbar-right"
      >
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown alignRight={!rtlLayout} className="drp-user">
            <Dropdown.Toggle
              as={Link}
              variant="link"
              to="#"
              id="dropdown-basic"
            >
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="profile-notification">
              <div className="pro-head">
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
                  className="img-radius"
                  alt="User Profile"
                />
                <span>{loginUserName}</span>
                <Button
                  onClick={() => logout()}
                  className="dud-logout"
                  title="Logout"
                >
                  <i className="feather icon-log-out" />
                </Button>
              </div>
              <ListGroup
                as="ul"
                bsPrefix=" "
                variant="flush"
                className="pro-body"
              >
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link
                    to=""
                    onClick={() => logout()}
                    className="dropdown-item"
                  >
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;
