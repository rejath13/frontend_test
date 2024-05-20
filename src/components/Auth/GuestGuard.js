import React from 'react';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../config/constant';

import useAuth from '../../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn) {
   // alert(BASE_URL);
    if(localStorage.getItem('loginUserType')=='accounts')
    {
      return <Redirect to='/customers' />;
    }
    else
    {
      return <Redirect to={BASE_URL} />;
    }
    
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default GuestGuard;
