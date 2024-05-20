import moment from "moment";

export const formatToMomentTime = (time) => {
  console.log("time: ", time);
  return moment(time, "hh:mm A").format("h:mm A");
};

export const formatToMomentDate = (date) => {
  return moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
};

export const getHoursAndMinutes = (time) => {
  const momentTime = moment(time, "HH:mm");
  const hours = momentTime.hour();
  const minutes = momentTime.minutes();
  return { hours, minutes };
};

export const implementationTypeStyles = (currentImplementationType) => {
  //   console.log("Current Imp : ", currentImplementationType);
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

  //   console.log("Current imp type: ", currentImplementationType);
  //   console.log("Matched imp type: ", matchedImplementationType);

  return {
    color: matchedImplementationType?.colour || "gray",
    fontWeight: "bold",
    fontStyle: "italic",
    textShadow: ".5px .5px .5px rgba(0,0,0, .5)",
  };
};
