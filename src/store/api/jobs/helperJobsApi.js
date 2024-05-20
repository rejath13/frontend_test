import {
  setAdditionalFiltersCount,
  setCounts,
  setNewJobsNotificationCount,
} from "../../slices/jobs/jobsCountSlice";
import { setSingleFilteredJobs } from "../../slices/jobs/jobSlice";
import store from "../../index";

export function transformData(data, filters) {
  // const { sortOrderData } = fullData;
  // console.log("transform function sorted data: ", sortOrderData);
  // const { jobs: data } = fullData;
  let jobCounts = {
    pending: 0,
    completed: 0,
    unassigned: 0,
    scheduled: 0,
    assigned: 0,
    inprogress: 0,
    demo: 0,
    onhold: 0,
  };

  let filteredData = [];
  if (filters) {
    const {
      mainFilter,
      checkboxes: subFilters,
      searchTextFilter,
      paymentVerifiedFilters,
      paymentStatusFilters,
      mailSentStatusFilters,
      accountCreatedStatusFilters,
      deletedStatusFilters,
      salesPersonFilters,
      implementationTypeFilters,
      jobStatusFilters,
    } = filters;

    /* Sub Filters Array Section ================================= */
    const subFiltersArray =
      deletedStatusFilters.deleted ||
      salesPersonFilters ||
      implementationTypeFilters ||
      jobStatusFilters
        ? [] // we are deliberately making the subFiltersArray empty when the above filters are applied in additional filters
        : populateSubFiltersArray(subFilters);
    /* Payment Verified Filters ================================== */
    const pvArray = populatePvArray(paymentVerifiedFilters);

    /* Payment Status Filters Array ============================== */
    const psArray = populatePsArray(paymentStatusFilters);

    /* Mail Sent Filters Array =================================== */
    const mailSentArray = populateMailSentArray(mailSentStatusFilters);

    /* Account Created Filters Array ============================= */
    const accArray = populateAccountCreatedArray(accountCreatedStatusFilters);

    /* Deleted Status Filters Array ============================== */
    const deletedArray = populateDeletedArray(deletedStatusFilters);

    /* Sales Person Filters  ============================== */

    switch (mainFilter) {
      case "pending": {
        filteredData = data.filter((item) => {
          return item.salesPlus.isCompleted === "0";
        });

        const unassignedCount = filteredData.filter(
          (item) => item.salesPlus.customerStatus === "unassigned"
        );

        if (searchTextFilter?.length > 0) {
          return getSearchTextResult(filteredData, searchTextFilter);
        }

        if (subFiltersArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return subFiltersArray.includes(item.salesPlus.customerStatus);
          });
        } else if (
          deletedArray?.length > 0 ||
          salesPersonFilters ||
          implementationTypeFilters ||
          jobStatusFilters
        ) {
          //This is a workaround for adding deleted checkbox in additional filters, if the deleted array is greater than 0 we are passing the previous filtered data as it is so that later the deleted part can filter the data accordingly and show the result. The same for salesPersonFilters
          filteredData = filteredData;
        } else {
          return []; // if none of the sub filters are selected, you can either pass all pending jobs or empty. here it is empty
        }

        if (pvArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return pvArray.includes(item.paymentVerified);
          });
        }

        if (psArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return psArray?.includes(item.salesPlus.paymentStatus);
          });
        }

        if (mailSentArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return mailSentArray?.includes(item.customerEmailSent);
          });
        }

        if (accArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return accArray?.includes(item.salesPlus.customerCreated); // sandeep doubt ? is it customer created or traccar id exists
          });
        }

        if (deletedArray?.length > 0) {
          // console.log("deleted array : ", deletedArray);
          filteredData = filteredData.filter((item) => {
            return deletedArray?.includes(item.salesPlus.customerStatus);
          });
        }

        if (salesPersonFilters) {
          filteredData = filteredData.filter((item) => {
            return item.salesPlus?.salesPerson?.id === salesPersonFilters;
          });
        }

        if (implementationTypeFilters) {
          filteredData = filteredData.filter((item) => {
            return (
              item.salesPlus?.implementationType?.toUpperCase() ===
              implementationTypeFilters
            );
          });
        }
        if (jobStatusFilters) {
          filteredData = filteredData.filter((item) => {
            return item.salesPlus?.customerStatus === jobStatusFilters;
          });
        }
        // console.log("Before ", filteredData);
        // filteredData = filteredData.sort(
        //   (a, b) => new Date(a.jobCreatedDate) - new Date(b.jobCreatedDate)
        // );
        // filteredData = filteredData.sort((a, b) => b.sortOrder - a.sortOrder);
        // console.log("After ", filteredData);
        return filteredData;
      }
      case "completed": {
        filteredData = data.filter(
          (item) => item.salesPlus.customerStatus === "completed"
        );

        if (searchTextFilter?.length > 0) {
          return getSearchTextResult(filteredData, searchTextFilter);
        }
        if (pvArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return pvArray.includes(item.paymentVerified);
          });
        }

        if (psArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return psArray?.includes(item.salesPlus.paymentStatus);
          });
        }

        if (mailSentArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return mailSentArray?.includes(item.customerEmailSent);
          });
        }

        if (accArray?.length > 0) {
          filteredData = filteredData.filter((item) => {
            return accArray?.includes(item.salesPlus.customerCreated); // sandeep doubt ? is it customer created or traccar id exists
          });
        }

        if (deletedArray?.length > 0) {
          // console.log("deleted array : ", deletedArray);
          filteredData = filteredData.filter((item) => {
            return deletedArray?.includes(item.salesPlus.customerStatus);
          });
        }

        if (salesPersonFilters) {
          filteredData = filteredData.filter((item) => {
            return item.salesPlus?.salesPerson?.id === salesPersonFilters;
          });
        }
        if (implementationTypeFilters) {
          filteredData = filteredData.filter((item) => {
            return (
              item.salesPlus?.implementationType?.toUpperCase() ===
              implementationTypeFilters
            );
          });
        }
        if (jobStatusFilters) {
          filteredData = filteredData.filter((item) => {
            return item.salesPlus?.customerStatus === jobStatusFilters;
          });
        }

        return filteredData;
      }
    }
  }
}

