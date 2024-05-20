import React from "react";
import { openModal } from "../../../../store/slices/jobs/jobsModalSlice";
import { useDispatch, useSelector } from "react-redux";
import "./CompanyInfo.scss";

const CompanyInfo = ({
  companyName,
  customerName,
  customerPhone,
  implementationType,
  jobId,
}) => {
  const dispatch = useDispatch();
  const formatImplementationType = (currentImplementationType) => {
    // console.log("Current Imp : ", currentImplementationType);
    const allTypes = [
      {
        id: 1,
        title: "LOCATOR",
        colour: "blue",
      },
      {
        id: 2,
        title: "ASATEEL",
        colour: "green",
      },
      {
        id: 3,
        title: "LOCATOR+ASATEEL",
        colour: "red",
      },
      {
        id: 4,
        title: "SECUREPATH",
        colour: "orange",
      },
      {
        id: 5,
        title: "LOCATOR+SECUREPATH",
        colour: "yellow",
      },
      {
        id: 6,
        title: "RASID",
        colour: "purple",
      },
      {
        id: 7,
        title: "SERVICE",
        colour: "violet",
      },
      {
        id: 8,
        title: "SHAHIN",
        colour: "indigo",
      },
      {
        id: 9,
        title: "SECUREPATH PREMIUM",
        colour: "brown",
      },
      {
        id: 10,
        title: "SECUREPATH PREMIUM + LOCATOR",
        colour: "pink",
      },
      {
        id: 11,
        title: "OTHER",
        colour: "gray",
      },
    ];
    const matchedImplementationType = allTypes.find((item) =>
      currentImplementationType === item.title ? item.colour : ""
    );

    if (matchedImplementationType) {
      // console.log("AssignedColour : ", matchedImplementationType.colour);
      return matchedImplementationType.colour;
    } else return "gray";
  };

  // console.log("Colour is ", formatImplementationType(implementationType));
  const implementationTypeStyles = {
    color: formatImplementationType(implementationType),
    fontWeight: "bold",
    fontStyle: "italic",
    textShadow: ".5px .5px .5px rgba(0,0,0, .5)",
  };

  return (
    <>
      <div
        className="column3__company-name single-row"
        onClick={() =>
          dispatch(
            openModal({
              componentKey: "editJobContent",
              size: "xl",
              data: {
                jobId,
              },
            })
          )
        }
      >
        <h2>Company: </h2>
        <p className="">{companyName}</p>
      </div>
      <div className="column3__customer-name single-row">
        <h2>Customer:</h2>
        <p>{customerName}</p>
      </div>
      <div className="column3__customer-phone single-row">
        <h2>Ph:</h2>
        <p>{customerPhone}</p>
      </div>
      <div className="column3__implementation-type single-row">
        <h2>Type:</h2>
        <p style={implementationTypeStyles}>
          {implementationType ? implementationType : "NO TYPE PROVIDED"}
        </p>
      </div>
    </>
  );
};

export default CompanyInfo;
