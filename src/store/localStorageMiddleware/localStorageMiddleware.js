// sessionStorageMiddleware.js

const sessionStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  console.log(
    "redux schedule main nav state: ",
    store.getState().schedulerMainNav
  );
  // Save the state to local storage after each action
  const { schedulerMainNav } = store.getState();
  sessionStorage.setItem(
    "redux-scheduler-main-nav",
    JSON.stringify(schedulerMainNav)
  );

  return result;
};

export default sessionStorageMiddleware;