function getSearchTextResult(data, searchTextFilter) {
  console.log('searchtext filter : ', searchTextFilter)
  console.log('data searchtext :', data )
  const filteredData = data?.filter((item) => {
    const searchTextLowerCase = searchTextFilter?.toLowerCase();
    return (
      item?.salesPlus?.companyName?.toLowerCase().includes(searchTextLowerCase) ||
      item?.salesPlus?.customerName?.toLowerCase().includes(searchTextLowerCase) ||
      (item?.salesPlus?.salesPerson !== null &&
        item?.salesPlus?.salesPerson?.name?.toLowerCase().includes(searchTextLowerCase)) ||
      (item?.salesPlus?.implementationType &&
        item?.salesPlus?.implementationType?.toLowerCase().includes(searchTextLowerCase))
    );
  });
  console.log(filteredData);
  return filteredData;
}

function populateSubFiltersArray(subFilters) {
  const subFiltersArray = [];
  subFilters.map((filter) => {
    if (filter.isChecked) {
      subFiltersArray.push(filter.name);
    } else {
      return;
    }
  });
  return subFiltersArray;
}

function populateMailSentArray(mailSentStatusFilters) {
  const mailSentArray = [];
  const { sent, notSent } = mailSentStatusFilters;
  if (sent) {
    mailSentArray.push(true);
  }
  if (notSent) {
    mailSentArray.push(false);
  }
  return mailSentArray;
}

function populateAccountCreatedArray(accountCreatedStatusFilters) {
  const accArray = [];
  const { created, notCreated } = accountCreatedStatusFilters;
  if (created) {
    accArray.push(1);
  }
  if (notCreated) {
    accArray.push(0);
  }
  return accArray;
}

function populatePsArray(paymentStatusFilters) {
  const psArray = [];
  const { paid, notPaid, partial } = paymentStatusFilters;
  if (partial) {
    psArray.push("partial");
  }
  if (paid) {
    psArray.push("yes");
  }
  if (notPaid) {
    psArray.push("no");
  }
  return psArray;
}

function populatePvArray(paymentVerifiedFilters) {
  const pvArray = [];
  const { paid, notPaid } = paymentVerifiedFilters;
  if (paid) {
    pvArray.push(true);
  }

  if (notPaid) {
    pvArray.push(false);
  }
  return pvArray;
}

