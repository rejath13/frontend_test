import React from "react";
import { BiChip } from "react-icons/bi";
import "./AddDevice.scss";
const AddDevice = () => {
  return (
    <>
      <button className="button-row-icon add-device-icon">
        <BiChip />
      </button>
    </>
  );
};

export default AddDevice;
