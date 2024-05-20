import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";

const SalesPerson = ({ salesName }) => {
  return (
    <>
      <FaRegCircleUser />
      <p>{salesName}</p>
    </>
  );
};

export default SalesPerson;
