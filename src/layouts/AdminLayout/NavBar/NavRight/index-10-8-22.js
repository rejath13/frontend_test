import React, { useContext, useState } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ChatList from "./ChatList";
import {ConfigContext} from "../../../../contexts/ConfigContext";
import useAuth from '../../../../hooks/useAuth';

import adminprofile from "../../../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../../../assets/images/profile-logo/shone.jpg";

const loginUserId = localStorage.getItem('loginUserId');


const NavRight = () => {
    const configContext = useContext(ConfigContext);
    const { logout } = useAuth();
    const { rtlLayout } = configContext.state;

    const [listOpen, setListOpen] = useState(false);

    const handleLogout = async () => {
        try {
            //handleClose();
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <React.Fragment>
            <ListGroup as='ul' bsPrefix=' ' className="navbar-nav ml-auto" id='navbar-right'>
                
                
                <ListGroup.Item as='li' bsPrefix=' '>
                    <Dropdown alignRight={!rtlLayout} className="drp-user">
                        <Dropdown.Toggle as={Link} variant='link' to='#' id="dropdown-basic">
                            <i className="icon feather icon-settings"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight className="profile-notification">
                            <div className="pro-head">
                                <img src={loginUserId==='1'?adminprofile:loginUserId==='5'?shamsprofile:loginUserId==='3'?shamnadprofile:loginUserId==='2'?rasickprofile:loginUserId==='5'?ajmalprofile:loginUserId==='7'?celineprofile:loginUserId==='8'?shoneprofile:adminprofile} className="img-radius" alt="User Profile"/>
                                <span>{loginUserId==='1'?'Admin':loginUserId==='5'?'Shamsudheen':loginUserId==='3'?'Shamnad':loginUserId==='2'?'Rasick':loginUserId==='5'?'Ajmal':loginUserId==='7'?'Celine':loginUserId==='8'?'Shone':'Admin'}</span>
                                <Link to='/' className="dud-logout" title="Logout">
                                    <i className="feather icon-log-out"/>
                                </Link>
                            </div>
                            <ListGroup as='ul' bsPrefix=' ' variant='flush' className="pro-body">
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item"><i className="feather icon-settings"/> Settings</Link></ListGroup.Item>
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item"><i className="feather icon-user"/> Profile</Link></ListGroup.Item>
                                <ListGroup.Item as='li' bsPrefix=' '><Link to='/' className="dropdown-item"><i className="feather icon-log-out"/> Logout</Link></ListGroup.Item>
                            </ListGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </ListGroup.Item>
            </ListGroup>
            <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
        </React.Fragment>
    );
};

export default NavRight;
