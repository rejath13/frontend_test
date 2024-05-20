import React from "react";

const IndexComponent = ({ index, sortOrder }) => {
  return (
    <>
      <span>#</span>
      <span>{index}</span>
      {/* <span>{sortOrder}</span> */}
    </>
  );
};

export default IndexComponent;
