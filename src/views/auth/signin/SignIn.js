import React from "react";
import { Card } from "react-bootstrap";

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import JWTLogin from './JWTLogin';

import logo from '../../../assets/images/auth/locator-logo.png';

const Signin = () => {
    return (
        <React.Fragment>
            <Breadcrumb/>
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r"/>
                        <span className="r s"/>
                        <span className="r s"/>
                        <span className="r"/>
                    </div>
                    <Card className="borderless text-center">
                        <Card.Body>
                            <div className="mb-4">
                                <img src={logo} alt="" className="locator-logo"/>
                            </div>
                            <JWTLogin />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Signin;