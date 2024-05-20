import React, { useContext, useEffect, useRef } from "react";

import Navigation from "./Navigation";
import NavBar from "./NavBar";
// import Breadcrumb from "./Breadcrumb";
import Configuration from "./Configuration";

import useWindowSize from "../../hooks/useWindowSize";
import useOutsideClick from "../../hooks/useOutsideClick";
import { ConfigContext } from "../../contexts/ConfigContext";
import * as actionType from "../../store/actions";
import { useLocation } from "react-router-dom";
const loginUserId = localStorage.getItem("loginUserId");

const AdminLayout = ({ children }) => {
  const windowSize = useWindowSize();
  const ref = useRef();
  const configContext = useContext(ConfigContext);

  const { collapseMenu, layout, subLayout, headerFixedLayout, configBlock } =
    configContext.state;
  const { dispatch } = configContext;

  const location = useLocation();

  const currentPage = location.pathname.slice(1);

  useOutsideClick(ref, () => {
    if (collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  });

  useEffect(() => {
    if (
      windowSize.width > 992 &&
      windowSize.width <= 1024 &&
      layout !== "horizontal"
    ) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }

    if (layout === "horizontal" && windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: "vertical" });
    }
  }, [dispatch, layout, windowSize]);

  const mobileOutClickHandler = () => {
    if (windowSize.width < 992 && collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  };

  let mainClass = ["pcoded-wrapper"];
  if (layout === "horizontal" && subLayout === "horizontal-2") {
    mainClass = [...mainClass, "container"];
  }

  let common = (
    <React.Fragment>
      <Navigation />
    </React.Fragment>
  );

  let mainContainer;

  // console.log(currentPage);
  // console.log(loginUserId);
  /* Commented by Sandeep - original*/
  // if ( (currentPage==='itc' && loginUserId!=='14') || (currentPage==='mail' && (loginUserId==='1' || loginUserId==='5' || loginUserId==='14')) ||  (currentPage==='dashboard' && (loginUserId==='1' || loginUserId==='5')) || (currentPage==='customers' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7' || loginUserId==='8' || loginUserId==='10')) || (currentPage==='subscription' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7')) || (currentPage==='subscription-due' && (loginUserId==='1' || loginUserId==='3' || loginUserId==='5' || loginUserId==='7')) || (currentPage==='monitoring-due' && (loginUserId==='1' || loginUserId==='3' || loginUserId==='5' || loginUserId==='8' || loginUserId==='10')) || (currentPage==='training' && (loginUserId==='1' || loginUserId==='5' || loginUserId==='8' || loginUserId==='10')) || (currentPage==='blocked-accounts' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='6' || loginUserId==='7' || loginUserId==='8' || loginUserId==='10')) || (currentPage==='jobs' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='5' || loginUserId==='7')) || (currentPage==='schedule' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='5' || loginUserId==='7')) || (currentPage==='vehicles' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7' || loginUserId==='8' || loginUserId==='10')) || (currentPage==='salesplus' && (loginUserId==='1' || loginUserId==='5' || loginUserId==='6' || loginUserId==='9' || loginUserId==='11' || loginUserId==='13' || loginUserId==='14')) || (currentPage==='items' && (loginUserId==='1' || loginUserId==='5'))|| (currentPage==='cold-call' && (loginUserId==='1'  || loginUserId==='5' || loginUserId==='6' || loginUserId==='9' || loginUserId==='11' || loginUserId==='13')) || (currentPage==='door-door' && (loginUserId==='1'  || loginUserId==='5' || loginUserId==='6' || loginUserId==='9' || loginUserId==='10' || loginUserId==='11' || loginUserId==='13')) || (currentPage==='door-door-data' && (loginUserId==='1'  || loginUserId==='5' || loginUserId==='6' || loginUserId==='9' || loginUserId==='10' || loginUserId==='11' || loginUserId==='13')) || (currentPage==='door-report' && (loginUserId==='1'  || loginUserId==='5' || loginUserId==='6' || loginUserId==='9' || loginUserId==='10' || loginUserId==='11' || loginUserId==='13')) || (currentPage==='customer-service' && (loginUserId==='1'  || loginUserId==='5')) ) {

  //     mainContainer = (
  //         <React.Fragment>
  //             <NavBar/>
  //             <div className="pcoded-main-container">
  //                 <div className={mainClass.join(' ')}>
  //                     <div className="pcoded-content">
  //                         <div className="pcoded-inner-content">
  //                             {/* <Breadcrumb/> */}
  //                             {children}
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </React.Fragment>
  //     );
  // }
  /* Comment by Sandeep - Removed schedule */
  if (// jobs-sandeep
    (currentPage === "jobs" && ['1','2','5','7'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7")) ||
    (currentPage === "scheduler" && ['1','2','5','7'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7")) ||
    (currentPage === "itc" && ['14','20','21'].includes(loginUserId)) ||
      // (loginUserId !== "14" || loginUserId !== "20" || loginUserId !== "21")) ||
    (currentPage === "mail" && ['1', '5','14', '18', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "14" ||
      //   loginUserId === "18" ||
      //   loginUserId === "20")) ||
    /* Commented by Sandeep */
    (currentPage === "dashboard" && ['1', '5'].includes(loginUserId)) ||
      // (loginUserId === "1" || loginUserId === "5")) ||
    (currentPage === "customers" && ['1', '2', '3', '4', '5', '7', '8', '10', '19'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "3" ||
      //   loginUserId === "4" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10" ||
      //   loginUserId === "19")) ||
    (currentPage === "subscription" && ['1', '2', '3', '4', '5', '7'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "3" ||
      //   loginUserId === "4" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7")) ||
    (currentPage === "subscription-due" && ['1', '3', '5', '7'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "3" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7")) ||
    (currentPage === "monitoring-due" && ['1',  '3',  '5', '8', '10', '19'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "3" ||
      //   loginUserId === "5" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10" ||
      //   loginUserId === "19")) ||
    (currentPage === "training" && ['1',  '5', '8', '10', '19'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10" ||
      //   loginUserId === "19")) ||
    (currentPage === "blocked-accounts" && ['1', '2',   '3', '4',   '5', '6', '7',  '8', '10', '19'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "3" ||
      //   loginUserId === "4" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "7" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10" ||
      //   loginUserId === "19")) ||
    // (currentPage === "jobs" &&
    //   (loginUserId === "1" ||
    //     loginUserId === "2" ||
    //     loginUserId === "5" ||
    //     loginUserId === "7")) ||
    // (currentPage === "schedule" &&
    //   (loginUserId === "1" ||
    //     loginUserId === "2" ||
    //     loginUserId === "5" ||
    //     loginUserId === "7")) ||
    (currentPage === "vehicles" && ['1', '2',   '3', '4',   '5',  '7',  '8', '10', '19'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "3" ||
      //   loginUserId === "4" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10" ||
      //   loginUserId === "19")) ||
    (currentPage === "salesplus" && ['1', '5', '6', '9', '11', '13', '14', '18', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "9" ||
      //   loginUserId === "11" ||
      //   loginUserId === "13" ||
      //   loginUserId === "14" ||
      //   loginUserId === "18" ||
      //   loginUserId === "20")) ||
    (currentPage === "items" && ['1', '5'].includes(loginUserId)) ||
    // (loginUserId === "1" || loginUserId === "5")) ||
    (currentPage === "cold-call" && ['1', '5', '6', '9', '11', '13',  '18', '21'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "9" ||
      //   loginUserId === "11" ||
      //   loginUserId === "13" ||
      //   loginUserId === "18" ||
      //   loginUserId === "21")) ||
    (currentPage === "door-door" && ['1', '5', '6', '9', '10', '11', '13',  '14', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "9" ||
      //   loginUserId === "10" ||
      //   loginUserId === "11" ||
      //   loginUserId === "13" ||
      //   loginUserId === "14" ||
      //   loginUserId === "20")) ||
    (currentPage === "door-door-data" &&  ['1', '5', '6', '9', '10', '11', '13',  '14', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "9" ||
      //   loginUserId === "10" ||
      //   loginUserId === "11" ||
      //   loginUserId === "13" ||
      //   loginUserId === "14" ||
      //   loginUserId === "20")) ||
    (currentPage === "door-report" && ['1', '5', '6', '9', '10', '11', '13',  '14', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "5" ||
      //   loginUserId === "6" ||
      //   loginUserId === "9" ||
      //   loginUserId === "10" ||
      //   loginUserId === "11" ||
      //   loginUserId === "13" ||
      //   loginUserId === "14" ||
      //   loginUserId === "20")) ||
    (currentPage === "customer-service" && ['1', '2', '3',  '5', '7', '10', '20'].includes(loginUserId)) ||
      // (loginUserId === "1" ||
      //   loginUserId === "2" ||
      //   loginUserId === "3" ||
      //   loginUserId === "5" ||
      //   loginUserId === "7" ||
      //   loginUserId === "10" ||
      //   loginUserId === "20")) ||
    (currentPage === "sim-management" && ['1', '7', '8', '10'].includes(loginUserId)) 
      // (loginUserId === "1" ||
      //   loginUserId === "7" ||
      //   loginUserId === "8" ||
      //   loginUserId === "10"))
  ) {
    mainContainer = (
      <React.Fragment>
        <NavBar />
        <div className="pcoded-main-container">
          <div className={mainClass.join(" ")}>
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                {/* <Breadcrumb/> */}
                {children}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (windowSize.width < 992) {
    let outSideClass = ["nav-outside"];
    if (collapseMenu) {
      outSideClass = [...outSideClass, "mob-backdrop"];
    }
    if (headerFixedLayout) {
      outSideClass = [...outSideClass, "mob-fixed"];
    }

    common = (
      <div className={outSideClass.join(" ")} ref={ref}>
        {common}
      </div>
    );

    mainContainer = (
      <div className="pcoded-outside" onClick={() => mobileOutClickHandler}>
        {mainContainer}
      </div>
    );
  }

  return (
    <React.Fragment>
      {common}
      {mainContainer}
      {configBlock && <Configuration />}
    </React.Fragment>
  );
};

export default AdminLayout;
