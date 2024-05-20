import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import carParked from "../../assets/images/car_parked.png";
import carMoving from "../../assets/images/car_moving.png";
import carIdling from "../../assets/images/car_idling.png";
import { format } from "date-fns";

// options data
export const statusOptions = [
  {
    value: "open",
    title: "Open",
  },
  {
    value: "hold",
    title: "Hold",
  },
  {
    value: "collected",
    title: "Collected",
  },
  {
    value: "recorded",
    title: "Recorded",
  },
];

export const paymentOptions = [
  {
    value: "cheque",
    title: "Cheque",
  },
  {
    value: "cash",
    title: "Cash",
  },
  {
    value: "card",
    title: "Card",
  },
  {
    value: "net banking",
    title: "Net Banking",
  },
];

export const emiratesOptions = [
  {
    id: 1,
    value: "Abu Dhabi (AZ)",
  },
  {
    id: 2,
    value: "Ajman (AJ)",
  },
  {
    id: 3,
    value: "Al Ain",
  },
  {
    id: 4,
    value: "Dubai (DU)",
  },
  {
    id: 5,
    value: "Fujairah (FU)",
  },
  {
    id: 6,
    value: "Ras Al Khaimah (RK)",
  },
  {
    id: 7,
    value: "Sharjah (SH)",
  },
  {
    id: 8,
    value: "Umm Al Quwain (UQ)",
  },
];

export const invoiceOptions = [
  {
    value: "yes",
    title: "Yes",
  },
  {
    value: "no",
    title: "No",
  },
];

export const collectedByOptions = [
  "Ahammed Ajmal",
  "AJMAL",
  "Ajmal M",
  "Celine",
  "Faizal",
  "FALUL",
  "Harshad",
  "Jasel",
  "MIDHUN",
  "Moinudeen",
  "Musthafa",
  "Nisamudheen",
  "Nishad",
  "RASIK",
  "Reyn",
  "Sanjith",
  "Shameem",
  "SHAMNAD",
  "Vishal",
];

export const paymentReportHeaders = [
  "ID",
  "Posted By",
  "Posted Date",
  "Company Name",
  "Contact Name",
  "Contact Number",
  "Amount",
  "Emirate",
  "Payment Type",
  "Latitude",
  "Longitude",
  "Location",
  "Remarks",
  "Original Invoice",
  "Holded On",
  "Recorded On",
  "Collected On",
  "Collected By",
  "Status",
  "Created At",
  "Updated At",
];

// Yup validation schema
export const paymentValidationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company Name is required"),
  contactName: Yup.string().required("Contact Name is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
  amount: Yup.number().required("Amount is required"),
  emirate: Yup.string().oneOf(
    [
      "Abu Dhabi (AZ)",
      "Dubai (DU)",
      "Sharjah (SH)",
      "Ajman (AJ)",
      "Umm Al Quwain (UQ)",
      "Ras Al Khaimah (RK)",
      "Fujairah (FU)",
      "Al Ain"
    ],
    "Invalid emirate"
  ),
  paymentType: Yup.string().oneOf(["cash", "cheque", "card", "net banking"]),
  originalInvoice: Yup.string().oneOf(["yes", "no"]),
  coordinate: Yup.string()
    .required("Coordinate is required")
    .test(
      "is-coordinate-format",
      'Coordinate must be in the format "latitude, longitude"',
      (value) => {
        if (!value) return false; // If no value provided, return false
        const coordinates = value.split(",").map((coord) => coord.trim());
        return (
          coordinates.length === 2 &&
          !isNaN(coordinates[0]) &&
          !isNaN(coordinates[1])
        );
      }
    ),
  location: Yup.string().required("Location is required"),
  note: Yup.string().max(500),
  status: Yup.string().oneOf(["open", "collected", "hold", "recorded"]),
  collectedBy: Yup.string().when("status", {
    is: (value) => value === "collected" || value === "recorded",
    then: Yup.string().required("Collected By is required"),
    otherwise: Yup.string().notRequired(),
  }),
});

// ==================   utility functions   ==================== //

// fetching user ID to pass as posted By
export const fetchUserId = () => localStorage.getItem("loginUserId");

// fetching user type for delete authentication.
export const fetchLocalData = (key) => localStorage.getItem(key);

// fetching authVehicleToken
export const fetchVehicleToken = () => localStorage.getItem("authVehicleToken");

// store data in local storage
export const storeLocally = (key, value) => localStorage.setItem(key, value);

//  function to find the center of google maps
export const findCenter = (lat, lng) => ({
  lat: parseFloat(lat),
  lng: parseFloat(lng),
});

// status color setting according to payment status
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "open":
      // orange
      return "#F69607";
    case "recorded":
      // blue
      return "#1e90ff";
    case "collected":
      // green
      return "green";
    case "hold":
      // red
      return "#EA0920";
    default:
      return null;
  }
};

export const getStatusDate = (status, paymentData) => {
  switch (status.toLowerCase()) {
    case "open":
      return format(new Date(paymentData?.date), "yyyy-MM-dd");
    case "recorded":
      return format(new Date(paymentData?.recordedOn), "yyyy-MM-dd");
    case "collected":
      return format(new Date(paymentData?.collectedOn), "yyyy-MM-dd");
    case "hold":
      return format(new Date(paymentData?.holdedOn), "yyyy-MM-dd");
    default:
      return null;
  }
};

// car icon object according to the status
export const getVehicleMarker = (status) => {
  let color;
  let icon;
  const anchor = new window.google.maps.Point(18, 32); 
  switch (status) {
    case "parking":
      color = "red";
      icon = carParked;
      break;
    case "moving":
      color = "green";
      icon = carMoving;
      break;
    case "idling":
      color = "yellow";
      icon = carIdling;
      break;
    default:
      return null;
  }
  return { url: icon, anchor };
};

// Pin Icon for POI
export const getPOIMarker = (status) => {
  const markerSvg = `
  <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="9" r="6" fill="${getStatusColor(status)}" />
    <rect x="11" y="14" width="2" height="8" fill='#333333' />
  </svg>
`;

//  btoa - binary to ascii converting to base 64 data
  const svgDataURI = `data:image/svg+xml;base64,${btoa(markerSvg)}`;
  const anchor = new window.google.maps.Point(12, 24);

  return { url: svgDataURI, scale: 1.8, anchor };
};

// Sweet alert
export const MySweetAlert = withReactContent(Swal);
