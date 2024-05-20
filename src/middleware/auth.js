import { includes } from "lodash";

const isAuthorized = (path, loginUserId) => {
  // console.log("path", path)
  // console.log("loginuserid in isAuthorized", loginUserId)
  switch (path) {
    case "":
      return true;
    case "itc":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "13", "14", "15", "18", "19", "23", "24"].includes(loginUserId);
       //Payments rishikesh
    case 'payments':
      return ['1', '24', '25'].includes(loginUserId); 
    case "mail":
      return ["1", "5", "14", "20", "23"].includes(
        loginUserId
      ); 
    case "dashboard":
      return ['1', '5'].includes(loginUserId); 
    case "customers":
      return ["1", "2", "3", "4", "5", "7", "8", "10", "19", '22','23'].includes(
        loginUserId
      );
    case "subscription":
      return ["1", "2", "3", "4", "5", "7"].includes(loginUserId);
    case "subscription-due":
      return ["1", "3", "5", "7"].includes(loginUserId);
    case "monitoring-due":
      return ["1", "3", "5", "8", "10", "19", '22', ].includes(loginUserId);
    case "training":
      return ["1", "5", "8", "10", "19", '22', ].includes(loginUserId);
    case "blocked-accounts":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "10", "19", '22', ].includes(
        loginUserId
      );
    case "jobs":// jobs-sandeep
      return ['1', "5", "7",  "24", "25", ].includes(loginUserId);

    case "scheduler":// sandeep
      return ["1",  "5", "7",  "24", "25"].includes(loginUserId);
    // case "mail-sandeep":
    //   return true;
    // case "jobs":
    // some comment
    // case "schedule":
    //   return ["1", "2", "5", "7"].includes(loginUserId);
    case "vehicles":
      return ["1", "2", "3", "4", "5", "7", "8", "10", "19", '22', "24", ].includes(
        loginUserId
      );
    case "cold-call":
      return ["1", "5", "6", "9", "10", "11", "13", "14", "18", "21"].includes(
        loginUserId
      );
    case "door-door":
    case "door-report":
    case "door-door-data":
    case "salesplus":
      return ["1", "5", "6", "9", "10", "11", "13", "14", "18", "20", "23"].includes(
        loginUserId
      );

    case "customer-service":
      return ['1', '2', '3', '5', '7', '10', '20', '22', ].includes(loginUserId); 

    case "sim-management":
      return ['1', '7', '8', '10', '19'].includes(loginUserId);

    case "items":
      return ['1', '5'].includes(loginUserId);
    case "securepath":
        return ["1", "3", "14", "19", "22", "23", "24", "25"].includes(loginUserId);
    case "securepath-vehicles":
        return ["1", "3", "14", "19", "22", "23", "24", "25"].includes(loginUserId);
    default:
      return false;
  }
};

export default isAuthorized;
