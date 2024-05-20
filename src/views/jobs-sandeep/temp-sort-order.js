const someFunction = () => {
  if (subFiltersArray?.length === 1) {
    filteredData = filteredData.filter((item) => {
      return subFiltersArray.includes(item.salesPlus.customerStatus);
    });
    // for getting single checkbox jobs
    // console.log("Inside helperjobsapi: ", subFiltersArray[0]);
    console.log("Sub Filters array is 1");
    console.log("Sorted data before dispatching from helper: ", sortOrderData);
    let tempFilter = subFiltersArray[0];
    console.log("temp filter is ", tempFilter);
    console.log(
      "Sort order in subfilter: ",
      sortOrderData?.sortOrderData[tempFilter]
    );
    if (!sortOrderData?.sortOrderData[tempFilter]) {
      console.log("Sort order data for single is empty");
      let singleFilterData = sortOrderData?.sortOrderData[tempFilter];
      store.dispatch(
        setSingleFilteredJobs({
          filter: tempFilter,
          filteredJobs: filteredData,
        })
      );
    } else {
      console.log("Sort order data exists");
      let singleFilterData = sortOrderData.sortOrderData[tempFilter];
      console.log("Single filter data in else: ", singleFilterData);
      store.dispatch(
        setSingleFilteredJobs({
          filter: tempFilter,
          filteredJobs: singleFilterData,
        })
      );
      console.log("Single filter data = ", singleFilterData);
      const extraItems = filteredData.filter(
        (item2) => !singleFilterData.some((item1) => item1.id === item2.id)
      );
      console.log("Extra items : ", extraItems);
    }
  }
};
