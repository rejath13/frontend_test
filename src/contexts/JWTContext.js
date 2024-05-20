import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "../store/actions";
import axios from "axios";
import accountReducer from '../store/accountReducer';
import Loader from "../components/Loader/Loader";

import {  API_URL } from "../config/constant";

const initialState = {
  isLoggedIn: false,
  isInitialised: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }

  const decoded = jwtDecode(serviceToken);
  return decoded.exp > (Date.now() / 1000);
};

const setSession = (serviceToken,loginUserId,loginUserType,loginUserName,sale_person_id) => {
  if (serviceToken) {
    localStorage.setItem('authToken', serviceToken);
    localStorage.setItem('loginUserId', loginUserId);
    localStorage.setItem('loginUserType', loginUserType);
    localStorage.setItem('loginUserName', loginUserName);
    localStorage.setItem('sale_person_id', sale_person_id);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginUserId');
    localStorage.removeItem('loginUserType');
    localStorage.removeItem('loginUserName');
    localStorage.removeItem('sale_person_id');
    localStorage.removeItem("authVehicleToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => { }
});

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  const login = async (email, password) => {
    const response = await axios.post(API_URL+'Login', { 'user_name':email, 'user_password':password });
    const user = response.data.user;
    const authToken = response.data.token;
    const loginUserId = response.data.userId;
    const loginUserType = response.data.userType;
    const loginUserName = response.data.user.user_name;
    const sale_person_id= response.data.user.sale_person_id;

    setSession(authToken,loginUserId,loginUserType,loginUserName,sale_person_id);
    dispatch({
      type: LOGIN,
      payload: {
        user
      }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem('authToken');
        if (authToken && verifyToken(authToken)) {
          setSession(authToken);
          // const response = await axios.get('/api/account/me');
          // const { user } = response.data;
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: true
            }
          });
        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null
          }
        });
      }
    };

    init();
  }, []);

  if (!state.isInitialised) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login, logout}}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;