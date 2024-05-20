import React from "react";
import { FaMoneyBill1 } from "react-icons/fa6";

const ProjectValue = ({ projectValue }) => {
  return (
    <>
      <FaMoneyBill1 />

      <p>{projectValue}</p>
    </>
  );
};

export default ProjectValue;
