export const leadSource = [
  { label: "Door to Door", value: "Door to Door" },
  { label: "Referral", value: "Referral" },
  { label: "Company Lead", value: "Company Lead" },
  { label: "Cold Calling", value: "Cold Calling" },
  { label: "Dealer", value: "Dealer" },
  { label: "Other", value: "Other" },
];

export const leadType = [
  { label: "New", value: "New" },
  { label: "Migration", value: "Migration" },
  { label: "Existing Customer", value: "Existing Customer" },
];

export const implementationType = [
  { label: "ASATEEL", value: "ASATEEL" },
  { label: "LOCATOR+ASATEEL", value: "LOCATOR+ASATEEL" },
  { label: "SHAHIN", value: "SHAHIN" },
];

export const allImplementationType = [
  { label: "LOCATOR", value: "LOCATOR" },
  { label: "ASATEEL", value: "ASATEEL" },
  { label: "LOCATOR+ASATEEL", value: "LOCATOR+ASATEEL" },
  { label: "SECUREPATH", value: "SECUREPATH" },
  { label: "LOCATOR+SECUREPATH", value: "LOCATOR+SECUREPATH" },
  { label: "RASID", value: "RASID" },
  { label: "SERVICE", value: "SERVICE" },
  { label: "SHAHIN", value: "SHAHIN" },
  { label: "SECUREPATH PREMIUM", value: "SECUREPATH PREMIUM" },
  { label: "SECUREPATH PREMIUM+LOCATOR", value: "SECUREPATH PREMIUM+LOCATOR" },
  { label: "OTHER", value: "OTHER" },
];

export const projectStatus = [
  { label: "New", value: "New" },
  { label: "Account Created", value: "Account Created" },
  { label: "Traffic File Added", value: "Traffic File Added" },
  { label: "On Going Installation", value: "On Going Installation" },
  { label: "Completed", value: "Completed" },
];

export const invoiceStatus = [
  { label: "Invoiced", value: "Invoiced" },
  { label: "Not Invoiced", value: "Not Invoiced" },
];

export const paymentStatus = [
  { label: "Paid", value: "Paid" },
  { label: "Not Paid", value: "Not Paid" },
];

export const editFieldModalData = {
  "Lead Status": {
    "name": "leadSource",
    "options": leadSource
  },
  "Lead Type": {
    "name": "leadType",
    "options": leadType
  },
  "Implementation Type": {
    "name": "implementationType",
    "options": implementationType
  },
  "Project Status": {
    "name": "projectStatus",
    "options": projectStatus
  },
  "Invoice Status": {
    "name": "invoiceStatus",
    "options": invoiceStatus
  },
  "Payment Status": {
    "name": "paymentStatus",
    "options": paymentStatus
  },
}