function populateDeletedArray(deletedStatusFilters) {
  const deletedArray = [];
  const { deleted } = deletedStatusFilters;
  // console.log("Deleted in populate: ", deleted);
  if (deleted) {
    deletedArray.push("deleted");
  } else {
    deletedArray.pop("deleted");
  }
  return deletedArray;
}

function calculateNewJobsNotification(pendingData) {
  // Get previous pendingCount from store
  const prevPendingCount = store.getState().jobsCount.pendingCount;
  // console.log("Prev Pending Count in calcultate function: ", prevPendingCount);
  if (prevPendingCount !== 0) {
    // console.log("not zero");
    const newJobs = pendingData.length - prevPendingCount;
    // console.log("NewJobs is :", newJobs);

    store.dispatch(setNewJobsNotificationCount(newJobs));
  }
}

export function calculateCounts(data) {
  const pendingData = data.filter((item) => item.salesPlus.isCompleted === "0");

  // Calculate New jobs Notification here
  calculateNewJobsNotification(pendingData);

  const pendingCount = pendingData.length;

  const unassignedCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "unassigned"
  ).length;

  const scheduledCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "scheduled"
  ).length;
  const assignedCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "assigned"
  ).length;
  const inprogressCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "inprogress"
  ).length;
  const demoCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "demo"
  ).length;
  const onholdCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "onhold"
  ).length;
  const deletedCount = pendingData.filter(
    (item) => item.salesPlus.customerStatus === "deleted"
  ).length;

  store.dispatch(
    setCounts({
      pendingCount,
      unassignedCount,
      scheduledCount,
      assignedCount,
      inprogressCount,
      demoCount,
      onholdCount,
      deletedCount,
    })
  );

  // DISPATCH THESE COUNTS TO THE COUNT SLICE STATE
}

// const calculateAdditionalFilters = (data, additionalFilters) => {
//   const { paymentVerifiedFilter`s, paymentStatusFilters } = additionalFilters;
//   let filteredData = [];
//   if (additionalFilters) {
//     // Payment Verified Filters ==============================
//     const { paid: pvPaid, notPaid: pvNotPaid } = paymentVerifiedFilters;

//     if (pvPaid && pvNotPaid) {
//       filteredData = data.filter((item) => {
//         return (
//           item.paymentVerified === pvPaid && item.paymentVerified === pvNotPaid
//         );
//       });
//     } else if (pvPaid) {
//       filteredData = data.filter((item) => {
//         return item.paymentVerified;
//       });
//     } else if (pvNotPaid) {
//       filteredData = data.filter((item) => {
//         return !item.paymentVerified;
//       });
//     } else {
//       filteredData = data;
//     }

//     // Payment Status Filters ========================================
//     const {
//       paid: psPaid,
//       notPaid: psNotPaid,
//       partial: psPartial,
//     } = paymentStatusFilters;

//     if (psPaid && psNotPaid && psPartial) {
//       filteredData = filteredData.filter((item) => {
//         return (
//           item.salesPlus.paymentStatus === "yes" ||
//           item.salesPlus.paymentStatus === "no" ||
//           item.salesPlus.paymentStatus === "partial"
//         );
//       });
//     } else if (psPaid && psNotPaid) {
//       filteredData = filteredData.filter((item) => {
//         return (
//           item.salesPlus.paymentStatus === "no" ||
//           item.salesPlus.paymentStatus === "yes"
//         );
//       });
//     } else if (psPaid && psPartial) {
//       filteredData = filteredData.filter((item) => {
//         return (
//           item.salesPlus.paymentStatus === "partial" ||
//           item.salesPlus.paymentStatus === "yes"
//         );
//       });
//     } else if (psNotPaid && psPartial) {
//       filteredData = filteredData.filter((item) => {
//         return (
//           item.salesPlus.paymentStatus === "no" ||
//           item.salesPlus.paymentStatus === "partial"
//         );
//       });
//     } else if (psPaid) {
//       filteredData = filteredData.filter((item) => {
//         return item.salesPlus.paymentStatus === "yes";
//       });
//     } else if (psNotPaid) {
//       filteredData = filteredData.filter((item) => {
//         return item.salesPlus.paymentStatus === "no";
//       });
//     } else if (psPartial) {
//       filteredData = filteredData.filter((item) => {
//         return item.salesPlus.paymentStatus === "partial";
//       });
//     }
//     return filteredData;
//   }
// };
